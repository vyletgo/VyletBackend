import { prisma } from '../services/prisma.js';
// GET /api/notificaciones  (autenticado: mis notificaciones + contador de no leídas)
export const listarMias = async (req, res) => {
    try {
        const [items, noLeidas] = await Promise.all([
            prisma.notificaciones.findMany({
                where: { usuario_id: req.user.id },
                orderBy: { fecha_creacion: 'desc' },
                take: 30
            }),
            prisma.notificaciones.count({ where: { usuario_id: req.user.id, leido: false } })
        ]);
        res.json({ no_leidas: noLeidas, items });
    }
    catch (error) {
        console.error('Error listando notificaciones:', error);
        res.status(500).json({ error: 'Error al listar notificaciones' });
    }
};
// POST /api/notificaciones/leer-todas  (autenticado)
export const marcarTodasLeidas = async (req, res) => {
    try {
        const r = await prisma.notificaciones.updateMany({
            where: { usuario_id: req.user.id, leido: false },
            data: { leido: true }
        });
        res.json({ message: 'Notificaciones marcadas como leídas', actualizadas: r.count });
    }
    catch (error) {
        console.error('Error marcando notificaciones:', error);
        res.status(500).json({ error: 'Error al marcar notificaciones' });
    }
};
// POST /api/notificaciones/:id/leer  (autenticado: marca solo esa)
export const marcarLeida = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id))
            return res.status(400).json({ error: 'Id inválido' });
        const existente = await prisma.notificaciones.findFirst({
            where: { id, usuario_id: req.user.id },
            select: { id: true }
        });
        if (!existente)
            return res.status(404).json({ error: 'Notificación no encontrada' });
        await prisma.notificaciones.update({ where: { id }, data: { leido: true } });
        const noLeidas = await prisma.notificaciones.count({
            where: { usuario_id: req.user.id, leido: false }
        });
        res.json({ message: 'Notificación marcada como leída', no_leidas: noLeidas });
    }
    catch (error) {
        console.error('Error marcando notificación:', error);
        res.status(500).json({ error: 'Error al marcar la notificación' });
    }
};
