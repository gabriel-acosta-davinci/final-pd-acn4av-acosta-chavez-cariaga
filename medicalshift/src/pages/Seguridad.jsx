import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import authService from "../services/authService";
import DashboardHeader from "../components/Dashboard/DashboardHeader";

export default function Seguridad() {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [token, setToken] = useState("");
    const [emailRecuperacion, setEmailRecuperacion] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate("/Login");
        }
    }, [authLoading, isAuthenticated, navigate]);

    useEffect(() => {
        if (user) {
            // Cargar email del usuario por defecto
            setEmailRecuperacion(user.email || "");
        }
    }, [user]);

    // Cargar y actualizar el token digital cada 30 segundos
    useEffect(() => {
        if (!isAuthenticated) return;

        // Función para obtener el token del servidor
        const fetchDigitalToken = async () => {
            try {
                const response = await authService.getDigitalToken();
                if (response.digitalToken) {
                    setToken(response.digitalToken);
                }
            } catch (err) {
                console.error("Error obteniendo token digital:", err);
            }
        };

        // Cargar el token inmediatamente
        fetchDigitalToken();

        // Actualizar el token cada 30 segundos
        const interval = setInterval(() => {
            fetchDigitalToken();
        }, 30000); // 30000 ms = 30 segundos

        // Limpiar el intervalo cuando el componente se desmonte
        return () => clearInterval(interval);
    }, [isAuthenticated]);

    const handleEnviarCorreoVerificacion = async () => {
        try {
            setLoading(true);
            setError("");
            setSuccess("");
            const response = await authService.sendVerificationEmail();
            setSuccess(response.message || "Se ha enviado un email de verificación. Por favor, revisa tu bandeja de entrada.");
        } catch (err) {
            console.error("Error enviando correo de verificación:", err);
            setError(err.message || "Error al enviar el correo de verificación");
        } finally {
            setLoading(false);
        }
    };


    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Validaciones en el frontend
        if (!passwordData.currentPassword) {
            setError("La contraseña actual es requerida");
            return;
        }

        if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
            setError("La nueva contraseña debe tener al menos 6 caracteres");
            return;
        }

        if (passwordData.newPassword === passwordData.currentPassword) {
            setError("La nueva contraseña debe ser diferente a la contraseña actual");
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        try {
            setLoading(true);
            await authService.updatePassword(
                passwordData.currentPassword,
                passwordData.newPassword,
                passwordData.confirmPassword
            );
            setSuccess("Contraseña actualizada exitosamente");
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            setShowChangePassword(false);
        } catch (err) {
            console.error("Error actualizando contraseña:", err);
            // Manejar errores del backend
            if (err.messages && typeof err.messages === 'object') {
                const errorMessages = Object.values(err.messages).flat();
                setError(errorMessages.join(', ') || "Error al actualizar la contraseña");
            } else {
                setError(err.message || err.error || "Error al actualizar la contraseña");
            }
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <DashboardHeader />
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Seguridad</h1>
                    <p className="text-gray-600">Gestiona tu seguridad y configuración de acceso</p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        {success}
                    </div>
                )}

                <div className="space-y-6">
                    {/* Token de Seguridad */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Token Digital de Seguridad</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Token Actual
                                </label>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 px-4 py-3 border-2 border-sky-500 rounded-md bg-gray-50 text-gray-900 font-mono text-3xl font-bold text-center tracking-widest">
                                        {token || "---"}
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">
                                    Este token de 3 dígitos se regenera automáticamente cada 30 segundos mientras tu sesión esté activa. 
                                    Úsalo para acceder a tu credencial de obra social.
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    El token se actualiza automáticamente. No es necesario recargar la página.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Verificación de Correo Electrónico */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Verificar Correo Electrónico</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email de Verificación
                                </label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="email"
                                        value={emailRecuperacion}
                                        readOnly
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                                    />
                                    <button
                                        onClick={handleEnviarCorreoVerificacion}
                                        disabled={loading}
                                        className="bg-sky-500 text-white px-6 py-2 rounded-md hover:bg-sky-600 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        {loading ? "Enviando..." : "Enviar Email de Verificación"}
                                    </button>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">
                                    Se enviará un correo con un enlace para verificar tu dirección de email. 
                                    {user && !user.emailVerifiedAt && (
                                        <span className="text-yellow-600 font-medium block mt-1">⚠️ Tu email aún no está verificado.</span>
                                    )}
                                    {user && user.emailVerifiedAt && (
                                        <span className="text-green-600 font-medium block mt-1">✓ Tu email está verificado.</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Cambiar Contraseña */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">Cambiar Contraseña</h2>
                            {!showChangePassword && (
                                <button
                                    onClick={() => setShowChangePassword(true)}
                                    className="text-sky-500 hover:text-sky-600 font-medium"
                                >
                                    Cambiar Contraseña
                                </button>
                            )}
                        </div>

                        {showChangePassword && (
                            <form onSubmit={handleChangePassword} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Contraseña Actual <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.currentPassword}
                                        onChange={(e) =>
                                            setPasswordData({ ...passwordData, currentPassword: e.target.value })
                                        }
                                        placeholder="Ingresa tu contraseña actual"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nueva Contraseña <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) =>
                                            setPasswordData({ ...passwordData, newPassword: e.target.value })
                                        }
                                        placeholder="Mínimo 6 caracteres"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                        required
                                        minLength={6}
                                        disabled={loading}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirmar Nueva Contraseña <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) =>
                                            setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                                        }
                                        placeholder="Repetir nueva contraseña"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                <div className="flex justify-end gap-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowChangePassword(false);
                                            setPasswordData({
                                                currentPassword: "",
                                                newPassword: "",
                                                confirmPassword: "",
                                            });
                                            setError("");
                                        }}
                                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
                                        disabled={loading}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                                        disabled={loading}
                                    >
                                        {loading ? "Actualizando..." : "Actualizar Contraseña"}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}



