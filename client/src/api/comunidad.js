const API_URL = 'http://localhost:5000/api/comunidad';

export const obtenerPostsRequest = async () => {
    const res = await fetch(`${API_URL}`);
    return await res.json();
};

export const crearPostRequest = async (formData) => {
    const res = await fetch(`${API_URL}`, {
        method: 'POST',
        body: formData // Se envía como FormData por la imagen
    });
    return await res.json();
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