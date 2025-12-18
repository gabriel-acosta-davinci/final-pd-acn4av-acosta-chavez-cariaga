import gestionService from '../services/gestionService';
import storageService from '../services/storageService';
import authService from '../services/authService';

/**
 * Helper para crear gestiones y subir archivos
 * @param {string} nombreGestion - Nombre de la gestión
 * @param {string|null} fechaAplicacion - Fecha en formato dd/MM/yyyy o null
 * @param {File|null} archivo - Archivo a subir o null
 * @returns {Promise<string>} - ID de la gestión creada
 */
export async function crearGestionYSubirArchivo(nombreGestion, fechaAplicacion, archivo) {
    try {
        // Obtener userId del token
        const token = authService.getToken();
        if (!token) {
            throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
        }

        // Validar que el nombre de la gestión esté presente
        if (!nombreGestion || typeof nombreGestion !== 'string' || nombreGestion.trim() === '') {
            throw new Error('El nombre de la gestión es requerido');
        }

        // Obtener userId del usuario actual
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        // Usar el ID numérico del usuario (Laravel devuelve 'id', Firebase devuelve 'uid')
        const userId = user.id || user.uid;
        
        if (!userId) {
            throw new Error('No se pudo obtener el ID del usuario');
        }

        // Formatear fecha para el backend (en milisegundos)
        // Solo enviar fecha si se proporciona una fecha específica
        const gestionData = {
            nombre: nombreGestion.trim(),
            userId: userId,
        };

        if (fechaAplicacion) {
            // Parsear fecha en formato dd/MM/yyyy
            const [day, month, year] = fechaAplicacion.split('/');
            const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
            const fechaTimestamp = date.getTime();
            
            // Validar que la fecha sea válida
            if (!isNaN(fechaTimestamp) && fechaTimestamp > 0) {
                gestionData.fecha = fechaTimestamp;
            }
        }
        // Si no hay fechaAplicacion, no enviar el campo fecha
        // El backend usará la fecha actual automáticamente

        // Validar que haya un archivo antes de crear la gestión
        if (!archivo) {
            throw new Error('Debes seleccionar un archivo para crear la gestión');
        }

        // Crear la gestión
        // Nota: El estado se establece automáticamente como "pendiente" en el backend si no se envía
        let gestionId = null;
        let gestionCreada = false;

        try {
            const gestionResponse = await gestionService.create(gestionData);

            if (!gestionResponse.gestion || !gestionResponse.gestion.id) {
                throw new Error('No se pudo crear la gestión');
            }

            gestionId = gestionResponse.gestion.id;
            gestionCreada = true;

            console.log('Gestión creada:', gestionId);

            // Subir el archivo (requerido)
            console.log('Subiendo archivo para gestión:', {
                gestionId,
                fileName: archivo.name,
                fileSize: archivo.size,
                fileType: archivo.type
            });

            const uploadResult = await storageService.uploadFileForGestion(gestionId, archivo);
            console.log('Archivo subido exitosamente:', uploadResult);

            return gestionId;
        } catch (error) {
            console.error('Error en el proceso:', error);
            
            // Si la gestión se creó pero falló la subida del archivo, eliminarla
            if (gestionCreada && gestionId) {
                try {
                    console.log('Eliminando gestión creada debido a error en subida de archivo:', gestionId);
                    await gestionService.delete(gestionId);
                    console.log('Gestión eliminada exitosamente');
                } catch (deleteError) {
                    console.error('Error al eliminar la gestión:', deleteError);
                    // No lanzar error aquí, el error principal es más importante
                }
            }
            
            // Extraer mensaje de error más descriptivo
            let errorMessage = error.message || 'Error desconocido';
            
            // Si el error tiene detalles de validación, mostrarlos
            if (error.details && Array.isArray(error.details)) {
                errorMessage = error.details.join(', ');
            } else if (error.error) {
                errorMessage = error.error;
            }
            
            // Mensaje de error mejorado
            if (gestionCreada) {
                throw new Error(`No se pudo subir el archivo: ${errorMessage}. La gestión fue eliminada automáticamente.`);
            } else {
                throw new Error(`Error al crear la gestión: ${errorMessage}`);
            }
        }
    } catch (error) {
        console.error('Error creando gestión:', error);
        throw error;
    }
}

