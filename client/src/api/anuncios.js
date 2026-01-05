const API_URL = 'http://localhost:5000/api';

// GET: Obtener todos los anuncios
export const obtenerAnunciosRequest = async () => {
    try {
        const response = await fetch(`${API_URL}/anuncios`);
        if (!response.ok) throw new Error('Error en la petición');
        return await response.json();
    } catch (error) {
        console.error("Error conectando con server:", error);
        return [];
    }
};

// POST: Crear un nuevo anuncio (Esta es la nueva función)
export const crearAnuncioRequest = async (anuncio) => {
    try {
        const response = await fetch(`${API_URL}/anuncios`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Importante para que el servidor entienda los datos
            },
            body: JSON.stringify(anuncio) // Convertimos el objeto JS a texto JSON
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al crear el anuncio');
        }

        return await response.json();
    } catch (error) {
        console.error("Error al crear anuncio:", error);
        throw error; // Lanzamos el error para que el componente Anuncios.jsx pueda mostrar la alerta roja
    }
};

// DELETE: Eliminar un anuncio por ID
export const eliminarAnuncioRequest = async (id) => {
    try {
        const response = await fetch(`${API_URL}/anuncios/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Error al eliminar el anuncio');
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};