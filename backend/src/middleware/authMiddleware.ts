import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import globalConfig from "../config/global";
import prisma from "../config/db";
import { Role } from "../config/roles";
import { ForbiddenError, UnauthorizedError } from "../errors";

// Extend Express Request to include `user`
declare module "express-serve-static-core" {
  interface Request {
    user?: { id: string; email: string; role: Role };
  }
}

export const authenticateJWT = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Access denied. No token provided."));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, globalConfig.jwt.secret) as { id: string };
    
    const user = await prisma.users.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        roles: {
          select: { name: true }
        }
      }
    });

    if (!user) {
      return next(new ForbiddenError("User not found."));
    }

    req.user = { 
      id: user.id, 
      email: user.email, 
      role: user.roles?.name as Role,
    };

    next();
  } catch (err) {
    return next(new ForbiddenError("Invalid or expired token"));
  }
};
