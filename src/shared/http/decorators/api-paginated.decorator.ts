import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

// TODO: Colocar para o JEST ignorar no coverage.
// eslint-disable-next-line @typescript-eslint/ban-types
export function ApiPaginated(model: string | Function, description?: string) {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        properties: {
          data: {
            type: 'array',
            items: {
              $ref: getSchemaPath(model),
            },
          },
          meta: {
            properties: {
              pagination: {
                properties: {
                  currentPage: {
                    type: 'number',
                  },
                  totalPages: {
                    type: 'number',
                  },
                  pageSize: {
                    type: 'number',
                  },
                  totalItems: {
                    type: 'number',
                  },
                },
              },
            },
          },
        },
      },
      description:
        description ?? 'Ocorreu um problema ao processar a requisição',
    }),
  );
}
