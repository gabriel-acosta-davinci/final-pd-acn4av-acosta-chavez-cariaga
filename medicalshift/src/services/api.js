import API_BASE_URL from '../config/api';

/**
 * Cliente API para comunicarse con el backend
 */
class ApiClient {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    /**
     * Realiza una petición HTTP
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const token = localStorage.getItem('token');

        // Determinar si el body es FormData
        const isFormData = options.body instanceof FormData;

        const config = {
            ...options,
            headers: {
                // Solo establecer Content-Type si NO es FormData (el navegador lo hace automáticamente)
                ...(!isFormData && { 'Content-Type': 'application/json' }),
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, config);
            
            // Si la respuesta no es JSON, intentar obtener el texto
            let data;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                const text = await response.text();
                data = { error: text || `Error: ${response.statusText}` };
            }

            // Si es un error 401 (no autorizado), limpiar sesión
            if (response.status === 401) {
                this.handleUnauthorized();
                throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
            }

            if (!response.ok) {
                // Crear un error con más información
                const error = new Error(data.error || `Error: ${response.statusText}`);
                // Agregar detalles adicionales del error si existen
                if (data.details) {
                    error.details = data.details;
                }
                if (data.messages) {
                    error.details = data.messages;
                }
                if (data.error) {
                    error.error = data.error;
                }
                throw error;
            }

            return data;
        } catch (error) {
            // Si el error es de autenticación, asegurarse de limpiar
            if (error.message.includes('401') || 
                error.message.includes('Token') || 
                error.message.includes('Sesión expirada') ||
                error.message.includes('No se proporcionó token')) {
                this.handleUnauthorized();
            }
            throw error;
        }
    }

    /**
     * Maneja errores de autenticación limpiando la sesión
     */
    handleUnauthorized() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Disparar evento personalizado para que AuthContext reaccione
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }

    // Métodos HTTP
    get(endpoint, options = {}) {
        // Si hay params, construir query string
        let finalEndpoint = endpoint;
        if (options.params) {
            const queryParams = new URLSearchParams(options.params);
            const queryString = queryParams.toString();
            if (queryString) {
                finalEndpoint = `${endpoint}?${queryString}`;
            }
            // Remover params de options para no incluirlos en el body
            const { params, ...restOptions } = options;
            return this.request(finalEndpoint, { ...restOptions, method: 'GET' });
        }
        return this.request(finalEndpoint, { ...options, method: 'GET' });
    }

    post(endpoint, data, options = {}) {
        // Si data es FormData, no stringificarlo
        const isFormData = data instanceof FormData;
        const body = isFormData ? data : JSON.stringify(data);
        
        // Si es FormData, no establecer Content-Type (el navegador lo hará automáticamente)
        const headers = isFormData 
            ? { ...options.headers }
            : { 'Content-Type': 'application/json', ...options.headers };
        
        return this.request(endpoint, {
            ...options,
            method: 'POST',
            body,
            headers,
        });
    }

    put(endpoint, data, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    delete(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    }
}

// Instancia única del cliente API
const apiClient = new ApiClient(API_BASE_URL);

export default apiClient;

