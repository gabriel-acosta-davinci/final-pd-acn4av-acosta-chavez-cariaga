import apiClient from './api';

/**
 * Servicio de storage para subir archivos
 */
export const storageService = {
    /**
     * Subir archivo para una gestión
     * @param {string} gestionId - ID de la gestión
     * @param {File} file - Archivo a subir
     */
    async uploadFileForGestion(gestionId, file) {
        // Validar que el archivo existe
        if (!file || !(file instanceof File)) {
            throw new Error('Archivo inválido');
        }

        // Validar tamaño del archivo (10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB en bytes
        if (file.size > maxSize) {
            throw new Error(`El archivo es demasiado grande. Tamaño máximo: 10MB. Tamaño actual: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
        }

        // Validar tipo de archivo
        const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
            throw new Error(`Tipo de archivo no permitido. Tipos permitidos: PDF, PNG, JPG. Tipo actual: ${file.type}`);
        }

        const formData = new FormData();
        // Laravel espera el campo 'document' según la validación del backend
        formData.append('document', file);

        console.log('Enviando archivo:', {
            gestionId,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            formDataKeys: Array.from(formData.keys())
        });

        // No establecer Content-Type manualmente - el navegador lo hace automáticamente con el boundary
        return await apiClient.post(`/gestiones/${gestionId}/document`, formData);
    },
};

export default storageService;

