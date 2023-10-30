import { ListResultItem, SendFileCommand } from './types';

/**
 * Interface para o adaptador do Serasa
 *
 * Lista, busca e envia arquivos para o SFTP do Serasa
 */
export interface ISerasaAdapter {
  /**
   * A pasta de recebidos retorna todos os arquivos ordenados
   * pelo último criado
   */
  list(path: string): Promise<ListResultItem[]>;

  /**
   * Retorna o conteúdo do arquivo
   */
  get(filePath: string): Promise<Buffer>;

  /**
   * Busca um arquivo e escreve em um stream
   */
  getWithStream(
    filePath: string,
    writeStream: NodeJS.WritableStream,
  ): Promise<NodeJS.WritableStream>;

  isConnected: boolean;

  /**
   * Ao conectar o servidor SFTP é necessário que a conexão
   * seja fechada ao finalizar todos os processos.
   *
   * O Serasa encerra a conexão após 15 minutos.
   */
  connect(): Promise<void>;

  disconnect(): Promise<void>;

  sendFile(data: SendFileCommand): Promise<[boolean, Error]>;
}
