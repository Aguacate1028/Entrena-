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
        // Asegúrate de que la ruta sea /admin/reporte-financiero
        const response = await fetch(`${API_URL}/admin/reporte-financiero`); 
        if (!response.ok) throw new Error('Error al obtener reporte');
        return await response.json();
    } catch (error) {
        console.error("Error en API Finanzas:", error);
        return null; // Cambiado a null para que el componente muestre el Loader o error
    }
};