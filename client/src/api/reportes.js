const API_URL = 'http://localhost:5000/api/reportes';

export const crearReporteRequest = async (datos) => {
    const response = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    });
    return await response.json();
};

export const obtenerMisReportesRequest = async (idUsuario) => {
    const response = await fetch(`${API_URL}/${idUsuario}`);
    return await response.json();
};