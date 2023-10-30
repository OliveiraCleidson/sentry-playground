/* eslint-disable @typescript-eslint/ban-types */
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';

import BRValidator from './validators';

export const IsCEP = (validationOptions?: ValidationOptions) =>
  applyDecorators(
    Transform(({ value }) => value.replace(/(-|\.)/g, '')),
    isCEP(validationOptions),
  );

function isCEP(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isCEP',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: { ...validationOptions, message: 'CEP inválido.' },
      validator: {
        validate(value: any) {
          return typeof value === 'string' && BRValidator.isCEP(value);
        },
      },
    });
  };
}

export function IsCNPJ(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsCNPJ',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: { ...validationOptions, message: 'CNPJ inválido.' },
      validator: {
        validate(value: any) {
          return typeof value === 'string' && BRValidator.isCNPJ(value);
        },
      },
    });
  };
}

export function IsCPF(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsCPF',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: { ...validationOptions, message: 'CPF inválido.' },
      validator: {
        validate(value: any) {
          return typeof value === 'string' && BRValidator.isCEP(value);
        },
      },
    });
  };
}

export const IsDocumentValid = (
  propertyWithType: string,
  validationOptions?: ValidationOptions,
) =>
  applyDecorators(
    Transform(({ value }) => value.replace(/(-|\.)/g, '')),
    isDocumentValid(propertyWithType, validationOptions),
  );

function isDocumentValid(
  propertyWithType: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsDocumentValid',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [propertyWithType],
      options: {
        ...validationOptions,
        message: `Documento inválido.`,
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [propWithType] = args.constraints;
          const type = (args.object as any)[propWithType]?.toUpperCase();
          if (type === 'CPF') {
            return typeof value === 'string' && BRValidator.isCPF(value);
          }

          return typeof value === 'string' && BRValidator.isCNPJ(value);
        },
      },
    });
  };
}
