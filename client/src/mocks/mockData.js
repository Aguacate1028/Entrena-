export const MOCK_USER_administrador = {
    id: 'A001',
    nombre: 'Marisol Rodríguez',
    rol: 'administrador',
    email: 'administrador@entrena.com',
};

export const MOCK_USER_SOCIO = {
    id: 'S105',
    nombre: 'Dylan Pérez',
    rol: 'Socio',
    email: 'dylan@mail.com',
};

// --- MOCK DE GESTIÓN DE SOCIOS ---
export const MOCK_SOCIOS_LIST = [
    { id: '1001', nombre: 'Francisco Gutiérrez', email: 'f.gutierrez@ipn.mx', tel: '5512345678', vencimiento: '2026-01-15', estado: 'Activa' },
    { id: '1002', nombre: 'Paloma Herrera', email: 'p.herrera@ipn.mx', tel: '5587654321', vencimiento: '2025-12-08', estado: 'Vencida' },
    { id: '1003', nombre: 'Marcos López', email: 'm.lopez@ipn.mx', tel: '5599887766', vencimiento: '2026-03-20', estado: 'Activa' },
    { id: '1004', nombre: 'Dylan Pérez', email: 'd.perez@ipn.mx', tel: '5511223344', vencimiento: '2026-02-01', estado: 'Activa' },
];

// --- MOCK DASHBOARD administrador ---
export const MOCK_administrador_STATS = [
    { title: 'Socios Activos', value: '452', icon: '💪', color: 'border-green-500', bgColor: 'bg-green-100' },
    { title: 'Membresías Vencidas', value: '18', icon: '🛑', color: 'border-red-500', bgColor: 'bg-red-100' },
    { title: 'Ingreso Estimado (Mes)', value: '$125,000 MXN', icon: '💸', color: 'border-blue-500', bgColor: 'bg-blue-100' },
    { title: 'Equipos Reportados', value: '3', icon: '🛠️', color: 'border-yellow-500', bgColor: 'bg-yellow-100' },
];

// --- MOCK DASHBOARD SOCIO (Datos de ejemplo para la vista de cliente) ---
export const MOCK_SOCIO_DATA = {
    membresia: { tipo: 'Trimestral', vence: '2026-03-15', estado: 'Activa' },
    progreso: { peso: '75 kg', imc: '24.5', grasa: '18%' },
    aforo: { actual: 85, maximo: 120, trend: 'Alto' },
    locker: 'L-203 (Vence 2026-01-01)'
};