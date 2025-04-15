import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';
import { AuthRequest } from '../../types/express';

const jwtSecret = process.env.JWT_SECRET || 'defaultSecret';

export const validateToken = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        logger.warn('Access attempted without token');
        res.status(401).json({
            success: false,
            message: 'Access denied, authentication required'
        });
        return;
    }

    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            logger.error(`Invalid token: ${err.message}`);
            res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
            return;
        }

        req.user = decoded as AuthRequest['user'];
        next();
    });
};
