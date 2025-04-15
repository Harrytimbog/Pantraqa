import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../utils/logger';
import Drink from '../models/drink.model';
import { AuthRequest } from '../../types/express';

export const createDrink = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, size, category } = req.body;

        if (!name || !size || !category) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: 'All fields are required' });
            return;
        }

        const existing = await Drink.findOne({ where: { name, size } });
        if (existing) {
            res.status(StatusCodes.CONFLICT).json({ error: 'Drink already exists' });
            return;
        }

        const drink = await Drink.create({ name, size, category });

        res.status(StatusCodes.CREATED).json({
            message: 'Drink added successfully',
            drink
        });
    } catch (err: any) {
        logger.error('Create drink error: ' + err.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
    }
};

export const getAllDrinks = async (req: Request, res: Response): Promise<void> => {
    try {
        const drinks = await Drink.findAll();
        res.status(StatusCodes.OK).json({ drinks });
    } catch (err: any) {
        logger.error('Get drinks error: ' + err.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
    }
};