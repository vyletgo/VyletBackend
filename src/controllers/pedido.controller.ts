import { randomBytes } from 'crypto';
import { Request, Response } from 'express';
import { prisma } from '../services/prisma.js';
import { generarQRPedido, verificarQRPedido } from '../services/qr.service.js';
import { notificarUsuario } from '../services/socket.service.js';
import { verificarAccesoSucursal } from './qr.controller.js';

const ESTADOS_ACTIVOS = ['pendiente', 'preparando', 'listo'];
const LIMITE_AGREGAR_HORAS = 4;

class HttpError extends Error {
  status: number;
  extra?: Record<string, unknown>;

  constructor(status: number, message: string, extra?: Record<string, unknown>) {
    super(message);
    this.status = status;
    this.extra = extra;
  }
}

// Crea un pedido a partir de los platos (texto "2x Ceviche, 1x Jugo") de una
// reserva confirmada. Idempotente: si ya existe pedido para la reserva, lo devuelve.
// Retorna el pedido_id o null si no había platos que enviar.
export const crearPedidoDesdeReserva = async (reservaId: number): Promise<number | null> => {
  try {
    const reserva = await prisma.reservas.findUnique({ where: { id: reservaId } });
    if (!reserva || !reserva.platos || !reserva.platos.trim()) return null;

    const existente = await prisma.pedidos.findFirst({ where: { reserva_id: reservaId } });
    if (existente) return existente.id;

    const norm = (s: string) =>
      s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();

    const partes = reserva.platos.split(',').map((s) => s.trim()).filter(Boolean);
    const productos = await prisma.productos_servicios.findMany({
      where: { sucursal_id: reserva.sucursal_id, activo: true },
      select: { id: true, nombre: true, precio: true, precio_oferta: true }
    });
    const porNombre = new Map(productos.map((p) => [norm(p.nombre), p]));

    const detalle: { producto_id: number; cantidad: number; precio_unitario: number; nota: string | null }[] = [];
    const sinMatch: string[] = [];
    for (const parte of partes) {
      const m = parte.match(/^(\d+)\s*x\s*(.+)$/i);
      if (!m) { sinMatch.push(parte); continue; }
      const cant = Math.min(20, Math.max(1, parseInt(m[1], 10)));
      let nombreProd = m[2].trim();
      let notaObs: string | null = null;
      const obsMatch = nombreProd.match(/^(.+?)\s*\((.+)\)$/);
      if (obsMatch) {
        nombreProd = obsMatch[1].trim();
        notaObs = obsMatch[2].trim();
      }
      const key = norm(nombreProd);
      const prod = porNombre.get(key)
        ?? productos.find((p) => norm(p.nombre) === key)
        ?? productos.find((p) => norm(p.nombre).includes(key) || key.includes(norm(p.nombre)));
      if (!prod) { sinMatch.push(parte); continue; }
      detalle.push({
        producto_id: prod.id,
        cantidad: cant,
        precio_unitario: Number(prod.precio_oferta ?? prod.precio ?? 0),
        nota: notaObs
      });
    }

    if (detalle.length === 0) return null;

    const total = detalle.reduce((s, d) => s + d.precio_unitario * d.cantidad, 0);
    const notasExtras = [
      `Pedido de reserva #${reserva.id}`,
      sinMatch.length > 0 ? `No encontrados en menú: ${sinMatch.join(', ')}` : null,
      reserva.observaciones ? `Obs. reserva: ${reserva.observaciones}` : null
    ].filter(Boolean).join(' | ');

    const pedido = await prisma.pedidos.create({
      data: {
        sucursal_id: reserva.sucursal_id,
        mesa_id: reserva.mesa_id,
        reserva_id: reserva.id,
        usuario_id: reserva.usuario_id,
        cliente_nombre: reserva.cliente_nombre,
        cliente_telefono: reserva.cliente_telefono,
        estado: 'pendiente',
        total,
        notas: notasExtras || null,
        origen: 'reserva',
        pedido_detalle: { create: detalle }
      }
    });
    return pedido.id;
  } catch (e) {
    console.error('Error creando pedido desde reserva:', e);
    return null;
  }
};

export const ESTADOS_PEDIDO = ['pendiente', 'preparando', 'listo', 'entregado', 'cancelado'];
export const ESTADOS_DETALLE = ['pendiente', 'preparando', 'listo', 'entregado'];

