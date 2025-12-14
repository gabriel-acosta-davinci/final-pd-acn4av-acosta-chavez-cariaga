import apiClient from './api';

/**
 * Servicio de autenticación
 */
export const authService = {
    /**
     * Iniciar sesión
     * @param {string} identifier - Email o número de documento
     * @param {string} password - Contraseña
     * @param {string} identifierType - 'email' o 'documentNumber'
     */
    async login(identifier, password, identifierType = 'email') {
        const response = await apiClient.post('/auth/login', {
            identifier,
            password,
            identifierType,
        });

        // Guardar token y usuario en localStorage
        if (response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
        }

        return response;
    },

    /**
     * Registrar nuevo usuario
     * @param {Object} userData - Datos del usuario
     */
    async signup(userData) {
        const response = await apiClient.post('/auth/signup', userData);

        // Si el registro incluye token, guardarlo
        if (response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
        }

        return response;
    },

    /**
     * Cerrar sesión
     */
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    /**
     * Obtener usuario actual
     */
    async getCurrentUser() {
        return await apiClient.get('/auth/me');
    },

    /**
     * Verificar token
     * @param {string} idToken - Token de Firebase
     */
    async verifyToken(idToken) {
        return await apiClient.post('/auth/verify', { idToken });
    },

    /**
     * Solicitar recuperación de contraseña
     * @param {string} email - Email del usuario
     */
    async recovery(email) {
        return await apiClient.post('/auth/recovery', { email });
    },

    /**
     * Restablecer contraseña
     * @param {string} identifier - Email o número de documento
     * @param {string} newPassword - Nueva contraseña
     * @param {string} identifierType - 'email' o 'documentNumber'
     */
    async resetPassword(identifier, newPassword, identifierType = 'email') {
        return await apiClient.post('/auth/reset-password', {
            identifier,
            newPassword,
            identifierType,
        });
    },

    /**
     * Actualizar contraseña (requiere autenticación)
     * @param {string} newPassword - Nueva contraseña
     */
    async updatePassword(newPassword) {
        return await apiClient.put('/auth/password', { newPassword });
    },

    /**
     * Obtener token del localStorage
     */
    getToken() {
        return localStorage.getItem('token');
    },

    /**
     * Obtener usuario del localStorage
     */
    getUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    /**
     * Verificar si el usuario está autenticado
     */
    isAuthenticated() {
        return !!this.getToken();
    },
};

export default authService;



