const API_URL = 'http://localhost:5000/api';

export const obtenerPagosRequest = async () => {
    try {
        const response = await fetch(`${API_URL}/usuarios/administrador/pagos`);
        if (!response.ok) throw new Error('Error al obtener pagos');
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};
export const obtenerReporteFinancieroRequest = async (periodo = 'este_mes') => {
    try {
        const res = await fetch(`http://localhost:5000/api/admin/reporte-financiero?periodo=${periodo}`);
        return await res.json();
    } catch (error) {
        console.error(error);
        return null;
    }
};