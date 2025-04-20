import { Request, Response } from 'express';
import User from '../models/user.model';

export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { role } = req.body;

    // Validate role
    if (!['staff', 'manager', 'admin'].includes(role)) {
        res.status(400).json({ error: 'Invalid role provided' });
        return;
    }

    try {
        const user = await User.findByPk(id);

        // If the user does not exist
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        // Prevent admin from downgrading themselves
        if (user.role === 'admin' && role !== 'admin') {
            res.status(400).json({ error: 'Admin role cannot be changed' });
            return;
        }

        // Update role
        user.role = role;
        await user.save();

        res.status(200).json({ message: 'User role updated successfully', user });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
