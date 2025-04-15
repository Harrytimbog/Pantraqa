import { Router } from 'express';
import { exportStockLogsCSV, exportStockLogsPDF, getAllStockLogs } from '../controllers/stockLog.controller';
import { validateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getAllStockLogs);
router.get('/export', exportStockLogsCSV);
router.get('/export/pdf', exportStockLogsPDF);

export default router;