const pedidoInclude = {
  pedido_detalle: {
    include: {
      productos_servicios: { select: { id: true, nombre: true, imagen_principal: true, tipo: true } }
    },
    orderBy: { id: 'asc' as const }
  },
  mesas: { select: { id: true, nombre: true } },
  sucursales: { select: { id: true, nombre: true } },
  reservas: { select: { id: true, fecha_reserva: true, hora_inicio: true, cantidad_personas: true, cliente_nombre: true, estado: true } },
  usuarios: { select: { id: true, nombres: true, apellidos: true, correo: true } }
};

const formatearPedido = (p: any) => ({
  id: p.id,
  sucursal_id: p.sucursal_id,
  sucursal: p.sucursales?.nombre ?? null,
  origen: p.origen ?? 'qr',
  mesa_id: p.mesa_id,
  mesa: p.mesas?.nombre ?? null,
  reserva_id: p.reserva_id,
  cliente_nombre: p.cliente_nombre,
  cliente_telefono: p.cliente_telefono,
  usuario: p.usuarios ? {
    id: p.usuarios.id,
    nombre: `${p.usuarios.nombres} ${p.usuarios.apellidos || ''}`.trim(),
    correo: p.usuarios.correo
  } : null,
  estado: p.estado,
  total: Number(p.total ?? 0),
  notas: p.notas,
  fecha_creacion: p.fecha_creacion,
  reserva: p.reservas ? {
    id: p.reservas.id,
    fecha: p.reservas.fecha_reserva,
    hora: p.reservas.hora_inicio,
    personas: p.reservas.cantidad_personas,
    cliente: p.reservas.cliente_nombre,
    estado: p.reservas.estado
  } : null,
  items: (p.pedido_detalle ?? []).map((d: any) => ({
    id: d.id,
    producto_id: d.producto_id,
    nombre: d.productos_servicios?.nombre ?? 'Producto',
    imagen: d.productos_servicios?.imagen_principal ?? null,
    tipo: d.productos_servicios?.tipo ?? null,
    cantidad: d.cantidad,
    precio_unitario: Number(d.precio_unitario ?? 0),
    subtotal: Number(d.precio_unitario ?? 0) * (d.cantidad ?? 0),
    nota: d.nota,
    estado: d.estado
  }))
});

// Avisa al local (dueños + empleados asignados a la sucursal) por notificación y WebSocket
const notificarLocal = async (
  sucursal: { id: number; empresa_id: number; nombre: string },
  pedido: { id: number; total: unknown },
  mesaNombre: string | null,
  itemsNuevos: number,
  agregado: boolean
) => {
  try {
    const duenos = await prisma.usuario_empresas.findMany({
      where: { empresa_id: sucursal.empresa_id },
      select: { usuario_id: true }
    });
    const empleados = await prisma.empresa_empleados.findMany({
      where: {
        empresa_id: sucursal.empresa_id,
        activo: true,
        empleado_sucursales: { some: { sucursal_id: sucursal.id } }
      },
      select: { usuario_id: true }
    });
    const destinos = [...new Set([...duenos, ...empleados].map((d) => d.usuario_id))];
    if (destinos.length === 0) return;

    const mesaTxt = mesaNombre ?? 'Sin mesa';
    const titulo = agregado ? 'Se agregaron productos' : 'Nuevo pedido en mesa';
    const mensaje = agregado
      ? `Pedido #${pedido.id} · ${mesaTxt} · ${itemsNuevos} ${itemsNuevos === 1 ? 'ítem nuevo' : 'ítems nuevos'} · $${Number(pedido.total ?? 0).toFixed(2)}`
      : `Pedido #${pedido.id} en ${sucursal.nombre} · ${mesaTxt} por $${Number(pedido.total ?? 0).toFixed(2)}`;
    const tipo = agregado ? 'pedido_agregado' : 'nuevo_pedido';

    for (const usuarioId of destinos) {
      const notif = await prisma.notificaciones.create({
        data: {
          usuario_id: usuarioId,
          tipo,
          titulo,
          mensaje,
          enlace: `/admin/sucursales/${sucursal.id}/pedidos`
        }
      });
      notificarUsuario(usuarioId, { tipo, notificacion: notif });
    }
  } catch (e) {
    console.error('Error notificando pedido:', e);
  }
};

