import { ProblemDetailsDto } from './problem-details.dto';

import { SharedCodeErrors } from '../../http/errors/codes';

export class ValidationFieldError {
  field: string;

  messages: string[];
}

export class ValidationProblemDetailsDto extends ProblemDetailsDto {
  constructor(data: ValidationProblemDetailsDto) {
    super(data);
    this.errors = data.errors;
  }

  title: SharedCodeErrors.VALIDATION_ERROR;

  errors: ValidationFieldError[];
}
