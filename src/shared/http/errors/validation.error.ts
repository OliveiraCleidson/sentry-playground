import { ValidationFieldError } from '../dtos/validation-problem-details.dto';

export class ValidationException extends Error {
  constructor(public readonly fieldErrors: ValidationFieldError[]) {
    super('ValidationException');
  }
}
