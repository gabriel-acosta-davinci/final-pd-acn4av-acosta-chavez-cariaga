import apiClient from './api';

/**
 * Servicio de facturas
 */
export const facturaService = {
    /**
     * Listar facturas del usuario autenticado
     * @param {Object} filters - Filtros opcionales: { estado, limit }
     */
    async list(filters = {}) {
        const queryParams = new URLSearchParams();
        if (filters.estado) queryParams.append('estado', filters.estado);
        if (filters.limit) queryParams.append('limit', filters.limit);

        const queryString = queryParams.toString();
        const endpoint = queryString ? `/facturas?${queryString}` : '/facturas';
        
        return await apiClient.get(endpoint);
    },
};

export default facturaService;



