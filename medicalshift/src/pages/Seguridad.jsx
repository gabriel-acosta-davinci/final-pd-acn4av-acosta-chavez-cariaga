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
            // El token podría venir del usuario, pero en Android se genera localmente
            // Por ahora lo dejamos vacío o podemos generar uno inicial
        }
    }, [user]);

    const handleEnviarCorreo = async () => {
        if (!emailRecuperacion || !emailRecuperacion.includes("@")) {
            setError("Ingresá un email válido");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSuccess("");
            await authService.recovery(emailRecuperacion);
            setSuccess(`Correo de recuperación enviado a ${emailRecuperacion}`);
        } catch (err) {
            console.error("Error enviando correo:", err);
            setError(err.message || "Error al enviar el correo de recuperación");
        } finally {
            setLoading(false);
        }
    };

    const handleGenerarToken = () => {
        // Generar token de 3 dígitos como en Android
        const nuevoToken = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
        setToken(nuevoToken);
        setSuccess(`Nuevo token generado: ${nuevoToken}`);
        // Aquí podrías guardar el token en el backend si es necesario
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
            setError("La nueva contraseña debe tener al menos 6 caracteres");
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        try {
            setLoading(true);
            await authService.updatePassword(passwordData.newPassword);
            setSuccess("Contraseña actualizada exitosamente");
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            setShowChangePassword(false);
        } catch (err) {
            console.error("Error actualizando contraseña:", err);
            setError(err.message || "Error al actualizar la contraseña");
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
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Token de Seguridad</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Token Actual
                                </label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="text"
                                        value={token}
                                        readOnly
                                        placeholder="No generado"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 font-mono text-lg"
                                    />
                                    <button
                                        onClick={handleGenerarToken}
                                        className="bg-sky-500 text-white px-6 py-2 rounded-md hover:bg-sky-600 font-medium"
                                    >
                                        Generar Token
                                    </button>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">
                                    El token es un código de seguridad de 3 dígitos que puedes usar para verificación adicional.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Recuperación de Contraseña */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recuperación de Contraseña</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email de Recuperación
                                </label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="email"
                                        value={emailRecuperacion}
                                        onChange={(e) => setEmailRecuperacion(e.target.value)}
                                        placeholder="tu@email.com"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                    />
                                    <button
                                        onClick={handleEnviarCorreo}
                                        disabled={loading}
                                        className="bg-sky-500 text-white px-6 py-2 rounded-md hover:bg-sky-600 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        {loading ? "Enviando..." : "Enviar Correo"}
                                    </button>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">
                                    Se enviará un correo con instrucciones para recuperar tu contraseña.
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
                                        placeholder="Repetir contraseña"
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



