import { Router } from 'express';
import { createDrink, deleteDrink, getAllDrinks } from '../controllers/drink.controller';
import { validateToken } from '../middleware/auth.middleware';
import { onlyManager } from '../middleware/role.middleware';

const router = Router();

router.post('/create-drink', validateToken, onlyManager, createDrink);
router.get('/', getAllDrinks);
router.delete('/:id', validateToken, onlyManager, deleteDrink);

export default router;
