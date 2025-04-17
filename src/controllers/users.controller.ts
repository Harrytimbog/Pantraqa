import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { StatusCodes } from 'http-status-codes';
import StockLog from '../models/stockLog.model';
import Drink from '../models/drink.model';
import StorageLocation from '../models/storageLocation.model';
import User from '../models/user.model';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'email', 'role'], // Only select the fields needed
        });

        res.status(200).json(users);  // Send back users as JSON
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getUserActivityLogs = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = parseInt(req.params.userId);
        const { startDate, endDate, page = 1, limit = 10 } = req.query;

        if (isNaN(userId)) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid user ID' });
            return;
        }

        const where: any = { userId };
        if (startDate && endDate) {
            where.createdAt = {
                [Op.between]: [new Date(startDate as string), new Date(endDate as string)]
            };
        }

        const offset = (Number(page) - 1) * Number(limit);

        const logs = await StockLog.findAndCountAll({
            where,
            include: [
                { model: Drink, attributes: ['name', 'size', 'category'] },
                { model: StorageLocation, attributes: ['name', 'type'] }
            ],
            limit: Number(limit),
            offset,
            order: [['createdAt', 'DESC']]
        });

        res.status(StatusCodes.OK).json({
            total: logs.count,
            page: Number(page),
            limit: Number(limit),
            data: logs.rows
        });
    } catch (err: any) {
        console.error('User activity log error:', err.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to fetch user activity logs' });
    }
};