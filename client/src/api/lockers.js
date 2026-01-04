const API_URL = 'http://localhost:5000/api/lockers';

// 1. RENTAR LOCKER
export const rentarLockerRequest = async (idUsuario, meses) => {
    try {
        const response = await fetch(`${API_URL}/rentar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_usuario: idUsuario, meses })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Error al rentar locker');
        }

        return await response.json();
    } catch (error) {
        console.error("Error en petición locker:", error);
        throw error;
    }
};

// 2. CANCELAR LOCKER 
export const cancelarLockerRequest = async (idUsuario) => {
    try {
        const response = await fetch(`${API_URL}/cancelar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_usuario: idUsuario })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Error al cancelar locker');
        }

        return await response.json();
    } catch (error) {
        console.error("Error cancelando locker:", error);
        throw error;
    }
};