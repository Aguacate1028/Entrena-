const API_URL = 'http://localhost:5000/api/finanzas';

// Obtener el historial de pagos y métricas financieras
export const obtenerPagosRequest = async () => {
    try {
        const response = await fetch(`${API_URL}/pagos/historial`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al obtener datos financieros');
        }

        return data;
    } catch (error) {
        console.error("Error en obtenerPagosRequest:", error);
        throw error;
    }
};