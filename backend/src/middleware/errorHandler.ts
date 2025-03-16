import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors';

/**
 * Centralized error-handling middleware
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  console.log(`[ERROR] ${err.message}`);

  // If it's an unknown error, respond with a generic 500 error
  res.status(500).send({
    errors: [{ message: "Something went wrong, please try again later" }],
  });
};
