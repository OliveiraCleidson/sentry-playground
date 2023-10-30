/**
 * Ordem dos filtros, do último ao primeiro a ser chamado
 * 1. DefaultExceptionFilter
 * 2. ValidationFilter
 */
import { join } from 'path';

import {
  INestApplication,
  Logger,
  ValidationError,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import { AppModule } from 'src/app.module';
import { ValidationException } from 'src/shared/http/errors';
import {
  DefaultExceptionFilter,
  SentryExceptionFilter,
  ValidationFilter,
} from 'src/shared/http/filters';
import { EnvironmentUtils } from 'src/shared/utils';
import * as express from 'express';

import { swaggerFactory } from './swagger';
import { sentryFactory } from './sentry.factory';

export async function applicationFactory(version: string) {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
  );

  const logger = new Logger();

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new DefaultExceptionFilter(httpAdapter));

  app.enableCors({
    origin: '*',
    allowedHeaders: '*',
    methods: '*',
  });
  app.disable('x-powered-by');

  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
    prefix: 'v',
  });

  sentryFactory(app.getHttpAdapter().getInstance());
  app.useGlobalFilters(new SentryExceptionFilter(httpAdapter));

  configureSwagger(app, version);
  configureValidation(app);

  app.use(/^(\/docs|docs)/, express.static(join(process.cwd(), 'public')));

  return [app, logger] as const;
}

// TODO: adicionar docusauros no projeto
function configureSwagger(app: INestApplication, version: string) {
  if (EnvironmentUtils.isProductionOrHomolog()) return;

  swaggerFactory(app, version);
}

function configureValidation(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      // Aqui garante que o DTO não tenha campos a mais
      // Pois se passarmos do DTO direto para o banco
      // O TypeORM irá salvar os campos a mais e teremos um furo de segurança
      // Exemplo: passar o campo remessaSeq na criação da anotação
      whitelist: true,
      // TODO: Extrair e testar está função
      exceptionFactory(errors: ValidationError[]) {
        function getErrorMessages({ constraints, children }: ValidationError) {
          if (constraints) return Object?.values(constraints);
          if (children)
            return children?.map((ch) => Object.values(ch?.constraints)).flat();

          return null;
        }

        const fieldErrors = errors.map((err) => ({
          field: err.property,
          messages: getErrorMessages(err),
        }));

        return new ValidationException(fieldErrors);
      },
    }),
  );

  app.useGlobalFilters(new ValidationFilter());
}
