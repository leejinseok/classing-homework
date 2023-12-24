import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { PageResponse } from 'src/common/dto/page.response';

export const ApiResponsePaginated = <Dto extends Type<unknown>>(
  dto: Dto,
  status: number = 200,
) =>
  applyDecorators(
    ApiExtraModels(PageResponse, dto),
    ApiResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PageResponse) },
          {
            properties: {
              list: {
                type: 'array',
                items: {
                  $ref: getSchemaPath(dto),
                },
              },
            },
          },
        ],
      },
      status,
    }),
  );
