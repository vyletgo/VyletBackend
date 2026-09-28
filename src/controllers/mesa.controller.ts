import { Request, Response } from 'express';
import { randomBytes } from 'crypto';
import { prisma } from '../services/prisma.js';

const generarTokenMesa = (): string => randomBytes(16).toString('hex');

const estadosOcupan = ['pendiente', 'confirmada'];

const timeToDate = (hora: string): Date | null => {
  if (!hora) return null;
  const limpia = hora.includes(':') ? hora : `${hora}:00`;
  return new Date(`1970-01-01T${limpia}`);
};

// ¿El negocio de esta sucursal permite mesas (restaurantes)?
const esRestaurante = async (sucursalId: number): Promise<boolean> => {
  const s = await prisma.sucursales.findUnique({
    where: { id: sucursalId },
    select: { empresas: { select: { categorias_negocio: { select: { permite_mesas: true } } } } }
  });
  return s?.empresas?.categorias_negocio?.permite_mesas === true;
};

// GET /api/sucursales/:id/mesas  (público; solo restaurantes) - mesas activas
export const listarMesas = async (req: Request, res: Response) => {
  try {
    const sucursalId = Number(req.params.id);
    if (!(await esRestaurante(sucursalId))) return res.json([]);
    const mesas = await prisma.mesas.findMany({
      where: { sucursal_id: sucursalId, activa: true },
      orderBy: { id: 'asc' }
    });
    res.json(mesas);
  } catch (error) {
    console.error('Error listando mesas:', error);
    res.status(500).json({ error: 'Error al listar mesas' });
  }
};

// GET /api/sucursales/:id/mesas/disponibilidad?fecha=YYYY-MM-DD[&hora=HH:MM]  (público)
// - Solo fecha: devuelve mesas con todas las ocupaciones del día (para panel admin)
// - fecha + hora: comportamiento clásico (libres/ocupadas a esa hora exacta)
export const disponibilidadMesas = async (req: Request, res: Response) => {
  try {
    const sucursalId = Number(req.params.id);
    if (!(await esRestaurante(sucursalId))) return res.json([]);

    const { fecha, hora } = req.query;
    const fechaReserva = fecha ? new Date(String(fecha)) : null;
    if (!fechaReserva || isNaN(fechaReserva.getTime())) {
      return res.status(400).json({ error: 'fecha (YYYY-MM-DD) es requerida' });
    }

    const mesas = await prisma.mesas.findMany({
      where: { sucursal_id: sucursalId, activa: true },
      orderBy: { id: 'asc' }
    });

    // Modo día completo (sin hora): devolver ocupaciones del día por mesa
    if (!hora) {
      const inicioDia = new Date(fechaReserva);
      inicioDia.setHours(0, 0, 0, 0);
      const finDia = new Date(inicioDia);
      finDia.setDate(inicioDia.getDate() + 1);

      const reservasDia = await prisma.reservas.findMany({
        where: {
          mesa_id: { in: mesas.map((m) => m.id) },
          fecha_reserva: fechaReserva,
          estado: { in: estadosOcupan }
        },
        select: {
          id: true,
          mesa_id: true,
          hora_inicio: true,
          cantidad_personas: true,
          cliente_nombre: true,
          estado: true,
          usuarios: { select: { nombres: true, apellidos: true } }
        },
        orderBy: { hora_inicio: 'asc' }
      });

      const porMesa = new Map<number, typeof reservasDia>();
      for (const r of reservasDia) {
        if (r.mesa_id == null) continue;
        const arr = porMesa.get(r.mesa_id) ?? [];
        arr.push(r);
        porMesa.set(r.mesa_id, arr);
      }

      const horaATexto = (d?: Date | null): string | null => {
        if (!d) return null;
        return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
      };

      return res.json({
        fecha: String(fecha),
        modo: 'dia',
        mesas: mesas.map((m) => {
          const ocupaciones = (porMesa.get(m.id) ?? []).map((r) => ({
            reserva_id: r.id,
            hora: horaATexto(r.hora_inicio),
            personas: r.cantidad_personas ?? 1,
            cliente: r.cliente_nombre
              ?? (r.usuarios ? `${r.usuarios.nombres} ${r.usuarios.apellidos ?? ''}`.trim() : null),
            estado: r.estado
          }));
          return {
            ...m,
            ocupaciones,
            ocupadas: ocupaciones.length,
            libres: Math.max(0, m.cantidad - ocupaciones.length),
            ocupada: ocupaciones.length >= m.cantidad
          };
        })
      });
    }

    // Modo fecha + hora exacta (compatibilidad con código existente)
    const horaReserva = timeToDate(String(hora));
    if (!horaReserva) {
      return res.status(400).json({ error: 'hora (HH:MM) inválida' });
    }

    const reservadas = await prisma.reservas.groupBy({
      by: ['mesa_id'],
      where: {
        mesa_id: { in: mesas.map((m) => m.id) },
        fecha_reserva: fechaReserva,
        hora_inicio: horaReserva,
        estado: { in: estadosOcupan }
      },
      _count: { _all: true }
    });
    const ocupadasPorMesa = new Map(reservadas.map((r) => [r.mesa_id, r._count._all]));

    res.json(
      mesas.map((m) => {
        const ocupadas = ocupadasPorMesa.get(m.id) ?? 0;
        // Misma mesa + misma hora = ocupada (sin importar unidades)
        const ocupada = ocupadas > 0;
        return {
          ...m,
          ocupadas,
          libres: ocupada ? 0 : m.cantidad,
          ocupada
        };
      })
    );
  } catch (error) {
    console.error('Error consultando disponibilidad de mesas:', error);
    res.status(500).json({ error: 'Error al consultar disponibilidad' });
  }
};

