import { AppError } from './AppError';

export class NotFoundError extends AppError {
  statusCode = 404;

  constructor(message = "Resource not found") {
    super(message);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
