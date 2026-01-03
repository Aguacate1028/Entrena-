const API_URL = 'http://localhost:5000/api';

export const registerRequest = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        return await response.json();
    } catch (error) {
        console.error("Error en registro:", error);
        return { success: false, error: "Error de conexión" };
    }
};

export const loginRequest = async (credentials) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });
        return await response.json();
    } catch (error) {
        console.error("Error en login:", error);
        return { success: false, error: "Error de conexión" };
    }
};