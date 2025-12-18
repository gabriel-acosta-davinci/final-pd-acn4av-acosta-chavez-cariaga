import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Función para limpiar sesión
    const clearSession = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    // Cargar usuario al iniciar
    useEffect(() => {
        const initAuth = async () => {
            try {
                const token = authService.getToken();
                if (token) {
                    // Verificar si el token es válido obteniendo el usuario actual
                    try {
                        const currentUser = await authService.getCurrentUser();
                        setUser(currentUser);
                        setIsAuthenticated(true);
                    } catch (error) {
                        // Si falla la verificación, el token es inválido
                        console.error('Token inválido:', error);
                        clearSession();
                    }
                } else {
                    // No hay token, limpiar cualquier dato residual
                    clearSession();
                }
            } catch (error) {
                console.error('Error inicializando autenticación:', error);
                clearSession();
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    // Escuchar eventos de desautorización (401 desde API)
    useEffect(() => {
        const handleUnauthorized = () => {
            clearSession();
        };

        window.addEventListener('auth:unauthorized', handleUnauthorized);
        return () => {
            window.removeEventListener('auth:unauthorized', handleUnauthorized);
        };
    }, []);

    const login = async (identifier, password, identifierType = 'email') => {
        try {
            const response = await authService.login(identifier, password, identifierType);
            // Cargar usuario completo desde el backend
            try {
                const currentUser = await authService.getCurrentUser();
                setUser(currentUser);
            } catch (err) {
                // Si falla, usar el usuario de la respuesta del login
                setUser(response.user);
            }
            setIsAuthenticated(true);
            return response;
        } catch (error) {
            throw error;
        }
    };

    const signup = async (userData) => {
        try {
            const response = await authService.signup(userData);
            if (response.user) {
                setUser(response.user);
                setIsAuthenticated(true);
            }
            return response;
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        await clearSession();
    };

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        signup,
        logout,
        updateUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};

export default AuthContext;

