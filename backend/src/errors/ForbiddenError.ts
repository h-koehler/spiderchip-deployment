import { AppError } from "./AppError";

export class ForbiddenError extends AppError {
  statusCode = 403;

  constructor(message = "Access denied") {
    super(message);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
