import { Router } from 'express';
import * as interesPlan from '../controllers/interesPlan.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.post('/sucursales/:id/intereses-plan', authenticate, interesPlan.crear);
router.get('/sucursales/:id/intereses-plan', authenticate, interesPlan.listar);
router.patch('/sucursales/:id/intereses-plan/:interesId', authenticate, interesPlan.cambiarEstado);

export default router;
