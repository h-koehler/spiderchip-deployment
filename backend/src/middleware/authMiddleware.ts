import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import globalConfig from "../config/global";

// Extend Express Request to include `user`
declare module "express-serve-static-core" {
  interface Request {
    user?: any;
  }
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Access denied. No token provided." });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, globalConfig.jwt.secret);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired token" });
  }
};
