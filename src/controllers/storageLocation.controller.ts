import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../utils/logger';
import StorageLocation from '../models/storageLocation.model';
import { AuthRequest } from '../../types/express';

export const createStorageLocation = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, type, description } = req.body;

        if (!name || !type) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: 'Name and type are required' });
            return;
        }

        const exists = await StorageLocation.findOne({ where: { name } });
        if (exists) {
            res.status(StatusCodes.CONFLICT).json({ error: 'Location already exists' });
            return;
        }

        const location = await StorageLocation.create({ name, type, description });

        res.status(StatusCodes.CREATED).json({
            message: 'Location created successfully',
            location
        });
    } catch (err: any) {
        logger.error('Create storage location error: ' + err.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error creating storage location' });
    }
};

export const getAllStorageLocations = async (req: Request, res: Response): Promise<void> => {
    try {
        const locations = await StorageLocation.findAll();
        res.status(StatusCodes.OK).json({ locations });
    } catch (err: any) {
        logger.error('Get storage locations error: ' + err.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
    }
};
