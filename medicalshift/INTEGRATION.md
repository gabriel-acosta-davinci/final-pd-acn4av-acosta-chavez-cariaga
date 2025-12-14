# Integración Backend-Frontend

Este documento describe la integración entre el frontend web (React + Vite) y el backend (Express + Firebase).

## Configuración

### Backend

1. Asegúrate de que el backend esté corriendo en el puerto 3000 (o el puerto configurado en `process.env.PORT`).

2. El backend ya tiene CORS configurado para permitir peticiones desde `http://localhost:5173` (puerto por defecto de Vite).

3. Si necesitas cambiar la URL del frontend permitida, edita `backend-medicalshift/app.js`:
```javascript
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
```

### Frontend

1. Crea un archivo `.env` en la raíz del proyecto frontend con:
```
VITE_API_BASE_URL=http://localhost:3000
```

2. Si el backend está en otro puerto o URL, actualiza `VITE_API_BASE_URL` en el archivo `.env`.

## Estructura de Integración

### Servicios API

- **`src/services/api.js`**: Cliente HTTP base para todas las peticiones
- **`src/services/authService.js`**: Servicios de autenticación (login, signup, recovery, etc.)
- **`src/services/gestionService.js`**: Servicios de gestiones
- **`src/services/facturaService.js`**: Servicios de facturas

### Contexto de Autenticación

- **`src/contexts/AuthContext.jsx`**: Contexto React que maneja el estado de autenticación global
- Proporciona: `user`, `isAuthenticated`, `login`, `signup`, `logout`, `updateUser`

### Uso del Contexto

```jsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
    const { user, isAuthenticated, login, logout } = useAuth();
    
    // Usar las funciones y estado
}
```

## Endpoints Disponibles

### Autenticación (`/auth`)

- `POST /auth/login` - Iniciar sesión
- `POST /auth/signup` - Registrar nuevo usuario
- `POST /auth/recovery` - Solicitar recuperación de contraseña
- `POST /auth/reset-password` - Restablecer contraseña
- `GET /auth/me` - Obtener usuario actual (requiere autenticación)
- `PUT /auth/password` - Actualizar contraseña (requiere autenticación)

### Usuarios (`/users`)

- `GET /users` - Listar usuarios
- `GET /users/:id` - Obtener usuario por ID
- `PUT /users/me` - Actualizar usuario actual (requiere autenticación)

### Gestiones (`/gestiones`)

- `POST /gestiones` - Crear gestión (requiere autenticación)
- `GET /gestiones` - Listar gestiones (requiere autenticación)
  - Query params: `?userId=...&estado=...&limit=20`

### Facturas (`/facturas`)

- `GET /facturas` - Listar facturas (requiere autenticación)
  - Query params: `?estado=...&limit=20`

## Formularios Integrados

### Login (`src/components/Login/LoginForm.jsx`)
- Integrado con el endpoint `/auth/login`
- Soporta login con email o número de documento
- Guarda token y usuario en localStorage

### Registro (`src/components/Login/RegisterForm.jsx`)
- Integrado con el endpoint `/auth/signup`
- Campos: nombre, apellido, email, documentNumber, password
- Validación de contraseña (mínimo 6 caracteres)

### Recuperación (`src/components/Login/RecoveryForm.jsx`)
- Integrado con el endpoint `/auth/recovery`
- Envía email de recuperación

## Manejo de Tokens

El token JWT se guarda automáticamente en `localStorage` después de un login exitoso y se incluye en todas las peticiones autenticadas mediante el header `Authorization: Bearer <token>`.

Si el token expira o es inválido, se limpia automáticamente del localStorage.

## Próximos Pasos

1. Implementar rutas protegidas que requieran autenticación
2. Crear componentes para gestiones y facturas
3. Agregar manejo de errores más robusto
4. Implementar refresh token si es necesario



