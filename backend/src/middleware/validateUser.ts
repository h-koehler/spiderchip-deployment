import { AuthError } from '@supabase/supabase-js';
import { Request, Response, NextFunction } from 'express';

export const validateUser = (req: Request, res: Response, next: NextFunction) => {
    // userId from JWT token is added by requireAuth middleware
    const authenticatedUserId = req.user?.id;
    // userId from URL parameter or request body
    const requestedUserId = req.params.userId || req.body.userId;

    console.log('Auth user:', authenticatedUserId);
    console.log('Requested user:', requestedUserId);

    if (!authenticatedUserId || authenticatedUserId !== requestedUserId) {
        return next(new AuthError('Unauthorized access to user data'));
    }

    next();
}; 