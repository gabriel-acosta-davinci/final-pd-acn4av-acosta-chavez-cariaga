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
    async logout() {
        try {
            // Llamar al backend para desactivar el token digital
            await apiClient.post('/auth/logout');
        } catch (error) {
            console.error('Error al cerrar sesión en el servidor:', error);
            // Continuar con el logout local incluso si falla el servidor
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
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
     * @param {string} currentPassword - Contraseña actual
     * @param {string} newPassword - Nueva contraseña
     * @param {string} confirmPassword - Confirmación de nueva contraseña
     */
    async updatePassword(currentPassword, newPassword, confirmPassword) {
        return await apiClient.put('/auth/password', {
            currentPassword,
            newPassword,
            confirmPassword
        });
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

    /**
     * Obtener el token digital actual del usuario autenticado
     */
    async getDigitalToken() {
        return await apiClient.get('/auth/digital-token');
    },

    /**
     * Enviar email de verificación
     */
    async sendVerificationEmail() {
        return await apiClient.post('/auth/verify-email');
    },

    /**
     * Obtener notificaciones del usuario
     */
    async getNotifications() {
        return await apiClient.get('/auth/notifications');
    },
};

export default authService;



