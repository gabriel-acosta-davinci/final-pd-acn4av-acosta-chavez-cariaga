import apiClient from './api';

const cartillaService = {
    /**
     * Obtener todas las provincias
     */
    async getProvinces() {
        return await apiClient.get('/cartilla/provinces');
    },

    /**
     * Obtener localidades por provincia
     */
    async getLocalidades(provinceId = null) {
        const params = provinceId ? { province_id: provinceId } : {};
        return await apiClient.get('/cartilla/localidades', { params });
    },

    /**
     * Obtener especialidades por tipo
     * @param {string} type - medic, diagnostic, urgency, inpatient, odontology
     */
    async getSpecialties(type = null) {
        const params = type ? { type } : {};
        return await apiClient.get('/cartilla/specialties', { params });
    },

    /**
     * Buscar providers agrupados (compatible con estructura JSON anterior)
     * @param {string} type - medic, diagnostic, urgency, inpatient, odontology
     * @param {string} localidad - nombre de localidad
     * @param {string} plan - bronce, plata, oro, platino (opcional)
     */
    async getProvidersGrouped(type, localidad, plan = null) {
        const params = { type, localidad };
        if (plan) {
            params.plan = plan;
        }
        return await apiClient.get('/cartilla/providers-grouped', { params });
    },

    /**
     * Buscar providers
     */
    async searchProviders(filters) {
        return await apiClient.get('/cartilla/providers', { params: filters });
    },

    /**
     * Buscar profesionales
     */
    async searchProfessionals(filters) {
        return await apiClient.get('/cartilla/professionals', { params: filters });
    },

    /**
     * Buscar farmacias
     */
    async searchPharmacies(filters) {
        return await apiClient.get('/cartilla/pharmacies', { params: filters });
    },

    /**
     * Buscar vacunatorios
     */
    async searchVaccines(filters) {
        return await apiClient.get('/cartilla/vaccines', { params: filters });
    },
};

export default cartillaService;

