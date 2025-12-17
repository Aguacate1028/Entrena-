import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { supabase, testConnection } from './db.js'; // Importamos la instancia de supabase

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Probar conexión al iniciar
testConnection();

// --- RUTA DE REGISTRO ---
app.post('/api/register', async (req, res) => {
    try {
        const { nombre, email, password, fecha_nacimiento, rol } = req.body;

        // Encriptar contraseña
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Insertar en Supabase
        const { data, error } = await supabase
            .from('usuarios') 
            .insert([
                { 
                    nombre: nombre, 
                    email: email, 
                    password_hash: passwordHash, 
                    fecha_nacimiento: fecha_nacimiento, 
                    rol: rol 
                }
            ])
            .select(); 

        // Manejo de errores de Supabase
        if (error) {
            console.error("Error Supabase:", error);
            // El código 23505 es violación de unicidad 
            if (error.code === '23505') { 
                return res.status(400).json({ error: "El correo electrónico ya está registrado." });
            }
            throw error;
        }

        res.json({
            success: true,
            message: "Usuario registrado con éxito",
            user: data[0]
        });

    } catch (err) {
        console.error("Error interno:", err.message);
        res.status(500).json({ error: "Error en el servidor al registrar" });
    }
});

// --- RUTA DE LOGIN ---
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar usuario en Supabase
        const { data: users, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('email', email);

        if (error) throw error;

        // Si el arreglo está vacío, no existe el usuario
        if (!users || users.length === 0) {
            return res.status(401).json({ error: "El correo no está registrado" });
        }

        const user = users[0];

        // Comparar contraseña con bcrypt
        const validPassword = await bcrypt.compare(password, user.password_hash);

        if (!validPassword) {
            return res.status(401).json({ error: "Contraseña incorrecta" });
        }

        // Responder éxito
        res.json({
            success: true,
            user: {
                id: user.id_usuario,
                nombre: user.nombre,
                rol: user.rol
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Error en el servidor al iniciar sesión" });
    }
});

app.listen(5000, () => {
    console.log("Servidor escuchando en el puerto 5000");
});