import { ArgumentsHost, Catch, HttpException, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import * as stringify from 'json-stringify-safe';

import { ProblemDetailsDto } from '../dtos';

@Catch()
export class DefaultExceptionFilter extends BaseExceptionFilter {
  protected logger = new Logger('DefaultExceptionFilter');
  catch(exception: any, host: ArgumentsHost) {
    const httpResponse = host.switchToHttp().getResponse<Response>();
    const httpRequest = host.switchToHttp().getRequest<Request>();
    const path = httpRequest.path;

    if (exception instanceof HttpException) {
      const exceptionRes = exception.getResponse();
      const status = exception.getStatus();
      if (exceptionRes instanceof ProblemDetailsDto) {
        exceptionRes.instance = path;
        return httpResponse.status(status).json(exceptionRes);
      }

      return httpResponse.status(status).json(
        new ProblemDetailsDto({
          title: exceptionRes['error'],
          detail: exceptionRes['message'],
          instance: path,
        }),
      );
    }

    this.logger.error(
      stringify({
        req: {
          path: httpRequest.path,
          method: httpRequest.method,
        },
        exception: {
          message: exception?.message,
          stack: exception?.stack,
        },
      }),
    );

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
