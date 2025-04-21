import { Request, Response } from 'express';
import User from '../models/user.model';
import { StatusCodes } from 'http-status-codes';

export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { role } = req.body;

    // Validate role
    if (!['staff', 'manager', 'admin'].includes(role)) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid role provided' });
        return;
    }

    try {
        const user = await User.findByPk(id);

        // If the user does not exist
        if (!user) {
            res.status(StatusCodes.NOT_FOUND).json({ error: 'User not found' });
            return;
        }

        // Prevent admin from downgrading themselves
        if (user.role === 'admin' && role !== 'admin') {
            res.status(StatusCodes.BAD_REQUEST).json({ error: 'Admin role cannot be changed' });
            return;
        }

        // Update role
        user.role = role;
        await user.save();

        res.status(StatusCodes.OK).json({ message: 'User role updated successfully', user });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};


export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            res.status(StatusCodes.NOT_FOUND).json({ error: 'User not found' });
            return;
        }

        // Delete the user
        await user.destroy();
        res.status(StatusCodes.OK).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};
