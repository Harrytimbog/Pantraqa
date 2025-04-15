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
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(today.getDate() - 7);

        // Total stock-ins today
        const totalInToday = await StockLog.sum('quantity', {
            where: {
                action: 'in',
                createdAt: { [Op.gte]: today }
            }
        });

        // Total stock-outs today
        const totalOutToday = await StockLog.sum('quantity', {
            where: {
                action: 'out',
                createdAt: { [Op.gte]: today }
            }
        });

        // Top 3 drinks moved this week
        const topDrinksThisWeek = await StockLog.findAll({
            attributes: [
                'drinkId',
                [fn('SUM', col('quantity')), 'totalMoved']
            ],
            include: [{ model: Drink, attributes: ['name', 'size'] }],
            where: { createdAt: { [Op.gte]: oneWeekAgo } },
            group: ['drinkId', 'Drink.id'],
            order: [[fn('SUM', col('quantity')), 'DESC']],
            limit: 3
        });

        // Current stock by location
        const currentStockByLocation = await Stock.findAll({
            attributes: [
                'storageLocationId',
                [fn('SUM', col('quantity')), 'totalQuantity']
            ],
            include: [{ model: StorageLocation, attributes: ['name'] }],
            group: ['storageLocationId', 'StorageLocation.id']
        });

        // Most active user (fix: no alias in ORDER BY)
        const mostActiveUser = await StockLog.findOne({
            attributes: [
                'userId',
                [fn('COUNT', col('StockLog.id')), 'actionCount']
            ],
            include: [{ model: User, attributes: ['email', 'role'] }],
            where: { createdAt: { [Op.gte]: oneWeekAgo } },
            group: ['userId', 'User.id'],
            order: [[fn('COUNT', col('StockLog.id')), 'DESC']]
        });

        res.status(StatusCodes.OK).json({
            totalInToday: parseInt(totalInToday as any) || 0,
            totalOutToday: parseInt(totalOutToday as any) || 0,
            topDrinksThisWeek,
            currentStockByLocation,
            mostActiveUser
        });
    } catch (err: any) {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to fetch dashboard stats' });
    }
};