// GET /api/sucursales/:id/mesas/sugerir?fecha=YYYY-MM-DD&hora=HH:MM&personas=N  (público)
// Sugiere combinación de mesas libres para cubrir N personas en ese slot.
export const sugerirMesas = async (req: Request, res: Response) => {
  try {
    const sucursalId = Number(req.params.id);
    if (!(await esRestaurante(sucursalId))) {
      return res.json({ sugeridas: [], personas_cubiertas: 0, personas_faltantes: 0, suficiente: false });
    }

    const { fecha, hora, personas } = req.query;
    if (!fecha || !hora) {
      return res.status(400).json({ error: 'fecha y hora son requeridas' });
    }
    const fechaReserva = new Date(String(fecha));
    if (isNaN(fechaReserva.getTime())) {
      return res.status(400).json({ error: 'fecha inválida' });
    }
    const horaReserva = timeToDate(String(hora));
    if (!horaReserva) {
      return res.status(400).json({ error: 'hora inválida' });
    }
    const personasN = Math.max(1, Number(personas) || 1);

    const mesas = await prisma.mesas.findMany({
      where: { sucursal_id: sucursalId, activa: true },
      orderBy: [{ puestos: 'desc' }, { id: 'asc' }]
    });

    const reservadas = await prisma.reservas.groupBy({
      by: ['mesa_id'],
      where: {
        mesa_id: { in: mesas.map((m) => m.id) },
        fecha_reserva: fechaReserva,
        hora_inicio: horaReserva,
        estado: { in: estadosOcupan }
      },
      _count: { _all: true }
    });
    const ocupadasPorMesa = new Map(reservadas.map((r) => [r.mesa_id, r._count._all]));

    // Mesas libres a esa hora: misma mesa + misma hora = ocupada (aunque queden unidades)
    const candidatas = mesas
      .filter((m) => (ocupadasPorMesa.get(m.id) ?? 0) === 0)
      .map((m) => ({ mesa: m, unidadesLibres: 1 }));

    // Greedy: preferir mesa que mejor se ajuste (puestos >= restantes primero, luego mayor puestos)
    let restantes = personasN;
    const sugeridas: typeof mesas = [];
    const disponibles = [...candidatas];

    while (restantes > 0 && disponibles.length) {
      disponibles.sort((a, b) => {
        const aAjusta = a.mesa.puestos >= restantes ? 0 : 1;
        const bAjusta = b.mesa.puestos >= restantes ? 0 : 1;
        if (aAjusta !== bAjusta) return aAjusta - bAjusta;
        // Si ambos no alcanzan solos, mayor puestos primero; si ambos alcanzan, menor sobrante
        if (aAjusta === 1) return b.mesa.puestos - a.mesa.puestos;
        return a.mesa.puestos - b.mesa.puestos;
      });
      const elegida = disponibles[0];
      if (!elegida) break;
      sugeridas.push(elegida.mesa);
      restantes -= elegida.mesa.puestos;
      elegida.unidadesLibres -= 1;
      if (elegida.unidadesLibres <= 0) {
        disponibles.shift();
      }
    }

    const personasCubiertas = Math.min(personasN, personasN - Math.max(0, restantes));
    res.json({
      sugeridas,
      personas_cubiertas: personasCubiertas,
      personas_faltantes: Math.max(0, restantes),
      suficiente: restantes <= 0,
      personas
    });
  } catch (error) {
    console.error('Error sugiriendo mesas:', error);
    res.status(500).json({ error: 'Error al sugerir mesas' });
  }
};

// POST /api/sucursales/:id/mesas  { nombre, puestos, foto }  (dueño/staff/empleado de la sucursal)
export const crearMesa = async (req: Request, res: Response) => {
  try {
    const sucursalId = Number(req.params.id);
    if (!(await esRestaurante(sucursalId))) {
      return res.status(400).json({ error: 'Esta sucursal no permite mesas' });
    }
    const { nombre, puestos, cantidad, foto } = req.body ?? {};
    if (!nombre || String(nombre).trim() === '') {
      return res.status(400).json({ error: 'nombre es requerido' });
    }
    const puestosNum = puestos !== undefined && puestos !== '' ? Number(puestos) : 2;
    if (isNaN(puestosNum) || puestosNum < 1) {
      return res.status(400).json({ error: 'puestos debe ser un número mayor o igual a 1' });
    }
    const cantidadNum = cantidad !== undefined && cantidad !== '' ? Number(cantidad) : 1;
    if (isNaN(cantidadNum) || cantidadNum < 1) {
      return res.status(400).json({ error: 'cantidad debe ser un número mayor o igual a 1' });
    }

    const mesa = await prisma.mesas.create({
      data: {
        sucursal_id: sucursalId,
        nombre: String(nombre).trim(),
        puestos: puestosNum,
        cantidad: cantidadNum,
        foto: foto != null ? String(foto) : null,
        qr_token: generarTokenMesa()
      }
    });
    res.status(201).json(mesa);
  } catch (error) {
    console.error('Error creando mesa:', error);
    res.status(500).json({ error: 'Error al crear la mesa' });
  }
};

