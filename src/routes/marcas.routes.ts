import { Router } from 'express';
import * as marcas from '../controllers/marcas.controller.js';
import { authenticate, requirePermiso } from '../middlewares/auth.js';

const router = Router();

router.get('/marcas', marcas.listPublic);
router.get('/admin/marcas', authenticate, requirePermiso('marcas:ver'), marcas.adminList);
router.post('/admin/marcas', authenticate, requirePermiso('marcas:editar'), marcas.adminCreate);
router.patch('/admin/marcas/:marcaId', authenticate, requirePermiso('marcas:editar'), marcas.adminUpdate);
router.delete('/admin/marcas/:marcaId', authenticate, requirePermiso('marcas:editar'), marcas.adminRemove);

export default router;
