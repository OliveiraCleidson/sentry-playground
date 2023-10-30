import { join } from 'path';

import * as Client from 'ssh2-sftp-client';
import { Mutex } from 'async-mutex';

import { ISerasaAdapter } from './contract';
import { ListResultItem, SendFileCommand } from './types';
import { ApplicationLogger } from '~/shared/libs';

type SerasaFactoryConfig = {
  connectionName?: string;
  host: string;
  username: string;
  privateKey: string;
  port: number;
};

export class SerasaSFTPClient implements ISerasaAdapter {
  protected config: Omit<SerasaFactoryConfig, 'connectionName'>;
  protected client: Client;
  protected mutex: Mutex;
  protected logger: ApplicationLogger = new ApplicationLogger(
    'SerasaSFTPClient',
  );
  private _isConnected: boolean = false;
  private connectedStack: number[] = [];

  constructor(config: SerasaFactoryConfig) {
    const { connectionName, ...rest } = config;
    this.config = rest;
    this.client = new Client(connectionName ?? 'SERASA');
    this.mutex = new Mutex();
  }

  get isConnected() {
    return this._isConnected;
  }

  async list(folder: string): Promise<ListResultItem[]> {
    if (!this.isConnected) throw new Error('SerasaSFTPCLient is not connected');
    const result = await this.client.list(folder);

    return result.map((v) => ({
      name: v.name,
      type: v.type === 'd' ? 'directory' : 'object',
      size: v.size,
      modifyTime: new Date(v.modifyTime),
    }));
  }

  get(filePath: string): Promise<Buffer> {
    return this.client.get(filePath) as Promise<Buffer>;
  }

  async getWithStream(
    filePath: string,
    writeStream: NodeJS.WritableStream,
  ): Promise<NodeJS.WritableStream> {
    return this.client.get(
      filePath,
      writeStream,
    ) as Promise<NodeJS.WritableStream>;
  }

  async connect() {
    const release = await this.mutex.acquire();
    try {
      this.connectedStack.push(1);
      if (this._isConnected) return;

      await this.client.connect(this.config);
      this._isConnected = true;
    } finally {
      release();
    }
  }

  async disconnect() {
    const release = await this.mutex.acquire();
    try {
      this.connectedStack.pop();
      if (
        !this._isConnected ||
        // Não desconecta se ainda existem conexões ativas
        // Aguarda todas as conexões solicitarem desconexão
        this.connectedStack.length > 0
      )
        return;

      this.client.end();
      this._isConnected = false;
    } finally {
      release();
    }
  }

  async sendFile(data: SendFileCommand): Promise<[boolean, Error]> {
    try {
      await this.client.put(
        data.body,
        join(data.destinationPath, data.fileName),
        {
          /**
           * O Serasa não reconhece o encoding utf-8
           * Por isso, é necessário enviar o arquivo com encoding ascii
           * e também ler o arquivo com encoding ascii
           */
          writeStreamOptions: {
            encoding: 'ascii',
          },
          readStreamOptions: {
            encoding: 'ascii',
          },
        },
      );

      return [true, null];
    } catch (err) {
      return [false, err];
    }
  }
}
