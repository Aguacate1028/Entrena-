const API_URL = 'http://localhost:5000/api/admin';

// --- DASHBOARD & GENERAL ---
export const obtenerDashboardData = async () => (await fetch(`${API_URL}/dashboard`)).json();
export const obtenerReportesAdmin = async () => (await fetch(`${API_URL}/reportes`)).json();
export const obtenerFinanzasAdmin = async () => (await fetch(`${API_URL}/finanzas`)).json();
export const obtenerUsuariosAdmin = async () => (await fetch(`${API_URL}/usuarios`)).json();


// --- ENTRENADORES ---
export const obtenerEntrenadoresAdmin = async () => {
    const res = await fetch(`${API_URL}/entrenadores-list`);
    return await res.json();
};

export const agregarEntrenadorDirecto = async (data) => {
    const res = await fetch(`${API_URL}/entrenadores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error al agregar');
    return await res.json();
};

export const actualizarEntrenadorRequest = async (id, data) => {
    const res = await fetch(`${API_URL}/entrenadores/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error al actualizar');
    return await res.json();
};

export const eliminarEntrenadorRequest = async (id) => {
    const res = await fetch(`${API_URL}/entrenadores/${id}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Error al eliminar');
    return await res.json();
};


// --- INVENTARIO ---
export const obtenerInventarioAdmin = async () => (await fetch(`${API_URL}/inventario`)).json();

export const crearItemInventario = async (data) => {
    await fetch(`${API_URL}/inventario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
};

export const actualizarItemInventario = async (id, data) => {
    await fetch(`${API_URL}/inventario/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
};

export const eliminarItemInventario = async (id) => {
    await fetch(`${API_URL}/inventario/${id}`, { method: 'DELETE' });
};

// --- MEMBRESIAS ---
export const obtenerMembresiasAdmin = async () => (await fetch(`${API_URL}/membresias`)).json();

export const crearMembresiaRequest = async (data) => {
    await fetch(`${API_URL}/membresias`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
};

export const eliminarMembresiaRequest = async (id) => {
    await fetch(`${API_URL}/membresias/${id}`, { method: 'DELETE' });
};

export const actualizarMembresiaRequest = async (id, data) => {
    const res = await fetch(`${API_URL}/membresias/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error al actualizar');
    return await res.json();
};
