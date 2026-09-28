import { prisma } from "./src/services/prisma.js";
const rs = await prisma.reservas.findMany({ where: { fecha_reserva: new Date("2026-09-26") }, orderBy: { id: "asc" } });
console.log(JSON.stringify(rs.map(r => ({ id: r.id, hora: String(r.hora_inicio), pers: r.cantidad_personas, mesa: r.mesa_id, estado: r.estado, cliente: r.cliente_nombre, suc: r.sucursal_id })), null, 1));
const mesas = await prisma.mesas.findMany({ where: { sucursal_id: 7 } });
console.log("MESAS:", JSON.stringify(mesas.map(m => ({ id: m.id, nombre: m.nombre, puestos: m.puestos, cantidad: m.cantidad }))));
await prisma.$disconnect();
