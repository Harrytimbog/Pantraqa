import { Router } from 'express';
import { exportStockLogsCSV, getAllStockLogs } from '../controllers/stockLog.controller';
import { validateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getAllStockLogs);
router.get('/export', exportStockLogsCSV);


export default router;
