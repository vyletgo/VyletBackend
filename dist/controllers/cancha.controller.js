import { prisma } from '../services/prisma.js';
import { verificarAccesoSucursal } from '../services/acceso.service.js';
export const listarTodas = async (req, res) => {
    try {
        const sucursalId = Number(req.params.id);
        const sucursal = await prisma.sucursales.findUnique({
            where: { id: sucursalId },
            select: { id: true, empresa_id: true }
        });
        if (!sucursal)
            return res.status(404).json({ error: 'Sucursal no encontrada' });
        if (!(await verificarAccesoSucursal(req.user.id, sucursalId))) {
            return res.status(403).json({ error: 'No tienes acceso a esta sucursal' });
        }
        const canchas = await prisma.canchas.findMany({
            where: { sucursal_id: sucursalId },
            orderBy: { id: 'asc' }
        });
        res.json(canchas);
    }
    catch (error) {
        console.error('Error listando canchas:', error);
        res.status(500).json({ error: 'Error al listar canchas' });
    }
};
export const listar = async (req, res) => {
    try {
        const sucursalId = Number(req.params.id);
        const sucursal = await prisma.sucursales.findUnique({ where: { id: sucursalId }, select: { id: true } });
        if (!sucursal)
            return res.status(404).json({ error: 'Sucursal no encontrada' });
        const canchas = await prisma.canchas.findMany({
            where: { sucursal_id: sucursalId, activa: true },
            orderBy: { id: 'asc' }
        });
        res.json(canchas);
    }
    catch (error) {
        console.error('Error listando canchas:', error);
        res.status(500).json({ error: 'Error al listar canchas' });
    }
};
export const crear = async (req, res) => {
    try {
        const sucursalId = Number(req.params.id);
        const sucursal = await prisma.sucursales.findUnique({
            where: { id: sucursalId },
            select: { id: true, empresa_id: true }
        });
        if (!sucursal)
            return res.status(404).json({ error: 'Sucursal no encontrada' });
        if (!(await verificarAccesoSucursal(req.user.id, sucursalId))) {
            return res.status(403).json({ error: 'No tienes acceso a esta sucursal' });
        }
        const { nombre, capacidad, precio_hora, tipo, foto } = req.body;
        if (!nombre)
            return res.status(400).json({ error: 'nombre es requerido' });
        const cancha = await prisma.canchas.create({
            data: {
                sucursal_id: sucursalId,
                nombre: String(nombre).trim(),
                capacidad: capacidad ? Number(capacidad) : 2,
                precio_hora: precio_hora !== undefined ? Number(precio_hora) : 0,
                tipo: tipo || 'general',
                foto: foto || null,
                activa: true
            }
        });
        res.status(201).json(cancha);
    }
    catch (error) {
        console.error('Error creando cancha:', error);
        res.status(500).json({ error: 'Error al crear cancha' });
    }
};
export const editar = async (req, res) => {
    try {
        const sucursalId = Number(req.params.id);
        const canchaId = Number(req.params.canchaId);
        const sucursal = await prisma.sucursales.findUnique({
            where: { id: sucursalId },
            select: { id: true, empresa_id: true }
        });
        if (!sucursal)
            return res.status(404).json({ error: 'Sucursal no encontrada' });
        if (!(await verificarAccesoSucursal(req.user.id, sucursalId))) {
            return res.status(403).json({ error: 'No tienes acceso a esta sucursal' });
        }
        const existente = await prisma.canchas.findFirst({ where: { id: canchaId, sucursal_id: sucursalId } });
        if (!existente)
            return res.status(404).json({ error: 'Cancha no encontrada' });
        const { nombre, capacidad, precio_hora, tipo, foto, activa } = req.body;
        const data = {};
        if (nombre !== undefined)
            data.nombre = String(nombre).trim();
        if (capacidad !== undefined)
            data.capacidad = Number(capacidad);
        if (precio_hora !== undefined)
            data.precio_hora = Number(precio_hora);
        if (tipo !== undefined)
            data.tipo = tipo || 'general';
        if (foto !== undefined)
            data.foto = foto || null;
        if (activa !== undefined)
            data.activa = activa === true;
        const cancha = await prisma.canchas.update({ where: { id: canchaId }, data });
        res.json(cancha);
    }
    catch (error) {
        console.error('Error editando cancha:', error);
        res.status(500).json({ error: 'Error al editar cancha' });
    }
};
export const eliminar = async (req, res) => {
    try {
        const sucursalId = Number(req.params.id);
        const canchaId = Number(req.params.canchaId);
        const sucursal = await prisma.sucursales.findUnique({
            where: { id: sucursalId },
            select: { id: true, empresa_id: true }
        });
        if (!sucursal)
            return res.status(404).json({ error: 'Sucursal no encontrada' });
        if (!(await verificarAccesoSucursal(req.user.id, sucursalId))) {
            return res.status(403).json({ error: 'No tienes acceso a esta sucursal' });
        }
        const existente = await prisma.canchas.findFirst({ where: { id: canchaId, sucursal_id: sucursalId } });
        if (!existente)
            return res.status(404).json({ error: 'Cancha no encontrada' });
        try {
            await prisma.canchas.delete({ where: { id: canchaId } });
            res.json({ message: 'Cancha eliminada' });
        }
        catch (e) {
            // Si tiene reservas asociadas no se puede borrar: se desactiva en su lugar.
            const codigo = e.code;
            if (codigo === 'P2003' || codigo === 'P2014') {
                await prisma.canchas.update({ where: { id: canchaId }, data: { activa: false } });
                return res.json({ message: 'Cancha desactivada (tiene reservas asociadas)' });
            }
            throw e;
        }
    }
    catch (error) {
        console.error('Error eliminando cancha:', error);
        res.status(500).json({ error: 'Error al eliminar cancha' });
    }
};
