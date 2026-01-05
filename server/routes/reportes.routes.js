import { Router } from 'express';
import { supabase } from '../supabase.js'; 

const router = Router();

// 1. CREAR REPORTE (Usuario)
router.post('/', async (req, res) => {
    const { id_usuario, categoria, descripcion } = req.body;
    try {
        const { data, error } = await supabase
            .from('reportes')
            .insert([{ id_usuario, categoria, descripcion }]) 
            .select();

        if (error) throw error;
        res.status(201).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. OBTENER TODOS (Staff)
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('reportes')
            .select('*')
            .order('fecha_creacion', { ascending: false }); 

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. RESPONDER (Staff)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { respuesta_admin } = req.body; 

    try {
        const { data, error } = await supabase
            .from('reportes')
            .update({ 
                estado: 'Resuelto',   
                respuesta_admin: respuesta_admin 
            })
            .eq('id', id)
            .select();

        if (error) throw error;

        // Crear notificación para el usuario
        if(data && data.length > 0) {
            await supabase.from('notificaciones').insert({
                id_usuario: data[0].id_usuario,
                titulo: 'Reporte Resuelto',
                mensaje: `El staff ha respondido a tu reporte de ${data[0].categoria}.`,
                tipo: 'success',
                leido: false
            });
        }

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. ELIMINAR (Staff)
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { error } = await supabase
            .from('reportes')
            .delete()
            .eq('id', id);

        if (error) throw error;
        res.json({ message: "Reporte eliminado" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. OBTENER MIS REPORTES (Usuario)
// Esta ruta es indispensable para que funcione el historial en Reportes.jsx
router.get('/usuario/:idUsuario', async (req, res) => {
    const { idUsuario } = req.params;
    try {
        const { data, error } = await supabase
            .from('reportes')
            .select('*')
            .eq('id_usuario', idUsuario)
            .order('fecha_creacion', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;