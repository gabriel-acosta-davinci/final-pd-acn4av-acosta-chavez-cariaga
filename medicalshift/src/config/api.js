// Configuración de la API
// Laravel usa el puerto 8000 por defecto y las rutas API tienen prefijo /api
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export default API_BASE_URL;



