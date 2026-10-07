import { Router } from 'express';
import * as uploadCtrl from '../controllers/upload.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { limitar } from '../middlewares/rateLimit.js';

const router = Router();

const limiteSubida = limitar({ ventanaMs: 5 * 60 * 1000, maximo: 120, mensaje: 'Demasiadas subidas de archivo. Espera unos minutos.' })

router.post('/upload', authenticate, limiteSubida, uploadCtrl.upload);

export default router;
