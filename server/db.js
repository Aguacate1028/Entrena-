// server/db.js
const Pool = require("pg").Pool;

const pool = new Pool({
    user: "admin",         // El usuario que creaste
    host: "localhost",
    database: "EntrenaPlus",   // La DB que creaste en el paso anterior
    password: "12345",     // La contraseña que estableciste
    port: 5432,
});

module.exports = pool;