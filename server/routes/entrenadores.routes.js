import { Router } from 'express';
import { supabase } from '../supabase.js';

const router = Router();

router.post('/contratar', async (req, res) => {
    const { id_usuario, plan } = req.body;

    try {
        // 1. Obtener lista de entrenadores
        const { data: entrenadores, error: errorBusqueda } = await supabase
            .from('entrenadores')
            .select('*');

        if (errorBusqueda) throw errorBusqueda;
        
        if (!entrenadores || entrenadores.length === 0) {
            return res.status(404).json({ error: "No hay entrenadores en la base de datos." });
        }

        // 2. Elegir uno al azar
        const random = Math.floor(Math.random() * entrenadores.length);
        const entrenadorSeleccionado = entrenadores[random];

        // 3. Guardar la relación en el usuario (guardamos el ID y los datos actuales)
        // NOTA: Guardamos 'entrenador_data' como respaldo JSON para acceso rápido
        const { error: errorUpdate } = await supabase.from('usuarios').update({
            entrenador_activo: true,
            entrenador_plan: plan,
            id_entrenador: entrenadorSeleccionado.id,
            entrenador_data: entrenadorSeleccionado 
        }).eq('id_usuario', id_usuario);

        if (errorUpdate) throw errorUpdate;

        console.log("Entrenador asignado:", entrenadorSeleccionado.nombre);

        // 4. ENVIAR DATOS AL FRONTEND (Esta es la parte clave)
        res.json({ 
            success: true, 
            entrenador: entrenadorSeleccionado // <--- El modal necesita ESTE objeto
        });

    } catch (error) {
        console.error("Error backend:", error);
        res.status(500).json({ error: error.message });
    }
});

export default router;