const API_URL = 'http://localhost:5000/api';

export const obtenerStatsPublicas = async () => {
    try {
        const response = await fetch(`${API_URL}/public/stats`);
        if (!response.ok) throw new Error('Error fetching stats');
        return await response.json();
    } catch (error) {
        console.error(error);
        return { miembros: 0, clases: 0, acceso: '24/7', satisfaccion: '100%' };
    }
};