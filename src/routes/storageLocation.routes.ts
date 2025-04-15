import { Router } from 'express';
import { createStorageLocation, getAllStorageLocations } from '../controllers/storageLocation.controller';
import { validateToken } from '../middleware/auth.middleware';
import { onlyManager } from '../middleware/role.middleware';

const router = Router();

router.post('/', validateToken, onlyManager, createStorageLocation);
router.get('/', getAllStorageLocations);

export default router;
