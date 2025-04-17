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

// Delete a drink by ID
export const deleteDrink = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        // Check if the drink exists
        const drink = await Drink.findByPk(id);

        if (!drink) {
            res.status(StatusCodes.NOT_FOUND).json({ message: 'Drink not found' });
            return;
        }

        // Log the drink deletion
        logger.info(`Deleting drink with id ${id}: ${drink.name}`);

        await drink.destroy(); // Delete the drink from the database
        res.status(StatusCodes.NO_CONTENT).send(); // Send a No Content response

    } catch (error: any) {
        logger.error('Error deleting drink: ' + error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server error, unable to delete drink' });
    }
};