// GET /api/sucursales/:id/pedidos?estado=pendiente  (dueño/staff/empleado)
export const listarPedidos = async (req: Request, res: Response) => {
  try {
    const sucursalId = Number(req.params.id);
    const { estado } = req.query;
    const where: any = { sucursal_id: sucursalId };
    if (estado && ESTADOS_PEDIDO.includes(String(estado))) where.estado = String(estado);

    const pedidos = await prisma.pedidos.findMany({
      where,
      include: pedidoInclude,
      orderBy: { id: 'desc' },
      take: 200
    });
    res.json(pedidos.map(formatearPedido));
  } catch (error) {
    console.error('Error listando pedidos:', error);
    res.status(500).json({ error: 'Error al listar pedidos' });
  }
};

// GET /api/pedidos/:id  (público: para que el cliente vea el estado de su pedido)
export const obtenerPedido = async (req: Request, res: Response) => {
  try {
    const pedidoId = Number(req.params.id);
    const pedido = await prisma.pedidos.findUnique({ where: { id: pedidoId }, include: pedidoInclude });
    if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });
    res.json(formatearPedido(pedido));
  } catch (error) {
    console.error('Error obteniendo pedido:', error);
    res.status(500).json({ error: 'Error al obtener pedido' });
  }
};

// POST /api/sucursales/:id/pedidos  (público; usuario opcional)
// body: { mesa_token?, mesa_id?, reserva_id?, cliente_nombre?, cliente_telefono?, notas?, items: [{ producto_id, cantidad, nota? }] }
// Si la mesa ya tiene un pedido abierto y llega pedido_id + token_cliente (dispositivo creador),
// los ítems se agregan a ese pedido en vez de crear otro.
export const crearPedido = async (req: Request, res: Response) => {
  try {
    const sucursalId = Number(req.params.id);
    const {
      mesa_token, mesa_id, reserva_id, cliente_nombre, cliente_telefono, notas, items,
      pedido_id, token_cliente
    } = req.body ?? {};

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'El pedido debe tener al menos un producto' });
    }
    if (items.length > 50) return res.status(400).json({ error: 'Máximo 50 líneas por pedido' });

    const sucursal = await prisma.sucursales.findUnique({
      where: { id: sucursalId },
      select: { id: true, activo: true, empresa_id: true, nombre: true }
    });
    if (!sucursal || !sucursal.activo) return res.status(404).json({ error: 'Sucursal no encontrada' });

    // Validar mesa (por token preferido, o por id)
    let mesaId: number | null = null;
    let mesaNombre: string | null = null;
    if (mesa_token) {
      const mesa = await prisma.mesas.findUnique({ where: { qr_token: String(mesa_token) } });
      if (!mesa || mesa.sucursal_id !== sucursalId || !mesa.activa) {
        return res.status(400).json({ error: 'Mesa inválida' });
      }
      mesaId = mesa.id;
      mesaNombre = mesa.nombre;
    } else if (mesa_id) {
      const mesa = await prisma.mesas.findFirst({ where: { id: Number(mesa_id), sucursal_id: sucursalId, activa: true } });
      if (!mesa) return res.status(400).json({ error: 'Mesa inválida' });
      mesaId = mesa.id;
      mesaNombre = mesa.nombre;
    }

    // Validar reserva opcional; si no se indica y la mesa tiene reserva hoy, vincularla
    let reservaId: number | null = null;
    if (reserva_id) {
      const reserva = await prisma.reservas.findFirst({
        where: { id: Number(reserva_id), sucursal_id: sucursalId, estado: { not: 'cancelada' } }
      });
      if (!reserva) return res.status(400).json({ error: 'Reserva inválida' });
      reservaId = reserva.id;
    } else if (mesaId) {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const manana = new Date(hoy);
      manana.setDate(hoy.getDate() + 1);
      const reservaHoy = await prisma.reservas.findFirst({
        where: {
          mesa_id: mesaId,
          sucursal_id: sucursalId,
          fecha_reserva: { gte: hoy, lt: manana },
          estado: { in: ['pendiente', 'confirmada'] }
        },
        orderBy: { hora_inicio: 'asc' }
      });
      if (reservaHoy) reservaId = reservaHoy.id;
    }

    // Validar productos y calcular total en servidor
    const productoIds = [...new Set(items.map((i: any) => Number(i.producto_id)).filter((n: number) => !isNaN(n)))];
    if (productoIds.length === 0) return res.status(400).json({ error: 'Productos inválidos' });

    const productos = await prisma.productos_servicios.findMany({
      where: { id: { in: productoIds }, sucursal_id: sucursalId, activo: true, disponible: true },
      select: { id: true, precio: true, precio_oferta: true }
    });
    const precioPorId = new Map(productos.map((p) => [p.id, Number(p.precio_oferta ?? p.precio ?? 0)]));

    const detalle: { producto_id: number; cantidad: number; precio_unitario: number; nota: string | null }[] = [];
    for (const it of items) {
      const pid = Number(it.producto_id);
      const cant = Math.floor(Number(it.cantidad));
      if (!precioPorId.has(pid) || isNaN(cant) || cant < 1 || cant > 20) {
        return res.status(400).json({ error: `Producto o cantidad inválida (id ${it.producto_id})` });
      }
      detalle.push({
        producto_id: pid,
        cantidad: cant,
        precio_unitario: precioPorId.get(pid)!,
        nota: it.nota ? String(it.nota).slice(0, 300) : null
      });
    }

    const total = detalle.reduce((s, d) => s + d.precio_unitario * d.cantidad, 0);
    const usuarioId = (req as any).user?.id ?? null;

    const resultado = await prisma.$transaction(async (tx) => {
      // Serializa pedidos concurrentes de la misma mesa
      if (mesaId) {
        await tx.$queryRaw`SELECT id FROM mesas WHERE id = ${mesaId} FOR UPDATE`;
      }

      const activo = mesaId
        ? await tx.pedidos.findFirst({
            where: { mesa_id: mesaId, origen: 'qr', estado: { in: ESTADOS_ACTIVOS } },
            orderBy: { id: 'desc' }
          })
        : null;

      const ahora = new Date();
      const ultimaActividad = (p: { fecha_actualizacion: Date | null; fecha_creacion: Date | null }) =>
        new Date(p.fecha_actualizacion ?? p.fecha_creacion ?? 0);
      const dentroDelLimite = (fecha: Date) => ahora.getTime() - fecha.getTime() < LIMITE_AGREGAR_HORAS * 3600000;

      // 1) Agregar ítems a un pedido existente (solo el dispositivo creador)
      if (pedido_id && token_cliente) {
        const pedido = await tx.pedidos.findUnique({ where: { id: Number(pedido_id) } });
        if (!pedido || !mesaId || pedido.mesa_id !== mesaId || pedido.sucursal_id !== sucursalId || pedido.origen !== 'qr') {
          throw new HttpError(400, 'Pedido inválido');
        }
        if (pedido.token_cliente !== String(token_cliente)) {
          throw new HttpError(403, 'No autorizado para modificar este pedido');
        }
        if (pedido.estado === 'cancelado') {
          throw new HttpError(409, 'El pedido fue cancelado por el local', { codigo: 'PEDIDO_CANCELADO' });
        }
        if (pedido.estado === 'entregado') {
          throw new HttpError(409, 'El pedido ya fue entregado y no admite cambios', { codigo: 'PEDIDO_CERRADO' });
        }
        if (!dentroDelLimite(ultimaActividad(pedido))) {
          throw new HttpError(409, 'El tiempo para agregar a este pedido expiró', { codigo: 'PEDIDO_EXPIRADO' });
        }
        if (activo && activo.id !== pedido.id) {
          throw new HttpError(409, 'La mesa ya tiene otro pedido en curso', {
            codigo: 'MESA_OCUPADA',
            pedido_id: activo.id,
            estado: activo.estado
          });
        }

        await tx.pedido_detalle.createMany({
          data: detalle.map((d) => ({ pedido_id: pedido.id, ...d }))
        });

        const renglones = await tx.pedido_detalle.findMany({
          where: { pedido_id: pedido.id },
          select: { cantidad: true, precio_unitario: true }
        });
        const totalFinal = renglones.reduce((s, d) => s + Number(d.precio_unitario) * d.cantidad, 0);

        const actualizado = await tx.pedidos.update({
          where: { id: pedido.id },
          data: { estado: 'pendiente', total: totalFinal, fecha_actualizacion: ahora },
          include: pedidoInclude
        });
        return { pedido: actualizado, agregado: true, itemsNuevos: detalle.length };
      }

      // 2) Crear pedido nuevo (la mesa debe estar libre)
      if (activo) {
        if (dentroDelLimite(ultimaActividad(activo))) {
          throw new HttpError(409, 'Esta mesa ya tiene un pedido en curso', {
            codigo: 'MESA_OCUPADA',
            pedido_id: activo.id,
            estado: activo.estado
          });
        }
        await tx.pedidos.update({
          where: { id: activo.id },
          data: {
            estado: 'cancelado',
            fecha_actualizacion: ahora,
            notas: [activo.notas, 'Cancelado automáticamente por inactividad (4 h)'].filter(Boolean).join(' | ')
          }
        });
      }

      const pedido = await tx.pedidos.create({
        data: {
          sucursal_id: sucursalId,
          mesa_id: mesaId,
          reserva_id: reservaId,
          usuario_id: usuarioId,
          cliente_nombre: cliente_nombre ? String(cliente_nombre).slice(0, 200) : null,
          cliente_telefono: cliente_telefono ? String(cliente_telefono).slice(0, 30) : null,
          notas: notas ? String(notas).slice(0, 1000) : null,
          origen: 'qr',
          token_cliente: mesaId ? randomBytes(16).toString('hex') : null,
          estado: 'pendiente',
          total,
          pedido_detalle: { create: detalle }
        },
        include: pedidoInclude
      });
      return { pedido, agregado: false, itemsNuevos: detalle.length };
    });

    const { pedido, agregado, itemsNuevos } = resultado;
    res.status(agregado ? 200 : 201).json({
      ...formatearPedido(pedido),
      agregado,
      token_cliente: pedido.token_cliente ?? null
    });

    // Notificar al local (dueños + empleados asignados a la sucursal)
    await notificarLocal(sucursal, pedido, mesaNombre, itemsNuevos, agregado);
  } catch (error) {
    if (error instanceof HttpError) {
      return res.status(error.status).json({ error: error.message, ...(error.extra ?? {}) });
    }
    console.error('Error creando pedido:', error);
    res.status(500).json({ error: 'Error al crear el pedido' });
  }
};

