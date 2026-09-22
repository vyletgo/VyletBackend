import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const PERMISOS = [
  'configuraciones:ver', 'configuraciones:editar',
  'empresas:ver', 'empresas:editar', 'empresas:crear', 'empresas:eliminar',
  'usuarios:listar', 'usuarios:crear', 'usuarios:ver', 'usuarios:editar', 'usuarios:bloquear', 'usuarios:eliminar',
  'roles:listar', 'roles:asignar', 'permisos:asignar',
  'publicidad:ver', 'publicidad:editar',
  'sucursales:crear', 'sucursales:eliminar', 'sucursales:ver', 'sucursales:editar',
  'productos:ver', 'productos:editar', 'productos:crear', 'productos:eliminar',
  'reservas:ver', 'reservas:editar',
  'habitaciones:ver', 'habitaciones:editar',
  'eventos:ver', 'eventos:editar',
  'cupones:ver', 'cupones:editar',
];

async function main() {
  console.log('=== Creando permisos ===');
  const permisoMap: Record<string, number> = {};

  for (const nombre of PERMISOS) {
    const p = await prisma.permisos.upsert({
      where: { nombre },
      update: {},
      create: { nombre, descripcion: nombre.replace(':', ' ') },
    });
    permisoMap[nombre] = p.id;
  }
  console.log(`${PERMISOS.length} permisos creados.`);

  console.log('\n=== Creando roles ===');

  const rolAdmin = await prisma.roles.upsert({
    where: { nombre: 'admin' },
    update: {},
    create: { nombre: 'admin', descripcion: 'Administrador del sistema', activo: true },
  });

  const rolSuperadmin = await prisma.roles.upsert({
    where: { nombre: 'superadmin' },
    update: {},
    create: { nombre: 'superadmin', descripcion: 'Super administrador', activo: true },
  });

  const rolCliente = await prisma.roles.upsert({
    where: { nombre: 'cliente' },
    update: {},
    create: { nombre: 'cliente', descripcion: 'Cliente estándar', activo: true },
  });

  const rolDueno = await prisma.roles.upsert({
    where: { nombre: 'dueno_empresa' },
    update: {},
    create: { nombre: 'dueno_empresa', descripcion: 'Dueño de empresa', activo: true },
  });

  const rolEmpleado = await prisma.roles.upsert({
    where: { nombre: 'empleado_empresa' },
    update: {},
    create: { nombre: 'empleado_empresa', descripcion: 'Empleado de empresa', activo: true },
  });

  const rolGerente = await prisma.roles.upsert({
    where: { nombre: 'gerente' },
    update: {},
    create: { nombre: 'gerente', descripcion: 'Gerente de plataforma', activo: true },
  });

  console.log(`Roles creados: admin, superadmin, cliente, dueno_empresa, empleado_empresa, gerente`);

  console.log('\n=== Asignando TODOS los permisos al rol admin ===');
  const allPermisoIds = Object.values(permisoMap);

  for (const permisoId of allPermisoIds) {
    const exists = await prisma.rol_permisos.findFirst({
      where: { rol_id: rolAdmin.id, permiso_id: permisoId },
    });
    if (!exists) {
      await prisma.rol_permisos.create({
        data: { rol_id: rolAdmin.id, permiso_id: permisoId },
      });
    }
  }
  console.log(`${allPermisoIds.length} permisos asignados a admin.`);

  console.log('\n=== Asignando TODOS los permisos al rol superadmin ===');
  for (const permisoId of allPermisoIds) {
    const exists = await prisma.rol_permisos.findFirst({
      where: { rol_id: rolSuperadmin.id, permiso_id: permisoId },
    });
    if (!exists) {
      await prisma.rol_permisos.create({
        data: { rol_id: rolSuperadmin.id, permiso_id: permisoId },
      });
    }
  }

  console.log('\n=== Creando usuario admin ===');
  const bcrypt = await import('bcryptjs');
  const hashedPassword = await bcrypt.hash('Admin123!', 10);

  const adminUser = await prisma.usuarios.upsert({
    where: { correo: 'admin@vylet.com' },
    update: {},
    create: {
      correo: 'admin@vylet.com',
      nombres: 'Administrador',
      apellidos: 'Vylet',
      clave: hashedPassword,
      telefono: '0990000000',
      activo: true,
      correo_verificado: true,
      rol_id: rolAdmin.id,
    },
  });

  const existingRole = await prisma.usuario_roles.findFirst({
    where: { usuario_id: adminUser.id, rol_id: rolAdmin.id },
  });
  if (!existingRole) {
    await prisma.usuario_roles.create({
      data: { usuario_id: adminUser.id, rol_id: rolAdmin.id },
    });
  }

  console.log(`Usuario admin creado: admin@vylet.com / Admin123!`);
  console.log('\n¡Listo!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
