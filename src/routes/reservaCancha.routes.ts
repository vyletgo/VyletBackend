import { Router } from 'express';
import * as reservaCanchaController from '../controllers/reservaCancha.controller.js';
import { authenticate, authenticateOpcional } from '../middlewares/auth.js';

const router = Router();

// Opcional: sin token sigue funcionando, pero con token marca es_mia=true (verde "los míos").
router.get('/sucursales/:id/reservas-cancha/disponibilidad', authenticateOpcional, reservaCanchaController.disponibilidad);
router.post('/sucursales/:id/reservas-cancha', authenticate, reservaCanchaController.reservar);
router.post('/sucursales/:id/reservas-cancha/manual', authenticate, reservaCanchaController.crearManualReservaCancha);
router.get('/sucursales/:id/reservas-cancha', authenticate, reservaCanchaController.listarSucursal);
router.get('/mis-reservas-cancha', authenticate, reservaCanchaController.misReservas);
router.patch('/sucursales/:id/reservas-cancha/:reservaId', authenticate, reservaCanchaController.editar);
router.delete('/sucursales/:id/reservas-cancha/:reservaId', authenticate, reservaCanchaController.cancelar);
router.patch('/sucursales/:id/reservas-cancha/:reservaId/estado', authenticate, reservaCanchaController.actualizarEstado);
router.get('/reservas-cancha/:reservaId', authenticate, reservaCanchaController.obtenerPorId);

export default router;
