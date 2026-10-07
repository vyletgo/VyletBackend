import { Router } from 'express';
import { register, login, getProfile, forgotPassword, resetPassword } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { limitar } from '../middlewares/rateLimit.js';

const router = Router();

// Límite por IP: evita fuerza bruta y spam de registros/correos de recuperación
const limiteLogin = limitar({ ventanaMs: 5 * 60 * 1000, maximo: 30, mensaje: 'Demasiados intentos de inicio de sesión. Espera unos minutos.' })
const limiteRegistro = limitar({ ventanaMs: 15 * 60 * 1000, maximo: 10, mensaje: 'Demasiados registros desde esta conexión. Espera unos minutos.' })
const limiteRecuperacion = limitar({ ventanaMs: 15 * 60 * 1000, maximo: 10, mensaje: 'Demasiadas solicitudes de recuperación. Espera unos minutos.' })

// Rutas p�blicas
router.post('/register', limiteRegistro, register);
router.post('/login', limiteLogin, login);
router.post('/forgot-password', limiteRecuperacion, forgotPassword);
router.post('/reset-password', limiteRecuperacion, resetPassword);

// Ruta protegida (requiere token)
router.get('/profile', authenticate, getProfile);

export default router;
