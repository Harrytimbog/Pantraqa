import { Router } from 'express';
import { getAllStockLogs } from '../controllers/stockLog.controller';
import { validateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getAllStockLogs);

export default router;
