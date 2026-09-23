import { Request, Response } from 'express';
import { prisma } from '../services/prisma.js';

const buildData = (body: any) => {
  const data: any = {};
  if (body.nombre !== undefined) data.nombre = String(body.nombre).trim();
  if (body.logo !== undefined) data.logo = body.logo || null;
  if (body.activo !== undefined) data.activo = typeof body.activo === 'boolean' ? body.activo : body.activo === '1' || body.activo === 'true';
  if (body.orden !== undefined && body.orden !== '') data.orden = Number(body.orden) || 0;
  return data;
};

// GET /api/marcas  (público: solo activas con logo)
export const listPublic = async (_req: Request, res: Response) => {
  try {
    const marcas = await prisma.marcas.findMany({
      where: { activo: true, logo: { not: null } },
      orderBy: [{ orden: 'asc' }, { fecha_creacion: 'desc' }],
    });
    res.json(marcas);
  } catch (error) {
    console.error('Error listando marcas:', error);
    res.status(500).json({ error: 'Error al listar marcas' });
  }
};

// GET /api/admin/marcas  (solo admin)
export const adminList = async (_req: Request, res: Response) => {
  try {
    const marcas = await prisma.marcas.findMany({
      orderBy: [{ orden: 'asc' }, { fecha_creacion: 'desc' }],
    });
    res.json(marcas);
  } catch (error) {
    console.error('Error listando marcas (admin):', error);
    res.status(500).json({ error: 'Error al listar marcas' });
  }
};

// POST /api/admin/marcas
export const adminCreate = async (req: Request, res: Response) => {
  try {
    const data = buildData(req.body);
    if (!data.nombre) return res.status(400).json({ error: 'nombre es requerido' });
    const marca = await prisma.marcas.create({ data });
    res.status(201).json(marca);
  } catch (error) {
    console.error('Error creando marca:', error);
    res.status(500).json({ error: 'Error al crear marca' });
  }
};

// PATCH /api/admin/marcas/:marcaId
export const adminUpdate = async (req: Request, res: Response) => {
  try {
    const marcaId = Number(req.params.marcaId);
    const marca = await prisma.marcas.findUnique({ where: { id: marcaId } });
    if (!marca) return res.status(404).json({ error: 'Marca no encontrada' });
    const data = buildData(req.body);
    if (data.nombre !== undefined && !data.nombre) return res.status(400).json({ error: 'nombre no puede estar vacío' });
    const actualizado = await prisma.marcas.update({ where: { id: marcaId }, data });
    res.json(actualizado);
  } catch (error) {
    console.error('Error actualizando marca:', error);
    res.status(500).json({ error: 'Error al actualizar marca' });
  }
};

// DELETE /api/admin/marcas/:marcaId
export const adminRemove = async (req: Request, res: Response) => {
  try {
    const marcaId = Number(req.params.marcaId);
    const marca = await prisma.marcas.findUnique({ where: { id: marcaId } });
    if (!marca) return res.status(404).json({ error: 'Marca no encontrada' });
    await prisma.marcas.delete({ where: { id: marcaId } });
    res.json({ message: 'Marca eliminada' });
  } catch (error) {
    console.error('Error eliminando marca:', error);
    res.status(500).json({ error: 'Error al eliminar marca' });
  }
};
