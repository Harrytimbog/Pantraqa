import { Router } from 'express';
import { getUserActivityLogs } from '../controllers/log.controller';
import { validateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/users/:userId', validateToken, getUserActivityLogs);

export default router;