// PATCH /api/pedidos/:id/estado  { estado }  (dueño/staff/empleado)
export const cambiarEstadoPedido = async (req: Request, res: Response) => {
  try {
    const pedidoId = Number(req.params.id);
    const { estado } = req.body ?? {};
    if (!ESTADOS_PEDIDO.includes(estado)) {
      return res.status(400).json({ error: `Estado inválido. Use: ${ESTADOS_PEDIDO.join(', ')}` });
    }

    const pedido = await prisma.pedidos.findUnique({
      where: { id: pedidoId },
      select: { id: true, sucursal_id: true, usuario_id: true, estado: true, total: true }
    });
    if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });
    if (!await verificarAccesoSucursal((req as any).user.id, pedido.sucursal_id)) {
      return res.status(403).json({ error: 'No tienes acceso a esta sucursal' });
    }

    const actualizado = await prisma.pedidos.update({
      where: { id: pedidoId },
      data: { estado, fecha_actualizacion: new Date() },
      include: pedidoInclude
    });
    res.json(formatearPedido(actualizado));

    // Notificar al cliente (si tiene cuenta)
    if (pedido.usuario_id) {
      try {
        const mensajes: Record<string, string> = {
          preparando: `Tu pedido #${pedidoId} se está preparando 👨‍🍳`,
          listo: `Tu pedido #${pedidoId} está listo ✅`,
          entregado: `Tu pedido #${pedidoId} fue entregado. ¡Buen provecho! 🍽️`,
          cancelado: `Tu pedido #${pedidoId} fue cancelado`
        };
        if (mensajes[estado]) {
          const notif = await prisma.notificaciones.create({
            data: {
              usuario_id: pedido.usuario_id,
              tipo: 'pedido_estado',
              titulo: 'Tu pedido cambió de estado',
              mensaje: mensajes[estado],
              enlace: `/pedido/${pedidoId}`
            }
          });
          notificarUsuario(pedido.usuario_id, { tipo: 'pedido_estado', notificacion: notif });
        }
      } catch (e) {
        console.error('Error notificando cambio de pedido:', e);
      }
    }
  } catch (error) {
    console.error('Error cambiando estado de pedido:', error);
    res.status(500).json({ error: 'Error al cambiar estado' });
  }
};

