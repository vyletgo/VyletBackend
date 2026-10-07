import type { NextFunction, Request, Response } from 'express';
import { prisma } from '../services/prisma.js';

type Ventana = { contador: number; reinicio: number }

interface Opciones {
  ventanaMs: number
  maximo: number
  mensaje?: string
}

const LIMPIEZA_MS = 5 * 60 * 1000

// --- Respaldo local: se usa solo si la base de datos no está disponible ---
const ventanas = new Map<string, Ventana>()

setInterval(() => {
  const ahora = Date.now()
  for (const [clave, v] of ventanas) if (v.reinicio <= ahora) ventanas.delete(clave)
}, LIMPIEZA_MS).unref?.()

// --- Almacenamiento compartido en Postgres (sirve con varias instancias) ---
let tablaLista = false
let avisoBD = false

async function asegurarTabla(): Promise<void> {
  if (tablaLista) return
  await prisma.$executeRawUnsafe(
    'CREATE TABLE IF NOT EXISTS rate_limit (clave TEXT PRIMARY KEY, contador INTEGER NOT NULL, reinicio TIMESTAMPTZ NOT NULL)',
  )
  await prisma.$executeRawUnsafe(
    'CREATE INDEX IF NOT EXISTS rate_limit_reinicio_idx ON rate_limit (reinicio)',
  )
  tablaLista = true
}

function avisoUnaVez(err: unknown): void {
  if (avisoBD) return
  avisoBD = true
  console.warn(
    '⚠️ [rate-limit] No se pudo usar Postgres, se usará el contador local:',
    err instanceof Error ? err.message : err,
  )
}

async function contarEnBD(clave: string, ventanaMs: number): Promise<number | null> {
  try {
    await asegurarTabla()
    const ahora = new Date()
    const expira = new Date(ahora.getTime() + ventanaMs)
    const filas = await prisma.$queryRaw<Array<{ contador: number }>>`
      INSERT INTO rate_limit (clave, contador, reinicio)
      VALUES (${clave}, 1, ${expira}::timestamptz)
      ON CONFLICT (clave) DO UPDATE SET
        contador = CASE WHEN rate_limit.reinicio <= ${ahora}::timestamptz
                        THEN 1 ELSE rate_limit.contador + 1 END,
        reinicio = CASE WHEN rate_limit.reinicio <= ${ahora}::timestamptz
                        THEN ${expira}::timestamptz ELSE rate_limit.reinicio END
      RETURNING contador`
    return filas[0]?.contador ?? 1
  } catch (err) {
    avisoUnaVez(err)
    return null
  }
}

function contarEnMemoria(clave: string, ventanaMs: number): number {
  const ahora = Date.now()
  let v = ventanas.get(clave)
  if (!v || v.reinicio <= ahora) {
    v = { contador: 0, reinicio: ahora + ventanaMs }
    ventanas.set(clave, v)
  }
  v.contador += 1
  return v.contador
}

// Purga de ventanas vencidas en la BD
setInterval(async () => {
  try {
    if (tablaLista) await prisma.$executeRaw`DELETE FROM rate_limit WHERE reinicio <= now()`
  } catch {
    /* la próxima petición intentará de nuevo */
  }
}, LIMPIEZA_MS).unref?.()

/**
 * Limitador de peticiones por IP.
 * El contador vive en Postgres: funciona aunque haya varias instancias del backend;
 * si la BD falla, hace respaldo en memoria (sin bloquear peticiones).
 */
export function limitar({ ventanaMs, maximo, mensaje }: Opciones) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'desconocida'
    const clave = `${ip}|${req.baseUrl}${req.path}`

    void (async () => {
      const enBD = await contarEnBD(clave, ventanaMs)
      const contador = enBD ?? contarEnMemoria(clave, ventanaMs)
      if (contador <= maximo) return next()

      const ventana = ventanas.get(clave)
      const quedan =
        enBD === null && ventana
          ? Math.max(1, Math.ceil((ventana.reinicio - Date.now()) / 1000))
          : Math.ceil(ventanaMs / 1000)

      res.set('Retry-After', String(quedan))
      res.status(429).json({
        error: mensaje ?? `Demasiadas peticiones. Intenta de nuevo en ${quedan} segundo(s).`,
      })
    })()
  }
}
