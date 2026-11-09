import { Request, Response } from 'express';
import { prisma } from '../services/prisma.js';

const buildData = (body: any) => {
  const data: any = {};
  if (body.badge !== undefined) data.badge = body.badge ? String(body.badge).trim() : null;
  if (body.titulo !== undefined) data.titulo = String(body.titulo).trim();
  if (body.descripcion !== undefined) data.descripcion = body.descripcion ? String(body.descripcion).trim() : null;
  if (body.imagen_url !== undefined) data.imagen_url = body.imagen_url || null;
  if (body.enlace !== undefined) data.enlace = body.enlace ? String(body.enlace).trim() : null;
  if (body.texto_boton !== undefined) data.texto_boton = body.texto_boton ? String(body.texto_boton).trim() : null;
  if (body.orden !== undefined && body.orden !== '') data.orden = Number(body.orden) || 0;
  if (body.activo !== undefined)
    data.activo = typeof body.activo === 'boolean' ? body.activo : body.activo === '1' || body.activo === 'true';
  return data;
};

const validar = (data: any, exigirTitulo: boolean) => {
  if (exigirTitulo && !data.titulo) return 'titulo es requerido';
  if (data.titulo !== undefined && !data.titulo) return 'titulo no puede estar vacío';
  if (data.titulo && data.titulo.length > 200) return 'titulo no puede superar 200 caracteres';
  if (data.badge && data.badge.length > 60) return 'badge no puede superar 60 caracteres';
  if (data.texto_boton && data.texto_boton.length > 40) return 'texto_boton no puede superar 40 caracteres';
  if (data.imagen_url && data.imagen_url.length > 500) return 'imagen_url no puede superar 500 caracteres';
  if (data.enlace && data.enlace.length > 500) return 'enlace no puede superar 500 caracteres';
  return null;
};

const orden = [{ orden: 'asc' as const }, { fecha_creacion: 'desc' as const }];

// GET /api/banners-destacados  (público: los que se muestran en la portada)
export const listPublic = async (_req: Request, res: Response) => {
  try {
    const banners = await prisma.banners_destacados.findMany({
      where: { activo: true },
      orderBy: orden,
    });
    res.json(banners);
  } catch (error) {
    console.error('Error listando banners:', error);
    res.status(500).json({ error: 'Error al listar banners' });
  }
};

// GET /api/admin/banners-destacados  (admin/superadmin)
export const adminList = async (_req: Request, res: Response) => {
  try {
    const banners = await prisma.banners_destacados.findMany({ orderBy: orden });
    res.json(banners);
  } catch (error) {
    console.error('Error listando banners (admin):', error);
    res.status(500).json({ error: 'Error al listar banners' });
  }
};

// POST /api/admin/banners-destacados
export const adminCreate = async (req: Request, res: Response) => {
  try {
    const data = buildData(req.body);
    const error = validar(data, true);
    if (error) return res.status(400).json({ error });
    const banner = await prisma.banners_destacados.create({ data });
    res.status(201).json(banner);
  } catch (error) {
    console.error('Error creando banner:', error);
    res.status(500).json({ error: 'Error al crear banner' });
  }
};

// PATCH /api/admin/banners-destacados/:bannerId
export const adminUpdate = async (req: Request, res: Response) => {
  try {
    const bannerId = Number(req.params.bannerId);
    const banner = await prisma.banners_destacados.findUnique({ where: { id: bannerId } });
    if (!banner) return res.status(404).json({ error: 'Banner no encontrado' });
    const data = buildData(req.body);
    const error = validar(data, false);
    if (error) return res.status(400).json({ error });
    const actualizado = await prisma.banners_destacados.update({ where: { id: bannerId }, data });
    res.json(actualizado);
  } catch (error) {
    console.error('Error actualizando banner:', error);
    res.status(500).json({ error: 'Error al actualizar banner' });
  }
};

// DELETE /api/admin/banners-destacados/:bannerId
export const adminRemove = async (req: Request, res: Response) => {
  try {
    const bannerId = Number(req.params.bannerId);
    const banner = await prisma.banners_destacados.findUnique({ where: { id: bannerId } });
    if (!banner) return res.status(404).json({ error: 'Banner no encontrado' });
    await prisma.banners_destacados.delete({ where: { id: bannerId } });
    res.json({ message: 'Banner eliminado' });
  } catch (error) {
    console.error('Error eliminando banner:', error);
    res.status(500).json({ error: 'Error al eliminar banner' });
  }
};
