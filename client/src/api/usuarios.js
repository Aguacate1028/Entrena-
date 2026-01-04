const API_URL = 'http://localhost:5000/api';

// 1. Obtener datos del perfil del usuario
export const obtenerPerfilRequest = async (idUsuario) => {
    try {
        const response = await fetch(`${API_URL}/usuarios/${idUsuario}`);
        if (!response.ok) throw new Error('Error al cargar perfil');
        return await response.json();
    } catch (error) {
        console.error("Error obteniendo perfil:", error);
        return null;
    }
};

// 2. Obtener las clases en las que está inscrito el usuario
export const obtenerMisClasesRequest = async (idUsuario) => {
    try {
        const response = await fetch(`${API_URL}/usuarios/${idUsuario}/clases`);
        if (!response.ok) throw new Error('Error al obtener mis clases');
        return await response.json();
    } catch (error) {
        console.error("Error obteniendo mis clases:", error);
        return []; // Retornamos array vacío para que no rompa el .map()
    }
};

export const actualizarPerfilRequest = async (idUsuario, datos) => {
    const response = await fetch(`${API_URL}/usuarios/${idUsuario}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    });
    return await response.json();
};

export const agregarObjetivoRequest = async (idUsuario, texto) => {
    const response = await fetch(`${API_URL}/usuarios/objetivos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario: idUsuario, texto })
    });
    return await response.json();
};

export const eliminarObjetivoRequest = async (idObjetivo) => {
    await fetch(`${API_URL}/usuarios/objetivos/${idObjetivo}`, {
        method: 'DELETE'
    });
};

// Subir foto de perfil
export const subirFotoPerfilRequest = async (idUsuario, archivo) => {
    const formData = new FormData();
    formData.append('archivo', archivo); // 'archivo' debe coincidir con upload.single('archivo') del backend

    const response = await fetch(`${API_URL}/usuarios/${idUsuario}/foto`, {
        method: 'POST',
        body: formData // No lleva headers Content-Type, el navegador lo pone solo
    });

    if (!response.ok) throw new Error('Error al subir imagen');
    return await response.json();
};