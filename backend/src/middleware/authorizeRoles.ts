import { NextFunction, Request, Response } from "express";
import { Role } from "../config/roles";
import { ForbiddenError, UnauthorizedError } from "../errors";

export const authorizeRoles = (...allowedRoles: Role[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            return next(new UnauthorizedError("Unauthorized: No user found."));
        }

        if (!req.user.role || !allowedRoles.includes(req.user.role)) {
            return next(new ForbiddenError("Forbidden: You do not have the required permissions."));
        }

        next();
    };
};