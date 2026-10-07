const ventanas = new Map();
// Limpieza periódica para que el mapa no crezca sin control
const LIMPIEZA_MS = 5 * 60 * 1000;
setInterval(() => {
    const ahora = Date.now();
    for (const [clave, v] of ventanas)
        if (v.reinicio <= ahora)
            ventanas.delete(clave);
}, LIMPIEZA_MS).unref?.();
/**
 * Limitador de peticiones por IP, en memoria (sin dependencias).
 * Pensado para despliegues de una sola instancia.
 */
export function limitar({ ventanaMs, maximo, mensaje }) {
    return (req, res, next) => {
        const ip = req.ip || req.socket.remoteAddress || 'desconocida';
        const clave = `${ip}:${req.baseUrl}${req.path}`;
        const ahora = Date.now();
        let v = ventanas.get(clave);
        if (!v || v.reinicio <= ahora) {
            v = { contador: 0, reinicio: ahora + ventanaMs };
            ventanas.set(clave, v);
        }
        v.contador += 1;
        if (v.contador > maximo) {
            const quedan = Math.ceil((v.reinicio - ahora) / 1000);
            res.set('Retry-After', String(quedan));
            return res.status(429).json({
                error: mensaje ?? `Demasiadas peticiones. Intenta de nuevo en ${quedan} segundo(s).`,
            });
        }
        return next();
    };
}
