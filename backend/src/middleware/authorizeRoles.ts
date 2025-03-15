import { NextFunction, Request, Response } from "express";
import { Role } from "../config/roles";
import { ForbiddenError, UnauthorizedError } from "../errors";

export const authorizeRoles = (...allowedRoles: Role[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            throw new UnauthorizedError("Unauthorized: No user found.");
        }

        if (!req.user.role || !allowedRoles.includes(req.user.role)) {
            throw new ForbiddenError("Forbidden: You do not have the required permissions.");
        }

        next();
    };
};