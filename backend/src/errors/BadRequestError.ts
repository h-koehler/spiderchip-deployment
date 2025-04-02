import { AppError } from "./AppError";

export class BadRequestError extends AppError {
  statusCode = 400;

  constructor(message = "Bad request.") {
    super(message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    return [this.message];
  }
}
