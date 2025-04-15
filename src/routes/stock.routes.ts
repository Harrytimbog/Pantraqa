import { Router } from 'express';
import { getAllStock, stockIn, stockOut } from '../controllers/stock.controller';
import { validateToken } from '../middleware/auth.middleware';
import { onlyManager } from '../middleware/role.middleware';

const router = Router();

router.post('/out', validateToken, stockOut);
router.post('/in', validateToken, onlyManager, stockIn);
router.get('/', getAllStock);

export default router;
