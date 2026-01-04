const API_URL = 'http://localhost:5000/api';

// 1. Obtener lista de planes disponibles
export const obtenerMembresiasRequest = async () => {
    try {
        const response = await fetch(`${API_URL}/membresias/planes`); 
        if (!response.ok) throw new Error('Error al obtener planes');
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

// 2. Procesar el pago (Simulado o Stripe)
export const procesarPagoRequest = async (datosPago) => {
    // datosPago = { id_usuario, id_plan, metodo_pago }
    try {
        const response = await fetch(`${API_URL}/membresias/procesar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosPago)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error en el procesamiento del pago');
        }
        
        return await response.json();
    } catch (error) {
        throw error; // Lanzamos el error para que el componente muestre el Toast
    }
};

// 3. Gestionar suscripción (Pausar / Cancelar)
export const gestionarSuscripcionRequest = async (datosGestion) => {
    // datosGestion = { id_usuario, accion: 'cancelar' | 'pausar' }
    try {
        const response = await fetch(`${API_URL}/membresias/gestionar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosGestion)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al gestionar la suscripción');
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};