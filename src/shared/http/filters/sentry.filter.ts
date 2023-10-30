import * as Sentry from '@sentry/node';
import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';

import { ProblemDetailsDto } from '../dtos';

@Catch()
export class SentryExceptionFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    Sentry.captureException(exception);
    const httpResponse = host.switchToHttp().getResponse<Response>();
    const httpRequest = host.switchToHttp().getRequest<Request>();
    const path = httpRequest.path;

    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      const status = exception.getStatus();

      return httpResponse.status(status).json(
        new ProblemDetailsDto({
          title: res['error'],
          detail: res['message'],
          instance: res['path'],
        }),
      );
    }

    console.error(exception);

    return httpResponse.status(500).json(
      new ProblemDetailsDto({
        detail:
          'Ocorreu um erro inesperado, a equipe de desenvolvimento foi notificada e está trabalhando para resolver o problema.',
        instance: path,
        title: 'INTERNAL_SERVER_ERROR',
      }),
    );
  }
}
