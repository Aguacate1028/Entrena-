const API_URL = 'http://localhost:5000/api';

// Registrar asistencia mediante QR
export const registrarAsistenciaRequest = async (idUsuario) => {
    try {
        const response = await fetch(`${API_URL}/asistencias/registrar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_usuario: idUsuario })
        });

        const data = await response.json();

        // Si el status no es 200-299 (ej. 403 Membresía Vencida o 404 Usuario no encontrado)
        if (!response.ok) {
            throw new Error(data.message || 'Error al registrar asistencia');
        }

        return data;
    } catch (error) {
        console.error("Error en registro asistencia:", error);
        throw error; // Lanzamos el error para que el componente muestre la pantalla roja
    }
};