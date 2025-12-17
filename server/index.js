const express = require('express');
const cors = require('cors'); // Necesitas instalarlo: npm install cors
const pool = require('./db');
const bcrypt = require('bcrypt');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// RUTA DE REGISTRO
app.post('/api/register', async (req, res) => {
    try {
        const { nombre, email, password, fecha_nacimiento, rol } = req.body;

        // 1. Encriptar contraseña
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // 2. Insertar en la base de datos
        const newUser = await pool.query(
            "INSERT INTO usuarios (nombre, email, password_hash, fecha_nacimiento, rol) VALUES ($1, $2, $3, $4, $5) RETURNING id_usuario, nombre, rol",
            [nombre, email, passwordHash, fecha_nacimiento, rol]
        );

        res.json({
            success: true,
            message: "Usuario registrado con éxito",
            user: newUser.rows[0]
        });

    } catch (err) {
        console.error(err.message);
        if (err.code === '23505') {
            return res.status(400).json({ error: "El correo electrónico ya está registrado." });
        }
        res.status(500).json({ error: "Error en el servidor al registrar" });
    }
});

// RUTA DE LOGIN
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userResult = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
    
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: "El correo no está registrado" });
    }

    const user = userResult.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

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