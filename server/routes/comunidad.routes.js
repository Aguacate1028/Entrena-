import { Router } from 'express';
import { supabase } from '../supabase.js';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// --- FUNCIÓN AUXILIAR PARA NOTIFICAR ---
const crearNotificacion = async (idDestino, titulo, mensaje) => {
    try {
        if (!idDestino) return;
        await supabase.from('notificaciones').insert([{
            id_usuario: idDestino,
            titulo: titulo,
            mensaje: mensaje,
            leida: false
        }]);
    } catch (error) {
        console.error("Error creando notificación interna:", error);
    }
};

// 1. OBTENER FEED
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('publicaciones')
            .select(`
                *,
                usuarios ( nombre, foto_perfil ),
                comentarios (
                    id, texto, fecha,
                    usuarios ( nombre, foto_perfil )
                )
            `)
            .order('fecha', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. CREAR PUBLICACIÓN
router.post('/', upload.single('imagen'), async (req, res) => {
    const { id_usuario, texto } = req.body;
    const file = req.file;
    let imagenUrl = null;

    try {
        if (file) {
            const fileName = `post_${Date.now()}_${id_usuario}`;
            const { error: uploadError } = await supabase.storage
                .from('posts')
                .upload(fileName, file.buffer, { contentType: file.mimetype });
            
            if (uploadError) throw uploadError;
            const { data } = supabase.storage.from('posts').getPublicUrl(fileName);
            imagenUrl = data.publicUrl;
        }

        const { data, error } = await supabase
            .from('publicaciones')
            .insert([{ id_usuario, texto, imagen: imagenUrl }])
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. DAR LIKE (CON NOTIFICACIÓN)
router.put('/:id/like', async (req, res) => {
    const { id } = req.params; // ID del Post
    
    try {
        // A) Obtener datos del post para saber quién es el dueño
        const { data: post } = await supabase
            .from('publicaciones')
            .select('id_usuario, likes')
            .eq('id', id)
            .single();

        if (!post) return res.status(404).json({ error: "Post no encontrado" });

        // B) Incrementar Likes
        const nuevosLikes = (post.likes || 0) + 1;
        const { error } = await supabase
            .from('publicaciones')
            .update({ likes: nuevosLikes })
            .eq('id', id);

        if (error) throw error;

        // C) CREAR NOTIFICACIÓN (Si el dueño no soy yo mismo - Opcional validar ID)
        // Como el endpoint de like es simple, enviamos un mensaje genérico.
        await crearNotificacion(
            post.id_usuario, 
            "Nuevo Like ❤️", 
            "A alguien le gustó tu publicación."
        );

        res.json({ likes: nuevosLikes });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. COMENTAR (CON NOTIFICACIÓN)
router.post('/:id/comentar', async (req, res) => {
    const { id } = req.params; // ID Publicación
    const { id_usuario, texto } = req.body; // ID Autor del comentario

    try {
        // A) Guardar comentario
        const { data, error } = await supabase
            .from('comentarios')
            .insert([{ id_publicacion: id, id_usuario, texto }])
            .select()
            .single();

        if (error) throw error;

        // B) Obtener datos para la notificación
        // 1. Quién es el dueño del post?
        const { data: post } = await supabase
            .from('publicaciones')
            .select('id_usuario')
            .eq('id', id)
            .single();
        
        // 2. Cómo se llama quien comentó?
        const { data: autorComentario } = await supabase
            .from('usuarios')
            .select('nombre')
            .eq('id_usuario', id_usuario)
            .single();

        // C) Enviar notificación al dueño del post
        // (Solo si el que comenta no es el mismo dueño)
        if (post && post.id_usuario !== id_usuario) {
            await crearNotificacion(
                post.id_usuario,
                "Nuevo Comentario 💬",
                `${autorComentario?.nombre || 'Alguien'} comentó: "${texto.substring(0, 20)}..."`
            );
        }

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. ELIMINAR POST
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const { id_usuario } = req.body;

    try {
        const { error } = await supabase
            .from('publicaciones')
            .delete()
            .eq('id', id)
            .eq('id_usuario', id_usuario);

        if (error) throw error;
        res.json({ success: true, message: "Publicación eliminada" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;