import { Router } from 'express';
import { supabase } from '../supabase.js';

const router = Router();

// --- IMC & HISTORIAL ---
router.post('/historial', async (req, res) => {
    const { id_usuario, peso, imc } = req.body;
    try {
        // 1. Guardar en historial
        const { error } = await supabase.from('historial_fisico').insert([{ id_usuario, peso, imc }]);
        if (error) throw error;
        // 2. Actualizar perfil actual
        await supabase.from('usuarios').update({ peso, altura: req.body.altura }).eq('id_usuario', id_usuario);
        res.json({ message: "Registrado" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/historial/:id', async (req, res) => {
    const { data } = await supabase.from('historial_fisico').select('*').eq('id_usuario', req.params.id).order('fecha', { ascending: false });
    res.json(data);
});

// --- RUTINAS ---
router.get('/rutinas/:id', async (req, res) => {
    const { data } = await supabase.from('rutinas').select('*').eq('id_usuario', req.params.id);
    res.json(data);
});

router.post('/rutinas', async (req, res) => {
    const { id_usuario, dia_semana, nombre_rutina, ejercicios, nivel } = req.body;
    const { data, error } = await supabase.from('rutinas').insert([{ id_usuario, dia_semana, nombre_rutina, ejercicios, nivel }]).select();
    if (error) return res.status(400).json({ error: error.message });
    res.json(data[0]);
});

router.delete('/rutinas/:id', async (req, res) => {
    await supabase.from('rutinas').delete().eq('id', req.params.id);
    res.json({ message: "Eliminado" });
});

// --- COMIDAS ---
router.get('/comidas/:id', async (req, res) => {
    // Obtener comidas de HOY
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase.from('comidas')
        .select('*')
        .eq('id_usuario', req.params.id)
        .eq('fecha', today);
    res.json(data);
});

router.post('/comidas', async (req, res) => {
    const { id_usuario, nombre_comida, calorias, proteinas } = req.body;
    const { data, error } = await supabase.from('comidas').insert([{ id_usuario, nombre_comida, calorias, proteinas }]).select();
    if (error) return res.status(400).json({ error: error.message });
    res.json(data[0]);
});

export default router;