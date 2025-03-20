import { AppError } from "./AppError";

export class UnauthorizedError extends AppError {
  statusCode = 401;

  constructor(message = "Unauthorized access") {
    super(message);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
