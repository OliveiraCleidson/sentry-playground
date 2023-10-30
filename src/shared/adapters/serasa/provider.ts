import { readFileSync } from 'fs';

import { Inject, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from '@aws-sdk/client-s3';

import { EnvironmentVariables } from '~/config';
import { SERASA_ADAPTER } from './constants';
import { SerasaSFTPClient } from './implementation';

// Ao usar o ConfigService, fica acoplado a este projeto em específico, mas
// da para inicializar o provider usando o process.env direto para desacoplar,
// e é possível fazer uma abstração para pegar a private key...
export const SerasaProvider: Provider = {
  provide: SERASA_ADAPTER,
  useFactory: async (configService: ConfigService<EnvironmentVariables>) => {
    let privateKey: string;
    if (process.env.NODE_ENV === 'development') {
      privateKey = readFileSync(
        configService.get('SFTP_SERASA_SSH_KEY_PATH'),
        'utf-8',
      );
    } else {
      const s3 = new S3();

      const keyObject = await s3.getObject({
        Bucket: process.env.S3_CERTIFICATE_BUCKET_NAME,
        Key: process.env.SFTP_SERASA_SSH_KEY_PATH,
      });
      privateKey = await keyObject.Body.transformToString();
    }

    return new SerasaSFTPClient({
      connectionName: 'SERASA SFTP Client',
      host: configService.get('SFTP_SERASA_HOST'),
      port: configService.get('SFTP_SERASA_PORT'),
      username: configService.get('SFTP_SERASA_USERNAME'),
      privateKey,
    });
  },
  inject: [ConfigService],
};

export function InjectSerasaAdapter() {
  return Inject(SERASA_ADAPTER);
}