// PATCH /api/pedidos/detalle/:detalleId/estado  { estado }  (dueño/staff/empleado)
export const cambiarEstadoDetalle = async (req: Request, res: Response) => {
  try {
    const detalleId = Number(req.params.detalleId);
    const { estado } = req.body ?? {};
    if (!ESTADOS_DETALLE.includes(estado)) {
      return res.status(400).json({ error: `Estado inválido. Use: ${ESTADOS_DETALLE.join(', ')}` });
    }

    const detalle = await prisma.pedido_detalle.findUnique({
      where: { id: detalleId },
      include: { pedidos: { select: { id: true, sucursal_id: true } } }
    });
    if (!detalle) return res.status(404).json({ error: 'Item no encontrado' });
    if (!await verificarAccesoSucursal((req as any).user.id, detalle.pedidos.sucursal_id)) {
      return res.status(403).json({ error: 'No tienes acceso a esta sucursal' });
    }

    await prisma.pedido_detalle.update({ where: { id: detalleId }, data: { estado } });

    // Si todos los items están entregados, marcar pedido como entregado
    // Si al menos uno está en preparación o más, avanzar el pedido
    const items = await prisma.pedido_detalle.findMany({
      where: { pedido_id: detalle.pedidos.id },
      select: { estado: true }
    });
    const estados = items.map((i) => i.estado);
    let nuevoEstadoPedido: string | null = null;
    if (estados.length > 0 && estados.every((e) => e === 'entregado')) nuevoEstadoPedido = 'entregado';
    else if (estados.some((e) => e === 'listo')) nuevoEstadoPedido = 'listo';
    else if (estados.some((e) => e === 'preparando')) nuevoEstadoPedido = 'preparando';

    if (nuevoEstadoPedido) {
      await prisma.pedidos.update({
        where: { id: detalle.pedidos.id },
        data: { estado: nuevoEstadoPedido, fecha_actualizacion: new Date() }
      });
    }

    const pedido = await prisma.pedidos.findUnique({ where: { id: detalle.pedidos.id }, include: pedidoInclude });
    res.json(formatearPedido(pedido));
  } catch (error) {
    console.error('Error cambiando estado de item:', error);
    res.status(500).json({ error: 'Error al cambiar estado del item' });
  }
};

