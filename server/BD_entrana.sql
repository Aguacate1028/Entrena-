-- =============================================================
-- SCRIPT DE CREACIÓN DE BASE DE DATOS: ENTRENA+
-- Proyecto: Sistema de Gestión para Gimnasios Locales
-- =============================================================

-- 1. Tabla de Usuarios (Centraliza Dueño, Admin, Staff y Clientes)
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('dueño', 'admin', 'staff', 'cliente')),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Membresías (Catálogo de Planes)
CREATE TABLE IF NOT EXISTS membresias (
    id_membresia SERIAL PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL, -- Ej: Mensual, Anual, Estudiante
    precio DECIMAL(10,2) NOT NULL,
    duracion_dias INTEGER NOT NULL,
    descripcion TEXT
);

-- 3. Tabla de Suscripciones (Vinculación Usuario-Membresía)
CREATE TABLE IF NOT EXISTS suscripciones (
    id_suscripcion SERIAL PRIMARY KEY,
    id_usuario INTEGER REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    id_membresia INTEGER REFERENCES membresias(id_membresia),
    fecha_inicio DATE NOT NULL DEFAULT CURRENT_DATE,
    fecha_vencimiento DATE NOT NULL,
    estatus VARCHAR(20) DEFAULT 'activa' CHECK (estatus IN ('activa', 'vencida', 'cancelada', 'pendiente'))
);

-- 4. Tabla de Pagos (Registro financiero para visibilidad del Dueño)
CREATE TABLE IF NOT EXISTS pagos (
    id_pago SERIAL PRIMARY KEY,
    id_suscripcion INTEGER REFERENCES suscripciones(id_suscripcion) ON DELETE SET NULL,
    monto DECIMAL(10,2) NOT NULL,
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metodo_pago VARCHAR(30) CHECK (metodo_pago IN ('efectivo', 'transferencia', 'tarjeta')),
    comprobante_url TEXT -- Almacena link a la imagen del ticket o transferencia
);

-- 5. Tabla de Asistencia (Sustituye la libreta física de registro)
CREATE TABLE IF NOT EXISTS asistencia (
    id_asistencia SERIAL PRIMARY KEY,
    id_usuario INTEGER REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    hora_entrada TIME NOT NULL DEFAULT CURRENT_TIME,
    hora_salida TIME
);

-- 6. Tabla de Inventario de Equipos
CREATE TABLE IF NOT EXISTS equipos (
    id_equipo SERIAL PRIMARY KEY,
    nombre_maquina VARCHAR(100) NOT NULL,
    descripcion TEXT,
    estado VARCHAR(30) DEFAULT 'operativo' CHECK (estado IN ('operativo', 'mantenimiento', 'fuera_servicio')),
    ultima_revision TIMESTAMP
);

-- 7. Tabla de Reportes de Fallas (Mejora la comunicación Cliente-Staff)
CREATE TABLE IF NOT EXISTS reportes_fallas (
    id_reporte SERIAL PRIMARY KEY,
    id_usuario INTEGER REFERENCES usuarios(id_usuario), -- Quién reporta
    id_equipo INTEGER REFERENCES equipos(id_equipo),
    descripcion_problema TEXT NOT NULL,
    fecha_reporte TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estatus_reparacion VARCHAR(20) DEFAULT 'pendiente' CHECK (estatus_reparacion IN ('pendiente', 'en_proceso', 'resuelto'))
);

-- 8. Tabla de Casilleros (Gestión de Pertenencias)
CREATE TABLE IF NOT EXISTS casilleros (
    id_casillero SERIAL PRIMARY KEY,
    numero_locker VARCHAR(10) UNIQUE NOT NULL,
    estado VARCHAR(20) DEFAULT 'disponible' CHECK (estado IN ('disponible', 'ocupado', 'mantenimiento'))
);

-- 9. Tabla de Asignación de Casilleros (Control de uso)
CREATE TABLE IF NOT EXISTS asignacion_casilleros (
    id_asignacion SERIAL PRIMARY KEY,
    id_usuario INTEGER REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    id_casillero INTEGER REFERENCES casilleros(id_casillero) ON DELETE CASCADE,
    hora_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    hora_fin TIMESTAMP
);

-- =============================================================
-- COMENTARIOS DE IMPLEMENTACIÓN:
-- 1. Se incluyeron restricciones (CHECK) para asegurar la integridad de los datos.
-- 2. Se agregaron las tablas de Casilleros y Equipos para resolver las frustraciones 
--    identificadas en el Mapa de Empatía.
-- 3. La tabla de Pagos permite al Dueño generar reportes de ganancias mensuales.
-- =============================================================