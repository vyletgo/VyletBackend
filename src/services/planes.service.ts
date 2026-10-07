import { prisma } from './prisma.js';

export const PLAN_GRATIS_ID = 1;
export const DIAS_DEFAULT_SUSCRIPCION = 365;

// Suscripción activa de una empresa (con su plan)
export const suscripcionActiva = async (empresaId: number) => {
  const hoy = new Date();
  return prisma.suscripciones.findFirst({
    where: { empresa_id: empresaId, estado: 'activa', fecha_fin: { gte: hoy } },
    orderBy: { fecha_fin: 'desc' },
    include: { planes: true }
  });
};

// Plan efectivo de la empresa. Sin suscripción activa => plan Gratis por defecto.
export const planEfectivo = async (empresaId: number) => {
  const sub = await suscripcionActiva(empresaId);
  if (sub?.planes) return { suscripcion: sub, plan: sub.planes };
  const gratis = await prisma.planes.findFirst({ where: { id: PLAN_GRATIS_ID } });
  return { suscripcion: null, plan: gratis };
};

const aLimite = (cantidad: number | null | undefined, defecto: number): number | null => {
  if (cantidad === null || cantidad === undefined) return defecto;
  if (cantidad >= 999999) return null;
  return cantidad;
};

// Límite de sucursales de una empresa (null = ilimitado). Sin suscripción => plan Gratis (1)
export const limiteSucursales = async (empresaId: number): Promise<number | null> => {
  const { plan } = await planEfectivo(empresaId);
  return aLimite(plan?.cantidad_sucursales, 1);
};

// Límite de productos/servicios de una empresa (null = ilimitado). Sin suscripción => plan Gratis (5)
export const limiteProductos = async (empresaId: number): Promise<number | null> => {
  const { plan } = await planEfectivo(empresaId);
  return aLimite(plan?.cantidad_productos, 5);
};

// ¿El plan de la empresa permite crear cupones? Sin suscripción => plan Gratis (no)
export const permiteCupones = async (empresaId: number): Promise<boolean> => {
  const { plan } = await planEfectivo(empresaId);
  return plan?.permite_cupones === true;
};

// ¿El plan de la empresa permite cartillas?
export const permiteCartillas = async (empresaId: number): Promise<boolean> => {
  const { plan } = await planEfectivo(empresaId);
  return plan?.permite_cartillas === true;
};

// ¿El plan de la empresa permite reservas? Sin suscripción => plan Gratis (no)
export const permiteReservas = async (empresaId: number): Promise<boolean> => {
  const { plan } = await planEfectivo(empresaId);
  return plan?.permite_reservas === true;
};

// ¿La empresa tiene reservas habilitadas por su plan?
export const empresaTieneReservas = async (empresaId: number): Promise<boolean> =>
  permiteReservas(empresaId);

// Nombre del plan vigente de una empresa (para mensajes de error)
export const nombrePlan = async (empresaId: number): Promise<string> => {
  const { plan } = await planEfectivo(empresaId);
  return plan?.nombre ?? 'Gratis';
};