// POST /api/pedidos/:id/generar-qr  (dueño del pedido; público si el pedido es anónimo)
export const generarQRPedidoCtrl = async (req: Request, res: Response) => {
  try {
    const pedidoId = Number(req.params.id);
    const pedido = await prisma.pedidos.findUnique({
      where: { id: pedidoId },
      include: { mesas: { select: { nombre: true } }, sucursales: { select: { nombre: true } } }
    });
    if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });
    if (pedido.estado === 'cancelado') return res.status(400).json({ error: 'Pedido cancelado' });
    if (pedido.estado === 'entregado') return res.status(400).json({ error: 'Pedido ya entregado' });

    // Si el pedido tiene dueño con cuenta, solo él puede generar el QR
    if (pedido.usuario_id && (req as any).user?.id !== pedido.usuario_id) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const token = generarQRPedido(pedidoId);
    res.json({
      token,
      qr_data: `VYLET-QR:${token}`,
      pedido: {
        id: pedidoId,
        sucursal: pedido.sucursales?.nombre,
        mesa: pedido.mesas?.nombre ?? null,
        total: Number(pedido.total ?? 0)
      },
      expira_en: '5 minutos'
    });
  } catch (error) {
    console.error('Error generando QR pedido:', error);
    res.status(500).json({ error: 'Error al generar QR' });
  }
};

// POST /api/pedidos/verificar-qr  { token }  (empleado autenticado)
export const verificarQRPedidoCtrl = async (req: Request, res: Response) => {  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'Token requerido' });

    const payload = verificarQRPedido(token);
    if (!payload) {
      return res.status(400).json({ error: 'QR inválido o expirado', codigo: 'QR_EXPIRADO' });
    }

    const pedido = await prisma.pedidos.findUnique({ where: { id: payload.pid }, include: pedidoInclude });
    if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });

    if (!await verificarAccesoSucursal((req as any).user.id, pedido.sucursal_id)) {
      return res.status(403).json({ error: 'No tienes acceso a esta sucursal' });
    }

    res.json({ valido: true, tipo: 'pedido', pedido: formatearPedido(pedido) });
  } catch (error) {
    console.error('Error verificando QR pedido:', error);
    res.status(500).json({ error: 'Error al verificar QR' });
  }
};
