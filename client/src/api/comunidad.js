const API_URL = 'http://localhost:5000/api/comunidad';

export const obtenerPostsRequest = async () => {
    const res = await fetch(`${API_URL}`);
    return await res.json();
};

// Frontend: api/comunidad.js
export const crearPostRequest = async (formData) => {
    try {
        const res = await fetch(`${API_URL}`, {
            method: 'POST',
            body: formData // Importante: NO poner headers de Content-Type aquí
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || 'Error al crear post');
        }
        return await res.json();
    } catch (error) {
        console.error("Error en crearPostRequest:", error);
        throw error;
    }
};

export const darLikeRequest = async (idPost) => {
    const res = await fetch(`${API_URL}/${idPost}/like`, { method: 'PUT' });
    return await res.json();
};

export const comentarRequest = async (idPost, idUsuario, texto) => {
    const res = await fetch(`${API_URL}/${idPost}/comentar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario: idUsuario, texto })
    });
    return await res.json();
};

export const eliminarPostRequest = async (idPost, idUsuario) => {
    const res = await fetch(`${API_URL}/${idPost}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario: idUsuario })
    });
    return await res.json();
};