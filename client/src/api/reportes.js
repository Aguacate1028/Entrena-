const API_URL = 'http://localhost:5000/api'; 

export const obtenerMisReportesRequest = async (idUsuario) => {
    // Nota que llamamos a una ruta especial '/usuario/ID'
    const res = await fetch(`${API_URL}/reportes/usuario/${idUsuario}`);
    
    if (!res.ok) {
        throw new Error('Error al obtener mis reportes');
    }
    
    return await res.json();
};

export const crearReporteRequest = async (reporte) => {
    const res = await fetch(`${API_URL}/reportes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reporte)
    });
    return await res.json();
};

export const obtenerReportesRequest = async () => {
    const res = await fetch(`${API_URL}/reportes`);
    return await res.json();
};

export const responderReporteRequest = async (id, data) => {
    const res = await fetch(`${API_URL}/reportes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return await res.json();
};

export const eliminarReporteRequest = async (id) => {
    await fetch(`${API_URL}/reportes/${id}`, { method: 'DELETE' });
};