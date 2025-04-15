import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../utils/logger';
import Stock from '../models/stock.model';
import { AuthRequest } from '../../types/express';
import Drink from '../models/drink.model';
import StorageLocation from '../models/storageLocation.model';

export const stockIn = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { drinkId, storageLocationId, quantity } = req.body;

        if (!drinkId || !storageLocationId || !quantity) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: 'All fields are required' });
            return;
        }

        // Check if stock already exists
        const stock = await Stock.findOne({ where: { drinkId, storageLocationId } });

        if (stock) {
            // Update quantity
            stock.quantity += quantity;
            await stock.save();
            res.status(StatusCodes.OK).json({ message: 'Stock updated', stock });
        } else {
            // Create new stock record
            const newStock = await Stock.create({ drinkId, storageLocationId, quantity });
            res.status(StatusCodes.CREATED).json({ message: 'Stock created', stock: newStock });
        }
    } catch (err: any) {
        logger.error('Stock-in error: ' + err.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
    }
};

export const getAllStock = async (req: Request, res: Response): Promise<void> => {
    try {
        const stock = await Stock.findAll({
            include: [
                { model: Drink, attributes: ['name', 'size', 'category'] },
                { model: StorageLocation, attributes: ['name', 'type'] }
            ],
            order: [['storageLocationId', 'ASC'], ['drinkId', 'ASC']]
        });

        res.status(StatusCodes.OK).json({ stock });
    } catch (err: any) {
        logger.error('Fetch stock error: ' + err.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
    }
};

export const stockOut = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { drinkId, storageLocationId, quantity } = req.body;

        if (!drinkId || !storageLocationId || !quantity) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: 'All fields are required' });
            return;
        }

        const stock = await Stock.findOne({ where: { drinkId, storageLocationId } });

        if (!stock) {
            res.status(StatusCodes.NOT_FOUND).json({ error: 'Stock record not found' });
            return;
        }

        if (stock.quantity < quantity) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: 'Not enough stock available' });
            return;
        }

        stock.quantity -= quantity;
        await stock.save();

        res.status(StatusCodes.OK).json({
            message: 'Stock removed successfully',
            stock
        });
    } catch (err: any) {
        logger.error('Stock-out error: ' + err.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
    }
};