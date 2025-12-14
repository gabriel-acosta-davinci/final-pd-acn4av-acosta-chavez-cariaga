import apiClient from './api';

/**
 * Servicio de documentos
 */
export const documentService = {
    /**
     * Listar documentos del usuario
     * @param {Object} filters - Filtros opcionales: { gestionId, limit }
     */
    async listDocuments(filters = {}) {
        const queryParams = new URLSearchParams();
        if (filters.gestionId) queryParams.append('gestionId', filters.gestionId);
        if (filters.limit) queryParams.append('limit', filters.limit);

        const queryString = queryParams.toString();
        const endpoint = queryString ? `/storage/documents?${queryString}` : '/storage/documents';
        
        return await apiClient.get(endpoint);
    },

    /**
     * Obtener URL de descarga de un documento
     * @param {string} fileName - Nombre del archivo
     */
    async getDocumentUrl(fileName) {
        return await apiClient.get(`/storage/url/${encodeURIComponent(fileName)}`);
    },

    /**
     * Eliminar un documento
     * @param {string} fileName - Nombre del archivo
     */
    async deleteDocument(fileName) {
        return await apiClient.delete(`/storage/${encodeURIComponent(fileName)}`);
    },
};

export default documentService;



