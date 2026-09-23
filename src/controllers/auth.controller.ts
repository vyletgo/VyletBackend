import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '../services/prisma.js';
import { generateToken } from '../services/jwt.service.js';
import { enviarEmailRecuperacion } from '../services/email.service.js';

const MAX_INTENTOS = 3;
const BLOQUEO_MINUTOS = 15;
const RESET_TOKEN_EXPIRA_MINUTOS = 30;

// Registrar un nuevo usuario
export const register = async (req: Request, res: Response) => {
  try {
    const { nombres, apellidos, correo, telefono, clave, genero, fecha_nacimiento, cedula, tipo } = req.body;

    // Validar que el correo no esté registrado
    const existingUser = await prisma.usuarios.findUnique({
      where: { correo }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    if (cedula) {
      const conCedula = await prisma.usuarios.findUnique({ where: { cedula } });
      if (conCedula) {
        return res.status(400).json({ error: 'La cédula ya está registrada' });
      }
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(clave, 10);

    // Buscar rol por defecto 'cliente'
    let rolUsuario = await prisma.roles.findFirst({
      where: { nombre: 'cliente' }
    });

    if (!rolUsuario) {
      // Si no existe, crear el rol cliente por defecto
      rolUsuario = await prisma.roles.create({
        data: { nombre: 'cliente', activo: true }
      });
    }

    // Crear usuario
    const newUser = await prisma.usuarios.create({
      data: {
        cedula: cedula || null,
        nombres,
        apellidos,
        correo,
        telefono,
        clave: hashedPassword,
        genero,
        fecha_nacimiento: fecha_nacimiento ? new Date(fecha_nacimiento) : null,
        activo: true,
        correo_verificado: false,
        rol_id: rolUsuario.id
      },
      include: { roles: true }
    });

    // Vincular el rol en usuario_roles (soporta multiroles)
    await prisma.usuario_roles.create({
      data: { usuario_id: newUser.id, rol_id: rolUsuario.id }
    });

    // Generar token JWT
    const token = generateToken(Number(newUser.id), newUser.correo, newUser.rol_id || undefined);

    // Si pidió ser dueño, registrar la solicitud (queda en cliente hasta aprobación del admin)
    const esDueno = tipo === 'dueno' || tipo === 'dueño';
    let solicitud_id: number | null = null;
    if (esDueno) {
      const solicitud = await prisma.solicitudes_dueno.create({
        data: { usuario_id: newUser.id, estado: 'pendiente' }
      });
      solicitud_id = solicitud.id;
    }

    // Responder sin enviar la contraseña
    const { clave: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      message: esDueno
        ? 'Usuario registrado. Tu solicitud para ser dueño de negocio fue enviada y está pendiente de aprobación.'
        : 'Usuario registrado exitosamente',
      token,
      user: userWithoutPassword,
      solicitud_id,
      solicitud_pendiente: esDueno
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

// Login de usuario
export const login = async (req: Request, res: Response) => {
  try {
    const { correo, clave } = req.body;

    if (!correo || !clave) {
      return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
    }

    // Buscar usuario por correo
    const user = await prisma.usuarios.findUnique({
      where: { correo },
      include: { roles: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    if (!user.activo) {
      return res.status(401).json({ error: 'Cuenta desactivada' });
    }

    // Verificar si la cuenta está bloqueada
    if (user.bloqueado_hasta && user.bloqueado_hasta > new Date()) {
      const minutosRestantes = Math.ceil((user.bloqueado_hasta.getTime() - Date.now()) / 60000);
      return res.status(423).json({
        error: `Cuenta bloqueada por intentos fallidos. Intenta de nuevo en ${minutosRestantes} minuto(s).`,
        bloqueada: true,
        minutos_restantes: minutosRestantes,
      });
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(clave, user.clave);
    if (!isPasswordValid) {
      const intentos = (user.intentos_fallidos || 0) + 1;

      if (intentos >= MAX_INTENTOS) {
        const bloqueadoHasta = new Date(Date.now() + BLOQUEO_MINUTOS * 60000);
        await prisma.usuarios.update({
          where: { id: user.id },
          data: { intentos_fallidos: intentos, bloqueado_hasta: bloqueadoHasta },
        });
        return res.status(423).json({
          error: `Cuenta bloqueada tras ${MAX_INTENTOS} intentos fallidos. Intenta de nuevo en ${BLOQUEO_MINUTOS} minutos.`,
          bloqueada: true,
          minutos_restantes: BLOQUEO_MINUTOS,
        });
      }

      await prisma.usuarios.update({
        where: { id: user.id },
        data: { intentos_fallidos: intentos },
      });

      const restantes = MAX_INTENTOS - intentos;
      return res.status(401).json({
        error: `Credenciales inválidas. Te quedan ${restantes} intento(s).`,
        intentos_restantes: restantes,
      });
    }

    // Contraseña correcta → resetear intentos
    await prisma.usuarios.update({
      where: { id: user.id },
      data: { intentos_fallidos: 0, bloqueado_hasta: null, ultimo_acceso: new Date() },
    });

    // Generar token
    const token = generateToken(Number(user.id), user.correo, user.rol_id || undefined);

    // Responder sin enviar la contraseña
    const { clave: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login exitoso',
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

// Obtener perfil del usuario autenticado
export const getProfile = async (req: Request, res: Response) => {
  try {
    // El usuario ya está en req.user gracias al middleware authenticate
    const user = req.user;
    const { clave: _, ...userWithoutPassword } = user;
    res.json({ ...userWithoutPassword, permisos: req.permisos || [] });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};

// Solicitar reset de contraseña
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { correo } = req.body;

    if (!correo) {
      return res.status(400).json({ error: 'El correo es requerido' });
    }

    const user = await prisma.usuarios.findUnique({ where: { correo } });

    // Siempre responder igual para no revelar si el correo existe
    const respuesta = { message: 'Si el correo existe, se enviará un enlace de recuperación.' };

    if (!user) {
      return res.json(respuesta);
    }

    // Generar token aleatorio
    const token = crypto.randomBytes(32).toString('hex');
    const expiracion = new Date(Date.now() + RESET_TOKEN_EXPIRA_MINUTOS * 60000);

    // Guardar token (invalidar tokens anteriores no usados)
    await prisma.tokens_recuperacion.updateMany({
      where: { usuario_id: user.id, usado: false },
      data: { usado: true },
    });

    await prisma.tokens_recuperacion.create({
      data: {
        usuario_id: user.id,
        token,
        fecha_expiracion: expiracion,
        usado: false,
      },
    });

    // Enviar email con enlace de recuperación
    try {
      const nombre = `${user.nombres} ${user.apellidos || ''}`.trim();
      await enviarEmailRecuperacion(user.correo, nombre, token);
      console.log(`[RESET PASSWORD] Email enviado a ${user.correo}`);
    } catch (emailError) {
      console.error('Error enviando email de recuperación:', emailError);
      // En desarrollo, devolver token si falla el email
      return res.json({ ...respuesta, token });
    }

    res.json(respuesta);
  } catch (error) {
    console.error('Error en forgotPassword:', error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
};

// Resetear contraseña con token
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, nueva_clave } = req.body;

    if (!token || !nueva_clave) {
      return res.status(400).json({ error: 'Token y nueva contraseña son requeridos' });
    }

    if (nueva_clave.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    const tokenRecord = await prisma.tokens_recuperacion.findUnique({
      where: { token },
      include: { usuarios: true },
    });

    if (!tokenRecord || tokenRecord.usado) {
      return res.status(400).json({ error: 'Token inválido o ya utilizado' });
    }

    if (tokenRecord.fecha_expiracion < new Date()) {
      return res.status(400).json({ error: 'Token expirado. Solicita uno nuevo.' });
    }

    // Actualizar contraseña y desbloquear cuenta
    const hashedPassword = await bcrypt.hash(nueva_clave, 10);
    await prisma.usuarios.update({
      where: { id: tokenRecord.usuario_id },
      data: {
        clave: hashedPassword,
        intentos_fallidos: 0,
        bloqueado_hasta: null,
      },
    });

    // Marcar token como usado
    await prisma.tokens_recuperacion.update({
      where: { id: tokenRecord.id },
      data: { usado: true },
    });

    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error en resetPassword:', error);
    res.status(500).json({ error: 'Error al restablecer la contraseña' });
  }
};