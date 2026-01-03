const API_URL = 'http://localhost:5000/api';

export const obtenerClasesRequest = async () => {
    try {
        const response = await fetch(`${API_URL}/clases`);
        if (!response.ok) throw new Error('Error al obtener clases');
        return await response.json();
    } catch (error) {
        console.error("Error conectando con server:", error);
        return [];
    }
};