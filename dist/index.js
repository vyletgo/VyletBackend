import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import http from 'http';
import routes from './routes/index.js';
import { authenticate } from './middlewares/auth.js';
import { initSocket } from './services/socket.service.js';
import { iniciarCronLimpieza } from './services/cron.service.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
// Serializar BigInt (IDs de PostgreSQL) en las respuestas JSON
BigInt.prototype.toJSON = function () {
    return Number(this);
};
// Detrás de un proxy inverso (Nginx/Render/Railway) hace falta para conocer la IP real
const TRUST_PROXY = process.env.TRUST_PROXY;
if (TRUST_PROXY)
    app.set('trust proxy', TRUST_PROXY === 'true' ? 1 : Number(TRUST_PROXY) || 1);
// Cabeceras de seguridad (X-Content-Type-Options, X-Frame-Options, Referrer-Policy, CSP...)
app.use(helmet());
// CORS con allowlist: CORS_ORIGINS="https://vylet.com,https://www.vylet.com"
const ORIGENES = (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
if (ORIGENES.length === 0 && process.env.NODE_ENV === 'production') {
    console.warn('⚠️ [seguridad] CORS_ORIGINS no está definido: cualquier origen puede llamar a la API.');
}
app.use(cors({
    origin: (origen, cb) => {
        // Peticiones sin Origin (apps móviles, curl) no están sujetas a CORS
        if (!origen)
            return cb(null, true);
        if (ORIGENES.length === 0)
            return cb(null, true);
        return cb(null, ORIGENES.includes(origen));
    },
}));
// Middlewares
// /api/upload necesita 15 MB (base64 de imágenes); el resto se limita a 1 MB
app.use('/api/upload', express.json({ limit: '15mb' }));
app.use('/api/upload', express.urlencoded({ extended: true, limit: '15mb' }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
// Rutas
app.use('/api', routes);
// Ruta de prueba pública
app.get('/ping', (req, res) => {
    res.json({ message: 'pong', timestamp: new Date().toISOString() });
});
// Ruta protegida de prueba (requiere token)
app.get('/api/protected', authenticate, (req, res) => {
    const user = req.user;
    const { clave: _clave, ...userSafe } = user;
    res.json({ message: 'Acceso autorizado con token', user: userSafe });
});
// Crear servidor HTTP y WebSocket
const server = http.createServer(app);
initSocket(server);
iniciarCronLimpieza();
console.log('🔄 Iniciando servidor en puerto...');
// Iniciar servidor
server.listen(Number(PORT) || 3000, '0.0.0.0', () => {
    console.log(`🚀 Servidor corriendo en http://0.0.0.0:${PORT}`);
    console.log(`📡 Base de datos conectada con Prisma`);
    console.log(`🔐 Rutas de autenticación disponibles en /api/auth`);
    console.log(`🔌 WebSocket activo en ws://0.0.0.0:${PORT}`);
});
server.on('error', (err) => {
    console.error('❌ Error en servidor:', err);
});
process.on('unhandledRejection', (reason) => {
    console.error('❌ Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
});
