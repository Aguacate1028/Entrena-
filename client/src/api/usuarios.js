const API_URL = 'http://localhost:5000/api';

// 1. Obtener datos del perfil del usuario
export const obtenerPerfilRequest = async (idUsuario) => {
    try {
        const response = await fetch(`${API_URL}/usuarios/${idUsuario}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error en el servidor');
        }
        return await response.json();
    } catch (error) {
        console.error("Error obteniendo perfil:", error);
        return null; // El frontend ahora sabe manejar este null con la guarda que pusimos arriba
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


export const obtenerStatsStaffRequest = async () => {
    try {
        const response = await fetch(`${API_URL}/usuarios/staff/stats`);
        if (!response.ok) throw new Error('Error al cargar stats');
        return await response.json();
    } catch (error) {
        console.error(error);
        return { sociosActivos: 0, accesosHoy: 0, lockersOcupados: 0 };
    }
};

export const obtenerTodosSociosRequest = async () => {
    try {
        const response = await fetch(`${API_URL}/usuarios/staff/socios`);
        if (!response.ok) throw new Error('Error al cargar socios');
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const obtenerLockersRequest = async () => {
    try {
        const response = await fetch(`${API_URL}/usuarios/staff/lockers`);
        return await response.json();
    } catch (error) {
        return [];
    }
};

// NUEVA FUNCIÓN: Obtener detalle completo para el modal
export const obtenerDetalleUsuarioRequest = async (id) => {
    try {
        const response = await fetch(`${API_URL}/usuarios/staff/detalle/${id}`);
        if (!response.ok) throw new Error('Error al obtener detalles del usuario');
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// NUEVA FUNCIÓN: Eliminar usuario (CRUD)
export const eliminarUsuarioRequest = async (id) => {
    try {
        const response = await fetch(`${API_URL}/usuarios/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Error al eliminar usuario');
        return await response.json();
    } catch (error) {
        throw error;
    }
};

// NUEVA FUNCIÓN: Actualizar usuario (CRUD)
export const actualizarUsuarioRequest = async (id, datos) => {
    const response = await fetch(`${API_URL}/usuarios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    });
    return await response.json();
};

// NUEVA: Crear socio manualmente
export const crearSocioRequest = async (datos) => {
    const response = await fetch(`${API_URL}/usuarios/staff/crear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Error al crear socio');
    
    return data;
};


// Asignar locker
export const asignarLockerRequest = async (datos) => {
    const response = await fetch(`${API_URL}/usuarios/staff/lockers/asignar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Error al asignar');
    }
    return await response.json();
};

// Liberar locker
export const liberarLockerRequest = async (idUsuario) => {
    const response = await fetch(`${API_URL}/usuarios/staff/lockers/liberar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario: idUsuario })
    });
    if (!response.ok) throw new Error('Error al liberar locker');
    return await response.json();
};

export const obtenerPagosStaffRequest = async () => {
    try {
        const response = await fetch(`${API_URL}/usuarios/staff/pagos`);
        if (!response.ok) throw new Error('Error al cargar historial de pagos');
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};