import { Request, Response } from 'express';
import { prisma } from '../services/prisma.js';
import { notificarUsuario } from '../services/socket.service.js';
import { verificarAccesoSucursal } from '../services/acceso.service.js';

// Categoría de negocio "Gimnacio"
const CATEGORIA_GIMNASIO = 18;
const ESTADOS = ['pendiente', 'contactado', 'cerrado'];

// POST /api/sucursales/:id/intereses-plan  (cliente logueado: elige un plan y se lo envía al dueño)
export const crear = async (req: Request, res: Response) => {
  try {
    const sucursalId = Number(req.params.id);
    const { producto_id, mensaje } = req.body ?? {};

    const sucursal = await prisma.sucursales.findUnique({
      where: { id: sucursalId },
      select: { id: true, nombre: true, empresa_id: true, empresas: { select: { categoria_id: true } } },
    });
    if (!sucursal) return res.status(404).json({ error: 'Sucursal no encontrada' });
    if (sucursal.empresas?.categoria_id !== CATEGORIA_GIMNASIO) {
      return res.status(400).json({ error: 'Esta sucursal no tiene planes disponibles' });
    }

    let producto = null;
    if (producto_id) {
      producto = await prisma.productos_servicios.findFirst({
        where: { id: Number(producto_id), sucursal_id: sucursalId, activo: true },
      });
      if (!producto) return res.status(404).json({ error: 'El plan seleccionado ya no está disponible' });
    }

    const usuario = await prisma.usuarios.findUnique({
      where: { id: req.user.id },
      select: { nombres: true, apellidos: true, correo: true },
    });
    const nombrePlan = producto?.nombre ?? 'Plan';
    const precio = producto?.precio ?? null;
    const texto = (typeof mensaje === 'string' ? mensaje.trim() : '').slice(0, 500) || null;

    const interes = await prisma.intereses_plan.create({
      data: {
        sucursal_id: sucursalId,
        usuario_id: req.user.id,
        producto_id: producto?.id ?? null,
        nombre_plan: nombrePlan,
        precio,
        mensaje: texto,
      },
    });

    // Notificar a los dueños de la empresa (in-app + socket)
    try {
      const duenos = await prisma.usuario_empresas.findMany({
        where: { empresa_id: sucursal.empresa_id },
        select: { usuario_id: true },
      });
      for (const d of duenos) {
        const notif = await prisma.notificaciones.create({
          data: {
            usuario_id: d.usuario_id,
            tipo: 'interes_plan',
            titulo: 'Nuevo interés por un plan',
            mensaje: `${usuario?.nombres ?? 'Un cliente'} quiere el plan "${nombrePlan}"${
              precio ? ` ($${Number(precio).toFixed(2)})` : ''
            } en ${sucursal.nombre}`,
            enlace: `/admin/sucursales/${sucursalId}/intereses`,
          },
        });
        notificarUsuario(d.usuario_id, { tipo: 'interes_plan', notificacion: notif });
      }
    } catch (e) {
      console.error('Error notificando interés de plan:', e);
    }

    res.status(201).json(interes);
  } catch (error) {
    console.error('Error creando interés de plan:', error);
    res.status(500).json({ error: 'Error al enviar el plan' });
  }
};

// GET /api/sucursales/:id/intereses-plan  (dueño/staff: historial)
export const listar = async (req: Request, res: Response) => {
  try {
    const sucursalId = Number(req.params.id);
    if (!Number.isFinite(sucursalId)) return res.status(400).json({ error: 'Sucursal inválida' });
    if (!(await verificarAccesoSucursal(req.user.id, sucursalId))) {
      return res.status(403).json({ error: 'No puedes ver esta sucursal' });
    }

    const items = await prisma.intereses_plan.findMany({
      where: { sucursal_id: sucursalId },
      include: {
        usuarios: { select: { nombres: true, apellidos: true, correo: true, telefono: true } },
        productos_servicios: { select: { nombre: true, imagen_principal: true, tipo: true } },
      },
      orderBy: { fecha_creacion: 'desc' },
      take: 200,
    });
    res.json(items);
  } catch (error) {
    console.error('Error listando intereses de plan:', error);
    res.status(500).json({ error: 'Error al listar intereses' });
  }
};

// PATCH /api/sucursales/:id/intereses-plan/:interesId  (dueño/staff: cambiar estado)
export const cambiarEstado = async (req: Request, res: Response) => {
  try {
    const sucursalId = Number(req.params.id);
    const interesId = Number(req.params.interesId);
    const estado = req.body?.estado;
    if (!ESTADOS.includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido. Usa: pendiente, contactado o cerrado' });
    }
    if (!(await verificarAccesoSucursal(req.user.id, sucursalId))) {
      return res.status(403).json({ error: 'No puedes gestionar esta sucursal' });
    }

    const existe = await prisma.intereses_plan.findFirst({ where: { id: interesId, sucursal_id: sucursalId } });
    if (!existe) return res.status(404).json({ error: 'Interés no encontrado' });

    const actualizado = await prisma.intereses_plan.update({ where: { id: interesId }, data: { estado } });
    res.json(actualizado);
  } catch (error) {
    console.error('Error actualizando interés de plan:', error);
    res.status(500).json({ error: 'Error al actualizar el interés' });
  }
};
