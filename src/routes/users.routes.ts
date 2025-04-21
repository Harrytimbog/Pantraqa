import { Router } from 'express';
import { getUserActivityLogs, getUsers } from '../controllers/users.controller';
import { validateToken, } from '../middleware/auth.middleware';
import { onlyAdmin, onlyManager } from '../middleware/role.middleware';

const router = Router();

// Route to get all users
router.get('/', validateToken, getUsers);  // Ensure only admin can access
router.get('/logs/:userId', validateToken, getUserActivityLogs);

export default router;
