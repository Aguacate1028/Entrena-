const API_URL = 'http://localhost:5000/api';

export const obtenerAnunciosRequest = async () => {
    try {
        const response = await fetch(`${API_URL}/anuncios`);
        if (!response.ok) throw new Error('Error en la petición');
        return await response.json();
    } catch (error) {
        console.error("Error conectando con server:", error);
        return [];
    }
};