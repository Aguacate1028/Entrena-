const API_URL = 'http://localhost:5000/api/reservas'; // Ajusta si tu ruta base es diferente

export const obtenerMaquinasRequest = async () => {
    const res = await fetch(`${API_URL}/maquinas`);
    return await res.json();
};

export const obtenerMiTurnoRequest = async (userId) => {
    const res = await fetch(`${API_URL}/mi-turno/${userId}`);
    return await res.json();
};

export const unirseFilaRequest = async (data) => {
    const res = await fetch(`${API_URL}/fila`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error al unirse');
    return await res.json();
};

export const finalizarTurnoRequest = async (data) => {
    const res = await fetch(`${API_URL}/fila/finalizar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error al finalizar');
    return await res.json();
};

export const abandonarFilaRequest = async (id) => {
    const res = await fetch(`${API_URL}/fila/${id}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Error al abandonar');
    return await res.json();
};