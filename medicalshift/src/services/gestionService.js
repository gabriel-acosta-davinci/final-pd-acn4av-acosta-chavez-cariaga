import apiClient from './api';

/**
 * Servicio de gestiones
 */
export const gestionService = {
    /**
     * Crear una nueva gestión
     * @param {Object} gestionData - Datos de la gestión
     */
    async create(gestionData) {
        return await apiClient.post('/gestiones', gestionData);
    },

    /**
     * Listar gestiones del usuario autenticado
     * @param {Object} filters - Filtros opcionales: { userId, estado, limit }
     */
    async list(filters = {}) {
        const queryParams = new URLSearchParams();
        if (filters.userId) queryParams.append('userId', filters.userId);
        if (filters.estado) queryParams.append('estado', filters.estado);
        if (filters.limit) queryParams.append('limit', filters.limit);

        const queryString = queryParams.toString();
        const endpoint = queryString ? `/gestiones?${queryString}` : '/gestiones';
        
        return await apiClient.get(endpoint);
    },

    /**
     * Eliminar una gestión
     * @param {string|number} gestionId - ID de la gestión
     */
    async delete(gestionId) {
        return await apiClient.delete(`/gestiones/${gestionId}`);
    },
};

export default gestionService;



