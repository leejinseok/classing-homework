import { HttpStatus, Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { PageResponse } from '../../common/dto/page.response';

export const ApiResponsePaginated = <Dto extends Type<unknown>>(
  dto: Dto,
  status: number = HttpStatus.OK,
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
