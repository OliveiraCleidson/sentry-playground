import { applyDecorators } from '@nestjs/common';
import { ApiResponseOptions } from '@nestjs/swagger';

import { ProblemDetailsDto } from '../dtos';

type ApiDecorator = (
  options?: ApiResponseOptions,
) => MethodDecorator & ClassDecorator;

// @TODO: Colocar para o JEST ignorar no coverage.
export function ApiProblemDetails(
  decorator: ApiDecorator,
  description?: string,
) {
  return applyDecorators(
    decorator({
      type: ProblemDetailsDto,
      description:
        description ?? 'Ocorreu um problema ao processar a requisição',
    }),
  );
}
