import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { InternalModule } from '~/modules/internal';
import {
  AnotacaoItemListDTO,
  CredorItemListDTO,
  DevedorItemListDTO,
  PefinModule,
} from '~/modules/pefin/';
import { API_SECRET_NAME, SecurityModule } from '~/modules/security';

type INestApplication = Awaited<ReturnType<typeof NestFactory.create>>;

export function swaggerFactory(app: INestApplication, version: string) {
  pefinSwagger(app, version);
  internalSwagger(app, version);
}

function pefinSwagger(app: INestApplication, version: string) {
  const config = new DocumentBuilder()
    .setTitle('Teddy Digital - Pefin API')
    .setDescription(
      `Documentação de referência para uso de empresas parceiras. É necessário solicitar sua chave de api e o segredo para ter acesso aos recursos.
      
      Realize a autenticação na API clicando em Authorize e informando a chave e o segredo recebidos. `,
    )
    .setVersion(version)
    .addApiKey(
      {
        type: 'apiKey',
        name: 'api-secret',
        in: 'header',
      },
      API_SECRET_NAME,
    )
    .addServer('https://negativacao-api.teddy360.com.br')
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [CredorItemListDTO, AnotacaoItemListDTO, DevedorItemListDTO],
    include: [PefinModule],
  });

  SwaggerModule.setup('docs-swagger', app, document);
}

function internalSwagger(app: INestApplication, version: string) {
  const config = new DocumentBuilder()
    .setTitle('Teddy Digital - Internal API')
    .setDescription('API para a equipe técnica da Teddy')
    .setVersion(version)
    .addBearerAuth()
    .build();

  const securityDocument = SwaggerModule.createDocument(app, config, {
    extraModels: [],
    include: [SecurityModule, InternalModule],
  });

  SwaggerModule.setup('docs-swagger-for-internal', app, securityDocument);
}
