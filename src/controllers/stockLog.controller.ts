import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import StockLog from '../models/stockLog.model';
import Drink from '../models/drink.model';
import StorageLocation from '../models/storageLocation.model';
import { logger } from '../utils/logger';
import { Op } from 'sequelize';
import { Parser } from 'json2csv';
import User from '../models/user.model';

export const getAllStockLogs = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            userId,
            drinkId,
            storageLocationId,
            action,
            dateFrom,
            dateTo,
            page = '1',
            limit = '20'
        } = req.query;

        const filters: any = {};
        if (userId) filters.userId = userId;
        if (drinkId) filters.drinkId = drinkId;
        if (storageLocationId) filters.storageLocationId = storageLocationId;
        if (action) filters.action = action;
        if (dateFrom || dateTo) {
            filters.createdAt = {
                ...(dateFrom && { [Op.gte]: new Date(dateFrom as string) }),
                ...(dateTo && { [Op.lte]: new Date(dateTo as string) })
            };
        }

        const pageNumber = parseInt(page as string);
        const pageSize = parseInt(limit as string);
        const offset = (pageNumber - 1) * pageSize;

        const { count, rows: logs } = await StockLog.findAndCountAll({
            where: filters,
            include: [
                { model: User, attributes: ['id', 'email', 'role'] },
                { model: Drink, attributes: ['id', 'name', 'size', 'category'] },
                { model: StorageLocation, attributes: ['id', 'name', 'type'] }
            ],
            order: [['createdAt', 'DESC']],
            limit: pageSize,
            offset
        });

        res.status(StatusCodes.OK).json({
            total: count,
            totalPages: Math.ceil(count / pageSize),
            currentPage: pageNumber,
            logs
        });
    } catch (err: any) {
        logger.error('Paginated log fetch error: ' + err.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
    }
};


export const exportStockLogsCSV = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            userId,
            drinkId,
            storageLocationId,
            action,
            dateFrom,
            dateTo
        } = req.query;

        const filters: any = {};
        if (userId) filters.userId = userId;
        if (drinkId) filters.drinkId = drinkId;
        if (storageLocationId) filters.storageLocationId = storageLocationId;
        if (action) filters.action = action;
        if (dateFrom || dateTo) {
            filters.createdAt = {
                ...(dateFrom && { [Op.gte]: new Date(dateFrom as string) }),
                ...(dateTo && { [Op.lte]: new Date(dateTo as string) })
            };
        }

        const logs = await StockLog.findAll({
            where: filters,
            include: [
                { model: User, attributes: ['email'] },
                { model: Drink, attributes: ['name', 'size', 'category'] },
                { model: StorageLocation, attributes: ['name'] }
            ],
            order: [['createdAt', 'DESC']]
        });

        const formattedLogs = logs.map(log => ({
            date: log.createdAt.toISOString(),
            user: log.User?.email,
            drink: `${log.Drink?.name} (${log.Drink?.size})`,
            category: log.Drink?.category,
            location: log.StorageLocation?.name,
            quantity: log.quantity,
            action: log.action
        }));

        const parser = new Parser();
        const csv = parser.parse(formattedLogs);

        res.header('Content-Type', 'text/csv');
        res.attachment('stock-logs.csv');
        res.send(csv);
    } catch (err: any) {
        logger.error('CSV export error: ' + err.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Export failed' });
    }
};

