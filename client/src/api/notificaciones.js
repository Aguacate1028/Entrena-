const API_URL = 'http://localhost:5000/api'; 

// 1. Obtener todas las notificaciones de un usuario
export const obtenerNotificacionesRequest = async (idUsuario) => {
    try {
        const response = await fetch(`${API_URL}/notificaciones/${idUsuario}`);
        if (!response.ok) throw new Error('Error al obtener notificaciones');
        return await response.json();
    } catch (error) {
        console.error("Error conectando con server:", error);
        return []; // Retorna array vacío para evitar errores en el map()
    }
};

// 2. Marcar una notificación individual como leída
export const marcarLeidaRequest = async (idNotificacion) => {
    try {
        const response = await fetch(`${API_URL}/notificaciones/${idNotificacion}/leida`, {
            method: 'PUT'
        });
        if (!response.ok) throw new Error('Error al actualizar notificación');
        return await response.json();
    } catch (error) {
        console.error("Error marcando leída:", error);
        return null;
    }
};

// 3. Marcar TODAS las notificaciones como leídas
export const marcarTodasLeidasRequest = async (idUsuario) => {
    try {
        const response = await fetch(`${API_URL}/notificaciones/marcar-todas`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idUsuario })
        });
        if (!response.ok) throw new Error('Error al marcar todas');
        return await response.json();
    } catch (error) {
        console.error("Error marcando todas:", error);
        return null;
    }
};