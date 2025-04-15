import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../utils/logger';
import Stock from '../models/stock.model';
import { AuthRequest } from '../../types/express';
import Drink from '../models/drink.model';
import StorageLocation from '../models/storageLocation.model';
import StockLog from '../models/stockLog.model';
import { Op, col } from 'sequelize';

export const stockIn = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { drinkId, storageLocationId, quantity } = req.body;

        if (!drinkId || !storageLocationId || !quantity) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: 'All fields are required' });
            return;
        }

        const stock = await Stock.findOne({ where: { drinkId, storageLocationId } });

        if (stock) {
            stock.quantity += quantity;
            await stock.save();

            await StockLog.create({
                userId: req.user?.id!,
                drinkId,
                storageLocationId,
                quantity,
                action: 'in'
            });

            res.status(StatusCodes.OK).json({ message: 'Stock updated', stock });
        } else {
            const newStock = await Stock.create({
                drinkId,
                storageLocationId,
                quantity,
                threshold: 10
            });

            await StockLog.create({
                userId: req.user?.id!,
                drinkId,
                storageLocationId,
                quantity,
                action: 'in'
            });

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

        await StockLog.create({
            userId: req.user?.id!,
            drinkId,
            storageLocationId,
            quantity,
            action: 'out'
        });

        res.status(StatusCodes.OK).json({ message: 'Stock removed successfully', stock });
    } catch (err: any) {
        logger.error('Stock-out error: ' + err.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
    }
};

export const getLowStockAlerts = async (req: Request, res: Response): Promise<void> => {
    try {
        const lowStockItems = await Stock.findAll({
            where: {
                quantity: { [Op.lte]: col('threshold') }
            },
            include: [
                { model: Drink, attributes: ['name', 'size'] },
                { model: StorageLocation, attributes: ['name'] }
            ],
            order: [['quantity', 'ASC']]
        });

        const formatted = lowStockItems.map(item => ({
            drink: item.Drink?.name,
            size: item.Drink?.size,
            location: item.StorageLocation?.name,
            quantity: item.quantity,
            threshold: item.threshold
        }));

        res.status(StatusCodes.OK).json({ alerts: formatted });
    } catch (err: any) {
        console.error('Low stock alert error:', err.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to fetch low stock alerts' });
    }
};

export const updateStockThreshold = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { threshold } = req.body;

        if (!threshold || isNaN(threshold)) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: 'Valid threshold is required' });
            return;
        }

        const stock = await Stock.findByPk(id);

        if (!stock) {
            res.status(StatusCodes.NOT_FOUND).json({ error: 'Stock not found' });
            return;
        }

        stock.threshold = threshold;
        await stock.save();

        res.status(StatusCodes.OK).json({
            message: 'Threshold updated successfully',
            stock
        });
    } catch (err: any) {
        logger.error('Threshold update error: ' + err.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
    }
};
