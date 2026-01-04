const API_URL = 'http://localhost:5000/api/entrenadores';

export const contratarEntrenadorRequest = async (idUsuario, plan) => {
    try {
        const response = await fetch(`${API_URL}/contratar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_usuario: idUsuario, plan })
        });
        
        if (!response.ok) {
            // Intenta leer el mensaje de error del backend si existe
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Error al contratar entrenador');
        }

        return await response.json();
    } catch (error) {
        console.error("Error contratación:", error);
        throw error; // Re-lanzar para que el componente lo capture
    }
};