import { AppError } from "./AppError";

export class ConflictError extends AppError {
  statusCode = 409;

  constructor(message = "Resource already exists") {
    super(message);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
