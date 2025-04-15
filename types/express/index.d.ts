import { Request } from 'express';

export interface AuthRequest extends Request {
    user?: {
        id: number;
        role: 'staff' | 'manager' | 'admin';
    };
}
