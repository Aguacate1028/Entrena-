const API_URL = 'http://localhost:5000/api/progreso';

export const obtenerHistorialIMCRequest = async (id) => {
    try {
        const res = await fetch(`${API_URL}/historial/${id}`);
        return await res.json();
    } catch (error) { return []; }
};

export const registrarIMCRequest = async (data) => {
    await fetch(`${API_URL}/historial`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
};

export const obtenerRutinasRequest = async (id) => {
    try {
        const res = await fetch(`${API_URL}/rutinas/${id}`);
        return await res.json();
    } catch (error) { return []; }
};

export const crearRutinaRequest = async (data) => {
    await fetch(`${API_URL}/rutinas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
};

export const eliminarRutinaRequest = async (id) => {
    await fetch(`${API_URL}/rutinas/${id}`, { method: 'DELETE' });
};

export const obtenerComidasHoyRequest = async (id) => {
    try {
        const res = await fetch(`${API_URL}/comidas/${id}`);
        return await res.json();
    } catch (error) { return []; }
};

export const registrarComidaRequest = async (data) => {
    await fetch(`${API_URL}/comidas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
};