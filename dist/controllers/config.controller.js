import { prisma } from '../services/prisma.js';
export const health = async (_req, res) => {
    try {
        await prisma.$queryRaw `SELECT 1`;
        res.json({ ok: true, database: 'connected', timestamp: new Date().toISOString() });
    }
    catch (e) {
        res.status(503).json({ ok: false, database: 'disconnected', error: e.message, timestamp: new Date().toISOString() });
    }
};
export const getGoogleMapsKey = async (_req, res) => {
    try {
        const config = await prisma.configuraciones.findFirst({
            select: { google_maps_api_key: true },
        });
        res.json({ google_maps_api_key: config?.google_maps_api_key ?? null });
    }
    catch (e) {
        console.error('Error al obtener google_maps_api_key', e);
        res.status(500).json({ error: 'Error al obtener configuración' });
    }
};
