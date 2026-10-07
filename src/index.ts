import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import http from 'http';
import routes from './routes/index.js';
import { initSocket } from './services/socket.service.js';
import { iniciarCronLimpieza } from './services/cron.service.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Serializar BigInt (IDs de PostgreSQL) en las respuestas JSON
(BigInt.prototype as unknown as { toJSON: () => number }).toJSON = function () {
  return Number(this);
};

// Detrás de un proxy inverso (Nginx/Render/Railway) hace falta para conocer la IP real
const TRUST_PROXY = process.env.TRUST_PROXY
if (TRUST_PROXY) app.set('trust proxy', TRUST_PROXY === 'true' ? 1 : Number(TRUST_PROXY) || 1);

// Cabeceras de seguridad (X-Content-Type-Options, X-Frame-Options, Referrer-Policy, CSP...)
app.use(helmet());

// CORS con allowlist: CORS_ORIGINS="https://vylet.com,https://www.vylet.com"
const ORIGENES = (process.env.CORS_ORIGINS ?? '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean)

if (ORIGENES.length === 0 && process.env.NODE_ENV === 'production') {
  console.warn('⚠️ [seguridad] CORS_ORIGINS no está definido: cualquier origen puede llamar a la API.');
}

app.use(
  cors({
    origin: (origen, cb) => {
      // Peticiones sin Origin (apps móviles, curl) no están sujetas a CORS
      if (!origen) return cb(null, true)
      if (ORIGENES.length === 0) return cb(null, true)
      return cb(null, ORIGENES.includes(origen))
    },
  }),
);

// Middlewares
// /api/upload necesita 15 MB (base64 de imágenes); el resto se limita a 1 MB
app.use('/api/upload', express.json({ limit: '15mb' }));
app.use('/api/upload', express.urlencoded({ extended: true, limit: '15mb' }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Rutas
app.use('/api', routes);

// Cualquier otra ruta → 404 en JSON (sin HTML ni detalles internos)
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejador de errores: en producción no se filtran stacktraces ni rutas del servidor
interface ErrorHttp extends Error {
  status?: number;
  statusCode?: number;
}

app.use((err: ErrorHttp, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (res.headersSent) return next(err);
  const estado = err.status ?? err.statusCode ?? 500;
  if (estado >= 500) console.error('❌ Error no controlado:', err);
  res.status(estado).json({
    error: estado >= 500 ? 'Error interno del servidor' : err.message,
  });
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
  // Salir para que el process manager (pm2/systemd/ Fly) reinicie con estado limpio
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});