const API_URL = 'http://localhost:5000/api';

export const obtenerMembresiasRequest = async () => {
    try {
        const response = await fetch(`${API_URL}/membresias`);
        if (!response.ok) throw new Error('Error al obtener membresías');
        return await response.json();
    } catch (error) {
        console.error("Error conectando con server:", error);
        return [];
    }
};