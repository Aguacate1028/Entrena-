// server/index.js
const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db"); // Importa la configuración de la DB

// Middleware
app.use(cors());
app.use(express.json()); // Permite acceder al cuerpo de la petición (req.body)

const port = 5000;

// **********************************
// RUTAS (ROUTES)
// **********************************

// 1. CREAR una Tarea (POST)
app.post("/todos", async (req, res) => {
    try {
        const { description } = req.body;
        const newTodo = await pool.query(
        "INSERT INTO todo (description) VALUES($1) RETURNING *",
        [description] // $1 hace referencia al primer elemento en el array [description]
        );

        res.json(newTodo.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// 2. OBTENER todas las Tareas (GET)
app.get("/todos", async (req, res) => {
    try {
        const allTodos = await pool.query("SELECT * FROM todo ORDER BY todo_id ASC");
        res.json(allTodos.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// 3. ELIMINAR una Tarea (DELETE)
app.delete("/todos/:id", async (req, res) => {
    try {
        // 1. Extraer el ID de la URL. Usamos req.params
        const { id } = req.params;

        // 2. Consulta SQL para eliminar la fila con ese ID
        const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [
            id,
        ]);

        // 3. Respuesta al cliente
        res.json("La tarea ha sido eliminada con éxito.");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error al eliminar");
    }
});

// **********************************
// INICIO DEL SERVIDOR
// **********************************

app.listen(port, () => {
    console.log(`Server corriendo en http://localhost:${port}`);
});