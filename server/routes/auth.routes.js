import { Router } from 'express';
import bcrypt from 'bcrypt';
import { supabase } from '../supabase.js'; 

const router = Router();

// RUTA DE REGISTRO
router.post('/register', async (req, res) => {
    try {
        const { nombre, email, password, fecha_nacimiento, rol } = req.body;
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const { data, error } = await supabase
            .from('usuarios') 
            .insert([{ 
                nombre, email, password_hash: passwordHash, fecha_nacimiento, rol 
            }])
            .select(); 

        if (error) {
            if (error.code === '23505') { 
                return res.status(400).json({ error: "El correo electrónico ya está registrado." });
            }
            throw error;
        }

        res.json({ success: true, message: "Usuario registrado con éxito", user: data[0] });
    } catch (err) {
        console.error("Error registro:", err.message);
        res.status(500).json({ error: "Error en el servidor al registrar" });
    }
});

// RUTA DE LOGIN
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const { data: users, error } = await supabase
            .from('usuarios').select('*').eq('email', email);

        if (error) throw error;
        if (!users || users.length === 0) return res.status(401).json({ error: "Correo no registrado" });

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);

        if (!validPassword) return res.status(401).json({ error: "Contraseña incorrecta" });

        res.json({
            success: true,
            user: { id: user.id_usuario, nombre: user.nombre, rol: user.rol }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Error en el servidor al iniciar sesión" });
    }
});

export default router;