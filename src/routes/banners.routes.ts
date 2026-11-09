import { Router } from 'express';
import * as banners from '../controllers/banners.controller.js';
import { authenticate, requirePermiso } from '../middlewares/auth.js';

const router = Router();

router.get('/banners-destacados', banners.listPublic);
router.get('/admin/banners-destacados', authenticate, requirePermiso('configuraciones:ver'), banners.adminList);
router.post('/admin/banners-destacados', authenticate, requirePermiso('configuraciones:editar'), banners.adminCreate);
router.patch('/admin/banners-destacados/:bannerId', authenticate, requirePermiso('configuraciones:editar'), banners.adminUpdate);
router.delete('/admin/banners-destacados/:bannerId', authenticate, requirePermiso('configuraciones:editar'), banners.adminRemove);

export default router;
