const API_URL = 'http://localhost:5000/api';

// Registrar asistencia mediante QR o Manual
export const registrarAsistenciaRequest = async (dataBody) => {
    try {
        const response = await fetch(`${API_URL}/asistencias/registrar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // Enviamos el objeto dataBody tal cual viene (ya contiene { id_usuario: ... })
            body: JSON.stringify(dataBody) 
        });

        const data = await response.json();

        if (!response.ok) {
            // Capturamos el mensaje del backend (ej: "Socio no encontrado")
            throw new Error(data.message || 'Error al registrar asistencia');
        }

        return data;
    } catch (error) {
        console.error("Error en registrarAsistenciaRequest:", error);
        throw error; 
    }
};