import { AppError } from "./AppError";

export class InternalServerError extends AppError {
  statusCode = 500;

  constructor(message = "Internal server error") {
    super(message);
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
