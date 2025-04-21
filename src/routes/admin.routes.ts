import { Router } from 'express';
import { onlyAdmin } from '../middleware/role.middleware';
import { deleteUser, updateUserRole } from '../controllers/admin.controller';
import { validateToken } from '../middleware/auth.middleware';

const router = Router();

// Admin can change user roles
router.put('/:id/change-userrole', validateToken, onlyAdmin, updateUserRole);
router.delete('/:id', validateToken, onlyAdmin, deleteUser);

export default router;
