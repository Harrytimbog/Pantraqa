import { Request, Response } from 'express';
import { Op, fn, col } from 'sequelize';
import { StatusCodes } from 'http-status-codes';
import StockLog from '../models/stockLog.model';
import Drink from '../models/drink.model';
import StorageLocation from '../models/storageLocation.model';
import User from '../models/user.model';
import Stock from '../models/stock.model';

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
    try {
        const { startDate, endDate } = req.query;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let start = startDate ? new Date(startDate as string) : new Date(today);
        let end = endDate ? new Date(endDate as string) : new Date(today);

        if (!startDate || !endDate) {
            // Default to past 7 days if not provided
            start.setDate(end.getDate() - 7);
        }

        // Normalize end to include full end day
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        // Total stock-ins in range
        const totalIn = await StockLog.sum('quantity', {
            where: {
                action: 'in',
                createdAt: { [Op.between]: [start, end] }
            }
        });

        // Total stock-outs in range
        const totalOut = await StockLog.sum('quantity', {
            where: {
                action: 'out',
                createdAt: { [Op.between]: [start, end] }
            }
        });

        // Top 3 drinks moved in range
        const topDrinks = await StockLog.findAll({
            attributes: [
                'drinkId',
                [fn('SUM', col('quantity')), 'totalMoved']
            ],
            include: [{ model: Drink, attributes: ['name', 'size'] }],
            where: { createdAt: { [Op.between]: [start, end] } },
            group: ['drinkId', 'Drink.id'],
            order: [[fn('SUM', col('quantity')), 'DESC']],
            limit: 3
        });

        // Current stock by location (no date filter)
        const currentStockByLocation = await Stock.findAll({
            attributes: [
                'storageLocationId',
                [fn('SUM', col('quantity')), 'totalQuantity']
            ],
            include: [{ model: StorageLocation, attributes: ['name'] }],
            group: ['storageLocationId', 'StorageLocation.id']
        });

        // Most active user in range
        const mostActiveUser = await StockLog.findOne({
            attributes: [
                'userId',
                [fn('COUNT', col('StockLog.id')), 'actionCount']
            ],
            include: [{ model: User, attributes: ['email', 'role'] }],
            where: { createdAt: { [Op.between]: [start, end] } },
            group: ['userId', 'User.id'],
            order: [[fn('COUNT', col('StockLog.id')), 'DESC']]
        });

        res.status(StatusCodes.OK).json({
            totalIn: parseInt(totalIn as any) || 0,
            totalOut: parseInt(totalOut as any) || 0,
            topDrinks,
            currentStockByLocation,
            mostActiveUser
        });
    } catch (err: any) {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to fetch dashboard stats' });
    }
};
