const API_URL = 'http://localhost:5000/api/guia';

export const obtenerMaquinasRequest = async () => {
    try {
        const response = await fetch(`${API_URL}/maquinas`);
        if (!response.ok) throw new Error('Error al cargar máquinas');
        return await response.json();
    } catch (error) {
        console.error("Error API Guía:", error);
        return [];
    }
};