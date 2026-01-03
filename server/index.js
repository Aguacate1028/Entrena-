import express from 'express';
import cors from 'cors';
import { testConnection } from './supabase.js';
import authRoutes from './routes/auth.routes.js';
import anunciosRoutes from './routes/anuncios.routes.js';
import adminRoutes from './routes/admin.routes.js';
import landingRoutes from './routes/landing.routes.js';
import clasesRoutes from './routes/clases.routes.js'; 
import membresiasRoutes from './routes/membresias.routes.js';

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

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

