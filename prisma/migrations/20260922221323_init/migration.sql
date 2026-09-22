-- CreateTable
CREATE TABLE "archivos" (
    "id" SERIAL NOT NULL,
    "nombre_original" VARCHAR(255),
    "archivo" VARCHAR(500),
    "tipo" VARCHAR(100),
    "tamano" BIGINT,
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "archivos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auditoria" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER,
    "tabla_afectada" VARCHAR(100),
    "accion" VARCHAR(50),
    "registro_id" INTEGER,
    "descripcion" TEXT,
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auditoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias_evento" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "activo" BOOLEAN DEFAULT true,

    CONSTRAINT "categorias_evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias_negocio" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "icono" VARCHAR(255),
    "color" VARCHAR(20),
    "permite_productos" BOOLEAN DEFAULT true,
    "permite_reservas" BOOLEAN DEFAULT false,
    "permite_habitaciones" BOOLEAN DEFAULT false,
    "permite_mesas" BOOLEAN DEFAULT false,
    "permite_canchas" BOOLEAN DEFAULT false,
    "activo" BOOLEAN DEFAULT true,
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categorias_negocio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias_producto" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "activo" BOOLEAN DEFAULT true,

    CONSTRAINT "categorias_producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ciudades" (
    "id" SERIAL NOT NULL,
    "provincia_id" INTEGER NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(150),
    "descripcion" TEXT,
    "historia" TEXT,
    "imagen_principal" VARCHAR(500),
    "latitud" DECIMAL(10,8),
    "longitud" DECIMAL(11,8),
    "altitud" INTEGER,
    "temperatura_min" INTEGER,
    "temperatura_max" INTEGER,
    "poblacion" INTEGER,
    "distincion" VARCHAR(200),
    "es_turistica" BOOLEAN DEFAULT false,
    "activo" BOOLEAN DEFAULT true,
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ciudades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuraciones" (
    "id" SERIAL NOT NULL,
    "nombre_app" VARCHAR(200) NOT NULL,
    "descripcion_app" TEXT,
    "logo" VARCHAR(500),
    "favicon" VARCHAR(500),
    "correo_soporte" VARCHAR(150),
    "telefono_soporte" VARCHAR(30),
    "whatsapp_soporte" VARCHAR(30),
    "direccion" TEXT,
    "facebook" VARCHAR(255),
    "instagram" VARCHAR(255),
    "tiktok" VARCHAR(255),
    "youtube" VARCHAR(255),
    "sitio_web" VARCHAR(255),
    "mantenimiento" BOOLEAN DEFAULT false,
    "version_app" VARCHAR(20),
    "fecha_actualizacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "comision_porcentaje" DECIMAL(5,2) DEFAULT 0,
    "google_maps_api_key" TEXT,
    "firebase_project_id" VARCHAR(255),

    CONSTRAINT "configuraciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cupones" (
    "id" SERIAL NOT NULL,
    "sucursal_id" INTEGER NOT NULL,
    "titulo" VARCHAR(200) NOT NULL,
    "descripcion" TEXT,
    "imagen" VARCHAR(500),
    "codigo" VARCHAR(50),
    "tipo_descuento" VARCHAR(20) NOT NULL,
    "valor_descuento" DECIMAL(10,2) NOT NULL,
    "monto_minimo" DECIMAL(10,2),
    "fecha_inicio" DATE,
    "fecha_fin" DATE,
    "cantidad_usos" INTEGER,
    "usos_realizados" INTEGER DEFAULT 0,
    "activo" BOOLEAN DEFAULT true,
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cupones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cupones_usuario" (
    "id" SERIAL NOT NULL,
    "cupon_id" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "estado" VARCHAR(20) DEFAULT 'pendiente',
    "fecha_uso" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "fecha_canje" TIMESTAMP(6),

    CONSTRAINT "cupones_usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cartilla_config" (
    "id" SERIAL NOT NULL,
    "sucursal_id" INTEGER NOT NULL,
    "titulo" VARCHAR(200) NOT NULL DEFAULT 'Cartilla de fidelización',
    "descripcion" TEXT,
    "sellos_requeridos" INTEGER NOT NULL DEFAULT 10,
    "premio" VARCHAR(300) NOT NULL,
    "activo" BOOLEAN DEFAULT true,
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cartilla_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cartilla_cliente" (
    "id" SERIAL NOT NULL,
    "config_id" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "sellos" INTEGER NOT NULL DEFAULT 0,
    "estado" VARCHAR(20) DEFAULT 'activa',
    "fecha_completada" TIMESTAMP(6),
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cartilla_cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cartilla_sello" (
    "id" SERIAL NOT NULL,
    "cartilla_id" INTEGER NOT NULL,
    "empleado_id" INTEGER,
    "fecha" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cartilla_sello_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disponibilidad_sucursal" (
    "id" SERIAL NOT NULL,
    "sucursal_id" INTEGER NOT NULL,
    "fecha" DATE NOT NULL,
    "disponible" BOOLEAN DEFAULT true,
    "motivo" VARCHAR(200),
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "disponibilidad_sucursal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "empresas" (
    "id" SERIAL NOT NULL,
    "categoria_id" INTEGER NOT NULL,
    "nombre" VARCHAR(200) NOT NULL,
    "descripcion" TEXT,
    "logo" VARCHAR(500),
    "email" VARCHAR(150),
    "sitio_web" VARCHAR(250),
    "facebook" VARCHAR(250),
    "instagram" VARCHAR(250),
    "tiktok" VARCHAR(250),
    "propietario" VARCHAR(200),
    "latitud" DECIMAL(10,8),
    "longitud" DECIMAL(11,8),
    "verificado" BOOLEAN DEFAULT false,
    "destacado" BOOLEAN DEFAULT false,
    "activo" BOOLEAN DEFAULT true,
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "empresas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "etiquetas" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "etiquetas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evento_imagenes" (
    "id" SERIAL NOT NULL,
    "evento_id" INTEGER NOT NULL,
    "imagen" VARCHAR(500) NOT NULL,
    "principal" BOOLEAN DEFAULT false,

    CONSTRAINT "evento_imagenes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evento_etiquetas" (
    "id" SERIAL NOT NULL,
    "evento_id" INTEGER NOT NULL,
    "etiqueta_id" INTEGER NOT NULL,

    CONSTRAINT "evento_etiquetas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventos" (
    "id" SERIAL NOT NULL,
    "ciudad_id" INTEGER NOT NULL,
    "nombre" VARCHAR(250) NOT NULL,
    "descripcion" TEXT,
    "lugar" VARCHAR(250),
    "direccion" TEXT,
    "fecha_inicio" TIMESTAMP(6) NOT NULL,
    "fecha_fin" TIMESTAMP(6),
    "latitud" DECIMAL(10,8),
    "longitud" DECIMAL(11,8),
    "imagen_principal" VARCHAR(500),
    "precio_desde" DECIMAL(10,2),
    "capacidad" INTEGER,
    "destacado" BOOLEAN DEFAULT false,
    "banner_principal" BOOLEAN DEFAULT false,
    "banner_fecha_inicio" TIMESTAMP(6),
    "banner_fecha_fin" TIMESTAMP(6),
    "activo" BOOLEAN DEFAULT true,
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "categoria_evento_id" INTEGER,
    "instagram_url" VARCHAR(500),
    "facebook_url" VARCHAR(500),
    "tiktok_url" VARCHAR(500),
    "tiketera_url" VARCHAR(500),
    "tiketera_plataforma" VARCHAR(100),
    "email_contacto" VARCHAR(250),
    "whatsapp_contacto" VARCHAR(50),
    "sitio_web" VARCHAR(500),

    CONSTRAINT "eventos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favoritos" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "sucursal_id" INTEGER NOT NULL,
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favoritos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "habitacion_imagenes" (
    "id" SERIAL NOT NULL,
    "habitacion_id" INTEGER NOT NULL,
    "imagen" VARCHAR(500) NOT NULL,
    "principal" BOOLEAN DEFAULT false,

    CONSTRAINT "habitacion_imagenes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "habitaciones" (
    "id" SERIAL NOT NULL,
    "sucursal_id" INTEGER NOT NULL,
    "nombre" VARCHAR(100),
    "capacidad" INTEGER,
    "precio" DECIMAL(10,2),
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "activa" BOOLEAN DEFAULT true,

    CONSTRAINT "habitaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historial_busquedas" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER,
    "texto_buscado" VARCHAR(300),
    "latitud" DECIMAL(10,8),
    "longitud" DECIMAL(11,8),
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historial_busquedas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mesas" (
    "id" SERIAL NOT NULL,
    "sucursal_id" INTEGER NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "puestos" INTEGER NOT NULL DEFAULT 2,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "foto" VARCHAR(500),
    "activa" BOOLEAN DEFAULT true,
    "qr_token" VARCHAR(100),
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mesas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notificaciones" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "tipo" VARCHAR(50) DEFAULT 'general',
    "titulo" VARCHAR(200),
    "mensaje" TEXT,
    "enlace" VARCHAR(500),
    "leido" BOOLEAN DEFAULT false,
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notificaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagos" (
    "id" SERIAL NOT NULL,
    "empresa_id" INTEGER NOT NULL,
    "suscripcion_id" INTEGER,
    "monto" DECIMAL(10,2) NOT NULL,
    "metodo_pago" VARCHAR(50),
    "referencia_pago" VARCHAR(200),
    "estado" VARCHAR(50),
    "fecha_pago" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pagos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedido_detalle" (
    "id" SERIAL NOT NULL,
    "pedido_id" INTEGER NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "precio_unitario" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "nota" VARCHAR(300),
    "estado" VARCHAR(30) DEFAULT 'pendiente',
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pedido_detalle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedidos" (
    "id" SERIAL NOT NULL,
    "sucursal_id" INTEGER NOT NULL,
    "mesa_id" INTEGER,
    "reserva_id" INTEGER,
    "usuario_id" INTEGER,
    "cliente_nombre" VARCHAR(200),
    "cliente_telefono" VARCHAR(30),
    "estado" VARCHAR(30) DEFAULT 'pendiente',
    "total" DECIMAL(10,2) DEFAULT 0,
    "notas" TEXT,
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pedidos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permisos" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "permisos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planes" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "precio" DECIMAL(10,2) NOT NULL,
    "cantidad_sucursales" INTEGER,
    "cantidad_empresas" INTEGER,
    "cantidad_productos" INTEGER,
    "permite_publicidad" BOOLEAN DEFAULT false,
    "permite_destacados" BOOLEAN DEFAULT false,
    "permite_cupones" BOOLEAN DEFAULT false,
    "permite_reservas" BOOLEAN DEFAULT false,
    "permite_cartillas" BOOLEAN DEFAULT false,
    "dias_duracion" INTEGER,
    "destacado" BOOLEAN DEFAULT false,
    "activo" BOOLEAN DEFAULT true,

    CONSTRAINT "planes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "producto_etiquetas" (
    "id" SERIAL NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "etiqueta_id" INTEGER NOT NULL,

    CONSTRAINT "producto_etiquetas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "producto_imagenes" (
    "id" SERIAL NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "imagen" VARCHAR(500) NOT NULL,
    "principal" BOOLEAN DEFAULT false,
    "orden" INTEGER DEFAULT 1,
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "producto_imagenes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productos_servicios" (
    "id" SERIAL NOT NULL,
    "sucursal_id" INTEGER NOT NULL,
    "nombre" VARCHAR(200) NOT NULL,
    "descripcion" TEXT,
    "tipo" VARCHAR(50) NOT NULL,
    "precio" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "precio_oferta" DECIMAL(10,2),
    "stock" INTEGER DEFAULT 0,
    "imagen_principal" VARCHAR(500),
    "destacado" BOOLEAN DEFAULT false,
    "disponible" BOOLEAN DEFAULT true,
    "activo" BOOLEAN DEFAULT true,
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "categoria_producto_id" INTEGER,

    CONSTRAINT "productos_servicios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "provincias" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "activo" BOOLEAN DEFAULT true,
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "imagen" VARCHAR(500),

    CONSTRAINT "provincias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "publicidades" (
    "id" SERIAL NOT NULL,
    "empresa_id" INTEGER NOT NULL,
    "titulo" VARCHAR(250) NOT NULL,
    "subtitulo" VARCHAR(300),
    "imagen" VARCHAR(500),
    "enlace" VARCHAR(500),
    "fecha_inicio" DATE,
    "fecha_fin" DATE,
    "clics" INTEGER DEFAULT 0,
    "vistas" INTEGER DEFAULT 0,
    "activo" BOOLEAN DEFAULT true,
    "descripcion" TEXT,
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "ubicacion" VARCHAR(50),
    "estado" VARCHAR(20) DEFAULT 'pendiente',
    "presupuesto" DECIMAL(10,2),

    CONSTRAINT "publicidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recomendaciones" (
    "id" SERIAL NOT NULL,
    "solicitud_id" INTEGER NOT NULL,
    "sucursal_id" INTEGER NOT NULL,
    "puntaje" DECIMAL(6,2),
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recomendaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resenas" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "sucursal_id" INTEGER NOT NULL,
    "calificacion" INTEGER NOT NULL,
    "comentario" TEXT,
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resenas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservas" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER,
    "sucursal_id" INTEGER NOT NULL,
    "mesa_id" INTEGER,
    "fecha_reserva" DATE NOT NULL,
    "hora_inicio" TIME(6),
    "hora_fin" TIME(6),
    "cantidad_personas" INTEGER DEFAULT 1,
    "observaciones" TEXT,
    "estado" VARCHAR(30) DEFAULT 'pendiente',
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "cliente_nombre" TEXT,
    "cliente_telefono" TEXT,
    "cliente_correo" TEXT,
    "platos" TEXT,

    CONSTRAINT "reservas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservas_habitacion" (
    "id" SERIAL NOT NULL,
    "habitacion_id" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "fecha_entrada" DATE NOT NULL,
    "fecha_salida" DATE NOT NULL,
    "personas" INTEGER,
    "estado" VARCHAR(30) DEFAULT 'pendiente',
    "origen" VARCHAR(30),
    "cliente_nombre" VARCHAR(200),
    "cliente_telefono" VARCHAR(30),

    CONSTRAINT "reservas_habitacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rol_permisos" (
    "id" SERIAL NOT NULL,
    "rol_id" INTEGER NOT NULL,
    "permiso_id" INTEGER NOT NULL,

    CONSTRAINT "rol_permisos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "activo" BOOLEAN DEFAULT true,
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servicios" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "descripcion" TEXT,
    "activo" BOOLEAN DEFAULT true,

    CONSTRAINT "servicios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solicitud_intereses" (
    "id" SERIAL NOT NULL,
    "solicitud_id" INTEGER NOT NULL,
    "tipo_interes_id" INTEGER NOT NULL,

    CONSTRAINT "solicitud_intereses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solicitudes_recomendacion" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER,
    "presupuesto" DECIMAL(10,2),
    "cantidad_personas" INTEGER,
    "cantidad_dias" INTEGER,
    "observaciones" TEXT,
    "estado" VARCHAR(20) DEFAULT 'pendiente',
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "solicitudes_recomendacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solicitudes_dueno" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "fecha_respuesta" TIMESTAMP(6),
    "atendido_por" INTEGER,

    CONSTRAINT "solicitudes_dueno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sucursal_etiquetas" (
    "id" SERIAL NOT NULL,
    "sucursal_id" INTEGER NOT NULL,
    "etiqueta_id" INTEGER NOT NULL,

    CONSTRAINT "sucursal_etiquetas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sucursal_imagenes" (
    "id" SERIAL NOT NULL,
    "sucursal_id" INTEGER NOT NULL,
    "imagen" VARCHAR(500) NOT NULL,
    "principal" BOOLEAN DEFAULT false,
    "orden" INTEGER DEFAULT 1,
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sucursal_imagenes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sucursal_servicios" (
    "id" SERIAL NOT NULL,
    "sucursal_id" INTEGER NOT NULL,
    "servicio_id" INTEGER NOT NULL,

    CONSTRAINT "sucursal_servicios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sucursal_tipos_interes" (
    "id" SERIAL NOT NULL,
    "sucursal_id" INTEGER NOT NULL,
    "tipo_interes_id" INTEGER NOT NULL,

    CONSTRAINT "sucursal_tipos_interes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sucursales" (
    "id" SERIAL NOT NULL,
    "empresa_id" INTEGER NOT NULL,
    "ciudad_id" INTEGER NOT NULL,
    "nombre" VARCHAR(200) NOT NULL,
    "descripcion" TEXT,
    "direccion" TEXT NOT NULL,
    "telefono" VARCHAR(30),
    "whatsapp" VARCHAR(30),
    "facebook" VARCHAR(250),
    "instagram" VARCHAR(250),
    "tiktok" VARCHAR(250),
    "sitio_web" VARCHAR(250),
    "imagen_principal" VARCHAR(500),
    "latitud" DECIMAL(10,8),
    "longitud" DECIMAL(11,8),
    "horario" TEXT,
    "calificacion" DECIMAL(3,2) DEFAULT 0,
    "total_resenas" INTEGER DEFAULT 0,
    "precio_ninos" DECIMAL(10,2),
    "precio_adultos" DECIMAL(10,2),
    "aforo_maximo" INTEGER,
    "gratuito" BOOLEAN DEFAULT false,
    "activo" BOOLEAN DEFAULT true,
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sucursales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservas_visita" (
    "id" SERIAL NOT NULL,
    "sucursal_id" INTEGER NOT NULL,
    "usuario_id" INTEGER,
    "fecha_visita" DATE NOT NULL,
    "hora_visita" TIME(6),
    "cantidad_adultos" INTEGER NOT NULL DEFAULT 0,
    "cantidad_ninos" INTEGER NOT NULL DEFAULT 0,
    "observaciones" TEXT,
    "estado" VARCHAR(30) DEFAULT 'pendiente',
    "cliente_nombre" TEXT,
    "cliente_telefono" TEXT,
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reservas_visita_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservas_compartidas" (
    "id" SERIAL NOT NULL,
    "reserva_id" INTEGER NOT NULL,
    "tipo_reserva" VARCHAR(20) NOT NULL,
    "compartido_por_usuario_id" INTEGER NOT NULL,
    "compartido_con_usuario_id" INTEGER NOT NULL,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    "fecha_creacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reservas_compartidas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suscripciones" (
    "id" SERIAL NOT NULL,
    "empresa_id" INTEGER,
    "cedula" VARCHAR(20),
    "plan_id" INTEGER NOT NULL,
    "fecha_inicio" DATE NOT NULL,
    "fecha_fin" DATE NOT NULL,
    "estado" VARCHAR(50) DEFAULT 'activa',

    CONSTRAINT "suscripciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipos_interes" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "activo" BOOLEAN DEFAULT true,

    CONSTRAINT "tipos_interes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokens_recuperacion" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "fecha_expiracion" TIMESTAMP(6) NOT NULL,
    "usado" BOOLEAN DEFAULT false,
    "ip_solicitud" VARCHAR(50),
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tokens_recuperacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokens_verificacion" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "fecha_expiracion" TIMESTAMP(6) NOT NULL,
    "usado" BOOLEAN DEFAULT false,
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tokens_verificacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario_roles" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "rol_id" INTEGER NOT NULL,

    CONSTRAINT "usuario_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "cedula" VARCHAR(10),
    "nombres" VARCHAR(150) NOT NULL,
    "apellidos" VARCHAR(150),
    "correo" VARCHAR(150) NOT NULL,
    "telefono" VARCHAR(30),
    "clave" VARCHAR(255) NOT NULL,
    "foto" VARCHAR(500),
    "fecha_nacimiento" DATE,
    "genero" VARCHAR(20),
    "rol" VARCHAR(30) NOT NULL DEFAULT 'cliente',
    "presupuesto_preferido" DECIMAL(10,2),
    "activo" BOOLEAN DEFAULT true,
    "correo_verificado" BOOLEAN DEFAULT false,
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "ultimo_acceso" TIMESTAMP(6),
    "rol_id" INTEGER,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planes_viaje" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "nombre" VARCHAR(200) NOT NULL,
    "tipo" VARCHAR(50),
    "cantidad_personas" INTEGER,
    "imagen" VARCHAR(500),
    "ciudad_id" INTEGER,
    "descripcion" TEXT,
    "publico" BOOLEAN DEFAULT false,
    "codigo" VARCHAR(20),
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "planes_viaje_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plan_viaje_sucursales" (
    "id" SERIAL NOT NULL,
    "plan_id" INTEGER NOT NULL,
    "sucursal_id" INTEGER NOT NULL,
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plan_viaje_sucursales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plan_viaje_amigos" (
    "id" SERIAL NOT NULL,
    "plan_id" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plan_viaje_amigos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plan_viaje_eventos" (
    "id" SERIAL NOT NULL,
    "plan_id" INTEGER NOT NULL,
    "evento_id" INTEGER NOT NULL,
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plan_viaje_eventos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visitas_sucursal" (
    "id" SERIAL NOT NULL,
    "sucursal_id" INTEGER NOT NULL,
    "usuario_id" INTEGER,
    "fecha_visita" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visitas_sucursal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cargos_empresa" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "activo" BOOLEAN DEFAULT true,

    CONSTRAINT "cargos_empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "empleado_permisos" (
    "id" SERIAL NOT NULL,
    "empleado_id" INTEGER NOT NULL,
    "permiso_id" INTEGER NOT NULL,

    CONSTRAINT "empleado_permisos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "empresa_empleados" (
    "id" SERIAL NOT NULL,
    "empresa_id" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "cargo_id" INTEGER NOT NULL,
    "activo" BOOLEAN DEFAULT true,
    "fecha_ingreso" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "empresa_empleados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "empleado_sucursales" (
    "id" SERIAL NOT NULL,
    "empleado_id" INTEGER NOT NULL,
    "sucursal_id" INTEGER NOT NULL,

    CONSTRAINT "empleado_sucursales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "empresa_imagenes" (
    "id" SERIAL NOT NULL,
    "empresa_id" INTEGER NOT NULL,
    "imagen" VARCHAR(500) NOT NULL,
    "principal" BOOLEAN DEFAULT false,

    CONSTRAINT "empresa_imagenes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permisos_empresa" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "permisos_empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "publicidad_ubicaciones" (
    "id" SERIAL NOT NULL,
    "publicidad_id" INTEGER NOT NULL,
    "ubicacion_id" INTEGER NOT NULL,

    CONSTRAINT "publicidad_ubicaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ubicaciones_publicidad" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "ubicaciones_publicidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario_empresas" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "empresa_id" INTEGER NOT NULL,
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_empresas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "canchas" (
    "id" SERIAL NOT NULL,
    "sucursal_id" INTEGER NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "capacidad" INTEGER DEFAULT 2,
    "precio_hora" DECIMAL(10,2) DEFAULT 0,
    "tipo" VARCHAR(50) DEFAULT 'general',
    "activa" BOOLEAN DEFAULT true,
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "canchas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservas_cancha" (
    "id" SERIAL NOT NULL,
    "cancha_id" INTEGER NOT NULL,
    "sucursal_id" INTEGER NOT NULL,
    "usuario_id" INTEGER,
    "fecha_reserva" DATE NOT NULL,
    "hora_inicio" TIME(6) NOT NULL,
    "hora_fin" TIME(6) NOT NULL,
    "duracion_horas" DECIMAL(3,1) DEFAULT 1,
    "cantidad_jugadores" INTEGER,
    "observaciones" TEXT,
    "cliente_nombre" TEXT,
    "cliente_telefono" TEXT,
    "cliente_correo" TEXT,
    "estado" VARCHAR(30) DEFAULT 'pendiente',
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reservas_cancha_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categorias_evento_nombre_key" ON "categorias_evento"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_negocio_nombre_key" ON "categorias_negocio"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "ciudades_slug_key" ON "ciudades"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "cartilla_config_sucursal_id_key" ON "cartilla_config"("sucursal_id");

-- CreateIndex
CREATE UNIQUE INDEX "evento_etiquetas_evento_id_etiqueta_id_key" ON "evento_etiquetas"("evento_id", "etiqueta_id");

-- CreateIndex
CREATE UNIQUE INDEX "mesas_qr_token_key" ON "mesas"("qr_token");

-- CreateIndex
CREATE UNIQUE INDEX "permisos_nombre_key" ON "permisos"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "provincias_nombre_key" ON "provincias"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "roles_nombre_key" ON "roles"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "reservas_compartidas_reserva_id_compartido_con_usuario_id_t_key" ON "reservas_compartidas"("reserva_id", "compartido_con_usuario_id", "tipo_reserva");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_recuperacion_token_key" ON "tokens_recuperacion"("token");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_verificacion_token_key" ON "tokens_verificacion"("token");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_cedula_key" ON "usuarios"("cedula");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_correo_key" ON "usuarios"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "planes_viaje_codigo_key" ON "planes_viaje"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "uq_plan_amigo" ON "plan_viaje_amigos"("plan_id", "usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_plan_evento" ON "plan_viaje_eventos"("plan_id", "evento_id");

-- CreateIndex
CREATE UNIQUE INDEX "empleado_sucursales_empleado_id_sucursal_id_key" ON "empleado_sucursales"("empleado_id", "sucursal_id");

-- AddForeignKey
ALTER TABLE "auditoria" ADD CONSTRAINT "auditoria_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ciudades" ADD CONSTRAINT "fk_ciudades_provincia" FOREIGN KEY ("provincia_id") REFERENCES "provincias"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cupones" ADD CONSTRAINT "cupones_sucursal_id_fkey" FOREIGN KEY ("sucursal_id") REFERENCES "sucursales"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cupones_usuario" ADD CONSTRAINT "cupones_usuario_cupon_id_fkey" FOREIGN KEY ("cupon_id") REFERENCES "cupones"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cupones_usuario" ADD CONSTRAINT "cupones_usuario_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cartilla_config" ADD CONSTRAINT "cartilla_config_sucursal_id_fkey" FOREIGN KEY ("sucursal_id") REFERENCES "sucursales"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cartilla_cliente" ADD CONSTRAINT "cartilla_cliente_config_id_fkey" FOREIGN KEY ("config_id") REFERENCES "cartilla_config"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cartilla_cliente" ADD CONSTRAINT "cartilla_cliente_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cartilla_sello" ADD CONSTRAINT "cartilla_sello_cartilla_id_fkey" FOREIGN KEY ("cartilla_id") REFERENCES "cartilla_cliente"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cartilla_sello" ADD CONSTRAINT "cartilla_sello_empleado_id_fkey" FOREIGN KEY ("empleado_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "disponibilidad_sucursal" ADD CONSTRAINT "disponibilidad_sucursal_sucursal_id_fkey" FOREIGN KEY ("sucursal_id") REFERENCES "sucursales"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "empresas" ADD CONSTRAINT "fk_empresa_categoria" FOREIGN KEY ("categoria_id") REFERENCES "categorias_negocio"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evento_imagenes" ADD CONSTRAINT "evento_imagenes_evento_id_fkey" FOREIGN KEY ("evento_id") REFERENCES "eventos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evento_etiquetas" ADD CONSTRAINT "evento_etiquetas_evento_id_fkey" FOREIGN KEY ("evento_id") REFERENCES "eventos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evento_etiquetas" ADD CONSTRAINT "evento_etiquetas_etiqueta_id_fkey" FOREIGN KEY ("etiqueta_id") REFERENCES "etiquetas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventos" ADD CONSTRAINT "fk_evento_categoria" FOREIGN KEY ("categoria_evento_id") REFERENCES "categorias_evento"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventos" ADD CONSTRAINT "fk_evento_ciudad" FOREIGN KEY ("ciudad_id") REFERENCES "ciudades"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "favoritos" ADD CONSTRAINT "fk_favorito_sucursal" FOREIGN KEY ("sucursal_id") REFERENCES "sucursales"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "favoritos" ADD CONSTRAINT "fk_favorito_usuario" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "habitacion_imagenes" ADD CONSTRAINT "habitacion_imagenes_habitacion_id_fkey" FOREIGN KEY ("habitacion_id") REFERENCES "habitaciones"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "habitaciones" ADD CONSTRAINT "habitaciones_sucursal_id_fkey" FOREIGN KEY ("sucursal_id") REFERENCES "sucursales"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "historial_busquedas" ADD CONSTRAINT "historial_busquedas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mesas" ADD CONSTRAINT "mesas_sucursal_id_fkey" FOREIGN KEY ("sucursal_id") REFERENCES "sucursales"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "fk_pago_empresa" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "fk_pago_suscripcion" FOREIGN KEY ("suscripcion_id") REFERENCES "suscripciones"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pedido_detalle" ADD CONSTRAINT "pedido_detalle_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pedido_detalle" ADD CONSTRAINT "pedido_detalle_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos_servicios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_sucursal_id_fkey" FOREIGN KEY ("sucursal_id") REFERENCES "sucursales"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_mesa_id_fkey" FOREIGN KEY ("mesa_id") REFERENCES "mesas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_reserva_id_fkey" FOREIGN KEY ("reserva_id") REFERENCES "reservas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "producto_etiquetas" ADD CONSTRAINT "producto_etiquetas_etiqueta_id_fkey" FOREIGN KEY ("etiqueta_id") REFERENCES "etiquetas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "producto_etiquetas" ADD CONSTRAINT "producto_etiquetas_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos_servicios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "producto_imagenes" ADD CONSTRAINT "fk_imagen_producto" FOREIGN KEY ("producto_id") REFERENCES "productos_servicios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "productos_servicios" ADD CONSTRAINT "fk_producto_categoria" FOREIGN KEY ("categoria_producto_id") REFERENCES "categorias_producto"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "productos_servicios" ADD CONSTRAINT "fk_producto_sucursal" FOREIGN KEY ("sucursal_id") REFERENCES "sucursales"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "publicidades" ADD CONSTRAINT "publicidades_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "recomendaciones" ADD CONSTRAINT "recomendaciones_solicitud_id_fkey" FOREIGN KEY ("solicitud_id") REFERENCES "solicitudes_recomendacion"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "recomendaciones" ADD CONSTRAINT "recomendaciones_sucursal_id_fkey" FOREIGN KEY ("sucursal_id") REFERENCES "sucursales"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "resenas" ADD CONSTRAINT "fk_resena_sucursal" FOREIGN KEY ("sucursal_id") REFERENCES "sucursales"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "resenas" ADD CONSTRAINT "fk_resena_usuario" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_sucursal_id_fkey" FOREIGN KEY ("sucursal_id") REFERENCES "sucursales"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_mesa_id_fkey" FOREIGN KEY ("mesa_id") REFERENCES "mesas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reservas_habitacion" ADD CONSTRAINT "reservas_habitacion_habitacion_id_fkey" FOREIGN KEY ("habitacion_id") REFERENCES "habitaciones"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reservas_habitacion" ADD CONSTRAINT "reservas_habitacion_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "rol_permisos" ADD CONSTRAINT "fk_rol_permiso_permiso" FOREIGN KEY ("permiso_id") REFERENCES "permisos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "rol_permisos" ADD CONSTRAINT "fk_rol_permiso_rol" FOREIGN KEY ("rol_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "solicitud_intereses" ADD CONSTRAINT "solicitud_intereses_solicitud_id_fkey" FOREIGN KEY ("solicitud_id") REFERENCES "solicitudes_recomendacion"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "solicitud_intereses" ADD CONSTRAINT "solicitud_intereses_tipo_interes_id_fkey" FOREIGN KEY ("tipo_interes_id") REFERENCES "tipos_interes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "solicitudes_recomendacion" ADD CONSTRAINT "solicitudes_recomendacion_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "solicitudes_dueno" ADD CONSTRAINT "solicitudes_dueno_atendido_por_fkey" FOREIGN KEY ("atendido_por") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "solicitudes_dueno" ADD CONSTRAINT "solicitudes_dueno_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sucursal_etiquetas" ADD CONSTRAINT "sucursal_etiquetas_etiqueta_id_fkey" FOREIGN KEY ("etiqueta_id") REFERENCES "etiquetas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sucursal_etiquetas" ADD CONSTRAINT "sucursal_etiquetas_sucursal_id_fkey" FOREIGN KEY ("sucursal_id") REFERENCES "sucursales"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sucursal_imagenes" ADD CONSTRAINT "fk_imagen_sucursal" FOREIGN KEY ("sucursal_id") REFERENCES "sucursales"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sucursal_servicios" ADD CONSTRAINT "sucursal_servicios_servicio_id_fkey" FOREIGN KEY ("servicio_id") REFERENCES "servicios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sucursal_servicios" ADD CONSTRAINT "sucursal_servicios_sucursal_id_fkey" FOREIGN KEY ("sucursal_id") REFERENCES "sucursales"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sucursal_tipos_interes" ADD CONSTRAINT "sucursal_tipos_interes_sucursal_id_fkey" FOREIGN KEY ("sucursal_id") REFERENCES "sucursales"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sucursal_tipos_interes" ADD CONSTRAINT "sucursal_tipos_interes_tipo_interes_id_fkey" FOREIGN KEY ("tipo_interes_id") REFERENCES "tipos_interes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sucursales" ADD CONSTRAINT "fk_sucursal_ciudad" FOREIGN KEY ("ciudad_id") REFERENCES "ciudades"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sucursales" ADD CONSTRAINT "fk_sucursal_empresa" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reservas_visita" ADD CONSTRAINT "reservas_visita_sucursal_id_fkey" FOREIGN KEY ("sucursal_id") REFERENCES "sucursales"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reservas_visita" ADD CONSTRAINT "reservas_visita_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reservas_compartidas" ADD CONSTRAINT "reservas_compartidas_compartido_por_usuario_id_fkey" FOREIGN KEY ("compartido_por_usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reservas_compartidas" ADD CONSTRAINT "reservas_compartidas_compartido_con_usuario_id_fkey" FOREIGN KEY ("compartido_con_usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "suscripciones" ADD CONSTRAINT "suscripciones_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "suscripciones" ADD CONSTRAINT "suscripciones_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "planes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tokens_recuperacion" ADD CONSTRAINT "fk_token_usuario" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tokens_verificacion" ADD CONSTRAINT "fk_verificacion_usuario" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuario_roles" ADD CONSTRAINT "fk_usuario_rol_rol" FOREIGN KEY ("rol_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuario_roles" ADD CONSTRAINT "fk_usuario_rol_usuario" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "fk_usuario_rol" FOREIGN KEY ("rol_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "planes_viaje" ADD CONSTRAINT "fk_plan_viaje_usuario" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "planes_viaje" ADD CONSTRAINT "fk_plan_viaje_ciudad" FOREIGN KEY ("ciudad_id") REFERENCES "ciudades"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "plan_viaje_sucursales" ADD CONSTRAINT "fk_plan_viaje_sucursal_plan" FOREIGN KEY ("plan_id") REFERENCES "planes_viaje"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "plan_viaje_sucursales" ADD CONSTRAINT "fk_plan_viaje_sucursal_sucursal" FOREIGN KEY ("sucursal_id") REFERENCES "sucursales"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "plan_viaje_amigos" ADD CONSTRAINT "fk_plan_amigo_plan" FOREIGN KEY ("plan_id") REFERENCES "planes_viaje"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "plan_viaje_amigos" ADD CONSTRAINT "fk_plan_amigo_usuario" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "plan_viaje_eventos" ADD CONSTRAINT "fk_plan_evento_plan" FOREIGN KEY ("plan_id") REFERENCES "planes_viaje"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "plan_viaje_eventos" ADD CONSTRAINT "fk_plan_evento_evento" FOREIGN KEY ("evento_id") REFERENCES "eventos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "visitas_sucursal" ADD CONSTRAINT "visitas_sucursal_sucursal_id_fkey" FOREIGN KEY ("sucursal_id") REFERENCES "sucursales"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "visitas_sucursal" ADD CONSTRAINT "visitas_sucursal_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "empleado_permisos" ADD CONSTRAINT "empleado_permisos_empleado_id_fkey" FOREIGN KEY ("empleado_id") REFERENCES "empresa_empleados"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "empleado_permisos" ADD CONSTRAINT "empleado_permisos_permiso_id_fkey" FOREIGN KEY ("permiso_id") REFERENCES "permisos_empresa"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "empresa_empleados" ADD CONSTRAINT "fk_empleado_cargo" FOREIGN KEY ("cargo_id") REFERENCES "cargos_empresa"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "empresa_empleados" ADD CONSTRAINT "fk_empleado_empresa" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "empresa_empleados" ADD CONSTRAINT "fk_empleado_usuario" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "empleado_sucursales" ADD CONSTRAINT "fk_emp_suc_empleado" FOREIGN KEY ("empleado_id") REFERENCES "empresa_empleados"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "empleado_sucursales" ADD CONSTRAINT "fk_emp_suc_sucursal" FOREIGN KEY ("sucursal_id") REFERENCES "sucursales"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "publicidad_ubicaciones" ADD CONSTRAINT "fk_pub_ubicacion_publicidad" FOREIGN KEY ("publicidad_id") REFERENCES "publicidades"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "publicidad_ubicaciones" ADD CONSTRAINT "fk_pub_ubicacion_ubicacion" FOREIGN KEY ("ubicacion_id") REFERENCES "ubicaciones_publicidad"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuario_empresas" ADD CONSTRAINT "fk_usuario_empresa_empresa" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuario_empresas" ADD CONSTRAINT "fk_usuario_empresa_usuario" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "canchas" ADD CONSTRAINT "canchas_sucursal_id_fkey" FOREIGN KEY ("sucursal_id") REFERENCES "sucursales"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reservas_cancha" ADD CONSTRAINT "reservas_cancha_cancha_id_fkey" FOREIGN KEY ("cancha_id") REFERENCES "canchas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reservas_cancha" ADD CONSTRAINT "reservas_cancha_sucursal_id_fkey" FOREIGN KEY ("sucursal_id") REFERENCES "sucursales"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reservas_cancha" ADD CONSTRAINT "reservas_cancha_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
