import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import User from '../models/user.model';
import { logger } from '../utils/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const registerUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { email, name, password, role } = req.body;

        // Check if any required field is missing
        const missingFields: string[] = [];
        if (!email) missingFields.push('email');
        if (!name) missingFields.push('name');
        if (!password) missingFields.push('password');

        // If there are missing fields, return an error with the list of missing fields
        if (missingFields.length > 0) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: `${missingFields.join(', ')} field empty or not filled` });
            return;
        }

        if (password.length < 6) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: 'Password must be at least 6 characters long' });
            return;
        }
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: 'User already exists' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ email, name, password: hashedPassword, role });

        res.status(StatusCodes.CREATED).json({
            message: 'User registered',
            user: { id: user.id, email: user.email, name: user.name, role: user.role }
        });
    } catch (err: any) {
        logger.error('Register error: ' + err.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};

export const loginUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
            expiresIn: '7d'
        });

        res.status(StatusCodes.OK).json({
            token,
            user: { id: user.id, email: user.email, name: user.name, role: user.role }
        });
    } catch (err: any) {
        logger.error('Login error: ' + err.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};
