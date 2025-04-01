import { AppError } from './AppError';

export class ValidationError extends AppError {
  statusCode = 404;

  constructor(message = "Required resource not present.") {
    super(message);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }

  serializeErrors() {
    return [this.message];
  }
}
