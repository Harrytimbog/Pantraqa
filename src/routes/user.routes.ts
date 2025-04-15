import { Router, Response } from 'express';
import { validateToken } from '../middleware/auth.middleware';
import { AuthRequest } from '../../types/express';

const router = Router();

router.get('/profile', validateToken, (req: AuthRequest, res: Response) => {
    const user = req.user;
    res.json({
        message: 'You are authenticated',
        user
    });
});

export default router;
