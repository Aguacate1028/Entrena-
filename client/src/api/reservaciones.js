const API_URL = 'http://localhost:5000/api/reservaciones';

// Obtener máquinas y estado de las filas
export const obtenerMaquinasFilaRequest = async () => {
    try {
        const response = await fetch(`${API_URL}/reservaciones/maquinas`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Error al obtener máquinas');
        return data;
    } catch (error) {
        console.error("Error en obtenerMaquinasFilaRequest:", error);
        throw error;
    }
};

// Unirse a una fila
export const unirseAFilaRequest = async (idMaquina, idUsuario) => {
    try {
        const response = await fetch(`${API_URL}/reservaciones/unirse`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_maquina: idMaquina, id_usuario: idUsuario })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Error al unirse a la fila');
        return data;
    } catch (error) {
        throw error;
    }
};

// Finalizar el uso de una máquina
export const finalizarUsoRequest = async (idFila) => {
    try {
        const response = await fetch(`${API_URL}/reservaciones/finalizar`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_fila: idFila })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Error al finalizar uso');
        return data;
    } catch (error) {
        throw error;
    }
};