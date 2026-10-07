import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config, parse } from 'dotenv';

const dirBackend = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const rutaEnv = path.join(dirBackend, '.env');

// Secretos que viajaron en el código fuente (y siguen en el historial de git):
// si el servidor arranca con uno de estos, cualquier persona con acceso al repo podría firmar tokens.
const SECRETOS_CONOCIDOS = new Set([
  'mi_secreto_super_seguro_cambiar_en_produccion',
  'vylet-qr-secret-change-in-production',
]);

function valorValido(valor: string | undefined, minimo = 32): boolean {
  if (!valor) return false;
  const v = valor.trim();
  return v.length >= minimo && !SECRETOS_CONOCIDOS.has(v);
}

export function esSecretoValido(nombre: string, minimo = 32): boolean {
  return valorValido(process.env[nombre], minimo);
}

config(); // ./.env (directorio de trabajo)

// Si el entorno hereda un JWT_SECRET vacío, corto o conocido, se usa el .env del backend.
if (!esSecretoValido('JWT_SECRET') && fs.existsSync(rutaEnv)) {
  try {
    const parsed = parse(fs.readFileSync(rutaEnv, 'utf8'));
    if (valorValido(parsed.JWT_SECRET)) {
      process.env.JWT_SECRET = parsed.JWT_SECRET;
      console.log('ℹ️ [seguridad] JWT_SECRET tomado de ' + rutaEnv);
    }
  } catch (e) {
    console.warn('⚠️ [seguridad] No se pudo leer .env:', e instanceof Error ? e.message : e);
  }
}

export function resolverSecreto(nombre: string, minimo = 32): string {
  const valor = (process.env[nombre] ?? '').trim();

  if (!valorValido(valor, minimo)) {
    const mensaje = `[seguridad] ${nombre} no está definido, es demasiado corto o es un secreto por defecto.`;
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`${mensaje} Configúralo (>=${minimo} caracteres) antes de desplegar en producción.`);
    }
    console.warn(`⚠️ ${mensaje} Usando secreto efímero: las sesiones se invalidan al reiniciar.`);
    return randomBytes(48).toString('hex');
  }

  return valor;
}

const JWT_SECRET = resolverSecreto('JWT_SECRET');
const JWT_EXPIRES_IN = '7d'; // 7 días

export const generateToken = (userId: number, email: string, rolId?: number) => {
  return jwt.sign(
    { userId, email, rolId },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};
