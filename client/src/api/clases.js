const API_URL = 'http://localhost:5000/api';

export const obtenerClasesRequest = async () => {
    try {
        const response = await fetch(`${API_URL}/clases`);
        if (!response.ok) throw new Error('Error al obtener clases');
        return await response.json();
    } catch (error) {
        console.error("Error conectando con server:", error);
        return [];
    }
};

export const obtenerClasePorIdRequest = async (id) => {
    try {
        const response = await fetch(`${API_URL}/clases/${id}`);
        // Si el servidor devuelve 404 o HTML por error, esto lo atrapará
        if (!response.ok) throw new Error('Error al cargar la clase');
        return await response.json();
    } catch (error) {
        console.error("Error en obtenerClasePorId:", error);
        return null;
    }
};

export const inscribirClaseRequest = async (idClase, idUsuario) => {
    try {
        // CORRECCIÓN AQUÍ: Agregamos '/clases' a la ruta
        const response = await fetch(`${API_URL}/clases/inscripciones`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_clase: idClase, id_usuario: idUsuario })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al inscribirse');
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};

// Verificar estado
export const verificarInscripcionRequest = async (idClase, idUsuario) => {
    try {
        const response = await fetch(`${API_URL}/clases/${idClase}/inscrito/${idUsuario}`);
        if (!response.ok) return { inscrito: false };
        return await response.json();
    } catch (error) {
        return { inscrito: false };
    }
};

// Cancelar
export const cancelarInscripcionRequest = async (idClase, idUsuario) => {
    try {
        const response = await fetch(`${API_URL}/clases/inscripciones/${idClase}/${idUsuario}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Error al cancelar');
        return await response.json();
    } catch (error) {
        throw error;
    }
};