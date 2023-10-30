import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse } from '@nestjs/swagger';

import { ValidationProblemDetailsDto } from '../dtos';

// @TODO: Colocar para o JEST ignorar no coverage.
export function ApiValidationError() {
  return applyDecorators(
    ApiBadRequestResponse({
      type: ValidationProblemDetailsDto,
      description:
        'Corpo da requisição, parâmetro da URL ou query está com o tipo incorreto ou sem valor.',
    }),
  );
}
