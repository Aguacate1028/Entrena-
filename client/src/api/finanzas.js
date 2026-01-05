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

export const obtenerReporteFinancieroRequest = async () => {
    try {
        const response = await fetch(`${API_URL}/usuarios/staff/reporte-financiero`);
        if (!response.ok) throw new Error('Error al obtener reporte');
        return await response.json();
    } catch (error) {
        console.error("Error en API Finanzas:", error);
        // Retorno de emergencia para que la app no explote si el back falla
        return {
            metrics: { total: 0, count: 0 },
            chartData: [],
            methodData: [],
            recentPayments: []
        };
    }
};