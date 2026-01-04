const API_URL = 'http://localhost:5000/api/entrenadores';

// 1. CONTRATAR
export const contratarEntrenadorRequest = async (idUsuario, plan) => {
    try {
        const response = await fetch(`${API_URL}/contratar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_usuario: idUsuario, plan })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Error al contratar');
        }

        return await response.json();
    } catch (error) {
        console.error("Error contratación:", error);
        throw error; 
    }
};

// 2. CANCELAR 
export const cancelarEntrenadorRequest = async (idUsuario) => {
    try {
        const response = await fetch(`${API_URL}/cancelar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_usuario: idUsuario })
        });

        if (!response.ok) throw new Error('Error al cancelar servicio');
        return await response.json();
    } catch (error) {
        throw error;
    }
};