// PATCH /api/sucursales/:id/mesas/:mesaId  { nombre?, puestos?, foto? }
export const editarMesa = async (req: Request, res: Response) => {
  try {
    const sucursalId = Number(req.params.id);
    const mesaId = Number(req.params.mesaId);
    const existente = await prisma.mesas.findFirst({ where: { id: mesaId, sucursal_id: sucursalId } });
    if (!existente) return res.status(404).json({ error: 'Mesa no encontrada' });

    const { nombre, puestos, cantidad, foto, activa } = req.body ?? {};
    const data: any = {};
    if (nombre !== undefined) {
      if (String(nombre).trim() === '') return res.status(400).json({ error: 'nombre no puede estar vacío' });
      data.nombre = String(nombre).trim();
    }
    if (puestos !== undefined) {
      const n = Number(puestos);
      if (isNaN(n) || n < 1) return res.status(400).json({ error: 'puestos inválido' });
      data.puestos = n;
    }
    if (cantidad !== undefined) {
      const n = Number(cantidad);
      if (isNaN(n) || n < 1) return res.status(400).json({ error: 'cantidad inválida' });
      data.cantidad = n;
    }
    if (foto !== undefined) data.foto = foto != null ? String(foto) : null;
    if (activa !== undefined) data.activa = activa === true;

    const mesa = await prisma.mesas.update({ where: { id: mesaId }, data });
    res.json(mesa);
  } catch (error) {
    console.error('Error editando mesa:', error);
    res.status(500).json({ error: 'Error al editar la mesa' });
  }
};

// DELETE /api/sucursales/:id/mesas/:mesaId  (desactiva la mesa)
export const eliminarMesa = async (req: Request, res: Response) => {
  try {
    const sucursalId = Number(req.params.id);
    const mesaId = Number(req.params.mesaId);
    const existente = await prisma.mesas.findFirst({ where: { id: mesaId, sucursal_id: sucursalId } });
    if (!existente) return res.status(404).json({ error: 'Mesa no encontrada' });

    await prisma.mesas.update({ where: { id: mesaId }, data: { activa: false } });
    res.json({ message: 'Mesa desactivada.' });
  } catch (error) {
    console.error('Error eliminando mesa:', error);
    res.status(500).json({ error: 'Error al eliminar la mesa' });
  }
};

// GET /api/mesa/:token  (público) - resuelve el QR de una mesa: sucursal + mesa
export const resolverMesaPorToken = async (req: Request, res: Response) => {
  try {
    const token = String(req.params.token);
    const mesa = await prisma.mesas.findUnique({
      where: { qr_token: token },
      include: {
        sucursales: {
          select: {
            id: true, nombre: true, direccion: true, imagen_principal: true, telefono: true, whatsapp: true, activo: true,
            empresas: { select: { nombre: true, logo: true } }
          }
        }
      }
    });
    if (!mesa || !mesa.activa || !mesa.sucursales?.activo) {
      return res.status(404).json({ error: 'Mesa no encontrada' });
    }
    res.json({
      mesa: { id: mesa.id, nombre: mesa.nombre, puestos: mesa.puestos },
      sucursal: {
        id: mesa.sucursales.id,
        nombre: mesa.sucursales.nombre,
        direccion: mesa.sucursales.direccion,
        imagen: mesa.sucursales.imagen_principal,
        telefono: mesa.sucursales.telefono,
        whatsapp: mesa.sucursales.whatsapp,
        empresa: mesa.sucursales.empresas?.nombre ?? null,
        logo: mesa.sucursales.empresas?.logo ?? null
      }
    });
  } catch (error) {
    console.error('Error resolviendo mesa:', error);
    res.status(500).json({ error: 'Error al resolver mesa' });
  }
};

// POST /api/sucursales/:id/mesas/:mesaId/regenerar-qr  (dueño/staff/empleado)
export const regenerarQRMesa = async (req: Request, res: Response) => {
  try {
    const sucursalId = Number(req.params.id);
    const mesaId = Number(req.params.mesaId);
    const existente = await prisma.mesas.findFirst({ where: { id: mesaId, sucursal_id: sucursalId } });
    if (!existente) return res.status(404).json({ error: 'Mesa no encontrada' });

    const mesa = await prisma.mesas.update({
      where: { id: mesaId },
      data: { qr_token: generarTokenMesa() }
    });
    res.json(mesa);
  } catch (error) {
    console.error('Error regenerando QR de mesa:', error);
    res.status(500).json({ error: 'Error al regenerar QR' });
  }
};