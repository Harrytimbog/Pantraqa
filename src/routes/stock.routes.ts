import { Router } from 'express';
import { getAllStock, getLowStockAlerts, stockIn, stockOut, updateStockThreshold } from '../controllers/stock.controller';
import { validateToken } from '../middleware/auth.middleware';
import { onlyManager } from '../middleware/role.middleware';

const router = Router();

router.post('/out', validateToken, stockOut);
router.post('/in', validateToken, stockIn);
// router.post('/in', validateToken, onlyManager, stockIn);
router.get('/', getAllStock);
router.get('/alerts', validateToken, getLowStockAlerts);
// Only managers can update thresholds
router.patch('/:id/threshold', validateToken, onlyManager, updateStockThreshold);

export default router;
