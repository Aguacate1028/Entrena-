import express from 'express';
import cors from 'cors';
import { testConnection } from './supabase.js';
import authRoutes from './routes/auth.routes.js';
import anunciosRoutes from './routes/anuncios.routes.js';
import adminRoutes from './routes/admin.routes.js';
import landingRoutes from './routes/landing.routes.js';
import clasesRoutes from './routes/clases.routes.js'; 
import membresiasRoutes from './routes/membresias.routes.js';
import notificacionesRoutes from './routes/notificaciones.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';
import asistenciasRoutes from './routes/asistencias.routes.js';
import progresoRoutes from './routes/progreso.routes.js';
import guiaRoutes from './routes/guia.routes.js';
import entrenadoresRoutes from './routes/entrenadores.routes.js';
import lockersRoutes from './routes/lockers.routes.js';
import { iniciarScheduler } from './services/scheduler.js';
import comunidadRoutes from './routes/comunidad.routes.js';
import reportesRoutes from './routes/reportes.routes.js';



const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Probar conexión BD
testConnection();
// 1. Auth (Login/Register) -> Prefijo '/api'
// Resultado: /api/login, /api/register
app.use('/api', authRoutes);
app.use('/api/anuncios', anunciosRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', landingRoutes);
app.use('/api/clases', clasesRoutes); 
app.use('/api/membresias', membresiasRoutes);
app.use('/api/notificaciones', notificacionesRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/asistencias',asistenciasRoutes);
app.use('/api/progreso', progresoRoutes);
app.use('/api/guia', guiaRoutes); 
app.use('/api/entrenadores', entrenadoresRoutes);
app.use('/api/lockers', lockersRoutes);
app.use('/api/comunidad', comunidadRoutes);
app.use('/api/reportes', reportesRoutes);



iniciarScheduler();
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

