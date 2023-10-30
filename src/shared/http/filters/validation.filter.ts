import {
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
  Catch,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { ValidationException } from '../../http/errors';
import { SharedCodeErrors } from '../../http/errors/codes';
import { ValidationProblemDetailsDto } from '../dtos';

// @TODO: Adicicionar teste de unitário.
@Catch(ValidationException)
export class ValidationFilter implements ExceptionFilter {
  catch(exception: ValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    response.status(HttpStatus.BAD_REQUEST).json(
      new ValidationProblemDetailsDto({
        title: SharedCodeErrors.VALIDATION_ERROR,
        instance: request.originalUrl,
        detail: 'Ocorreu um erro de validação.',
        errors: exception.fieldErrors,
      }),
    );
  }
}
