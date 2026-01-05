import { Router } from 'express';
import { supabase } from '../supabase.js';

const router = Router();

// 1. OBTENER ANUNCIOS ]
router.get('/', async (req, res) => { 
    try {
        const { data, error } = await supabase
            .from('anuncios')
            .select('*')
            .eq('activo', true)
            .order('fecha', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error("Error anuncios:", err.message);
        res.status(500).json({ error: "Error al cargar anuncios" });
    }
});

// 2. CREAR NUEVO ANUNCIO
router.post('/', async (req, res) => {
    const { titulo, contenido, tipo } = req.body;

    try {
        const { data, error } = await supabase
            .from('anuncios')
            .insert([
                { 
                    titulo, 
                    contenido, 
                    tipo,
                    fecha: new Date(), // Agregamos la fecha actual automáticamente
                    activo: true       // Lo marcamos como activo por defecto
                }
            ])
            .select(); // .select() es importante para que devuelva el objeto creado

        if (error) throw error;
        
        res.status(201).json(data[0]); // Devolvemos el anuncio creado
    } catch (err) {
        console.error("Error creando anuncio:", err.message);
        res.status(500).json({ message: "Error al guardar el anuncio en la base de datos" });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { error } = await supabase
            .from('anuncios')
            .delete()
            .eq('id', id); // Asegúrate de que tu columna en BD se llame 'id' o 'id_anuncio'

        if (error) throw error;
        
        res.json({ message: "Anuncio eliminado correctamente" });
    } catch (err) {
        console.error("Error eliminando:", err.message);
        res.status(500).json({ error: "No se pudo eliminar el anuncio" });
    }
});

export default router;