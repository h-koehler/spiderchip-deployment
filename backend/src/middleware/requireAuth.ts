import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors';
import { Role } from '../config/roles';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        throw new UnauthorizedError('No token provided');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        req.user = decoded as { id: string; email: string; role_id: string; username: string; role: Role };
        next();
    } catch (error) {
        throw new UnauthorizedError('Invalid token');
    }
}; 