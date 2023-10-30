import { applyDecorators } from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';

// @TODO: Colocar para o JEST ignorar no coverage.
export function ApiCreatedReturnId(typeOfId: 'number' | 'string') {
  return applyDecorators(
    ApiCreatedResponse({
      schema: {
        properties: {
          id: {
            type: typeOfId === 'number' ? 'number' : 'string',
            example:
              typeOfId === 'number'
                ? 18
                : 'cec0af1e-61fd-481c-a4a4-2dd875a1e039',
          },
        },
      },
      description: 'Retorna o identificador único do recurso criado.',
    }),
  );
}
