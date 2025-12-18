import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import userService from "../services/userService";
import DashboardHeader from "../components/Dashboard/DashboardHeader";
import EditarDatosModal from "../components/Dashboard/EditarDatosModal";

export default function MisDatos() {
    const { user: authUser, isAuthenticated, loading: authLoading, updateUser } = useAuth();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate("/Login");
        }
    }, [authLoading, isAuthenticated, navigate]);

    useEffect(() => {
        if (isAuthenticated) {
            loadUserData();
        }
    }, [isAuthenticated]);

    const loadUserData = async () => {
        try {
            setLoading(true);
            setError("");
            const userData = await userService.getCurrentUser();
            if (userData) {
                setUser(userData);
                // Actualizar también en el contexto
                updateUser(userData);
            }
        } catch (err) {
            console.error("Error cargando datos del usuario:", err);
            // Solo mostrar error si realmente falló y no hay datos del contexto
            if (!authUser) {
                setError("Error al cargar los datos del usuario");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEditSuccess = () => {
        setShowEditModal(false);
        loadUserData(); // Recargar datos después de editar
    };

    if (authLoading || loading) {
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

    const displayUser = user || authUser;

    // Formatear fecha de nacimiento
    const formatDateOfBirth = (dateOfBirth) => {
        if (!dateOfBirth) return "No especificada";
        try {
            // Si viene como objeto con _seconds (Firebase timestamp)
            if (dateOfBirth._seconds) {
                const date = new Date(dateOfBirth._seconds * 1000);
                return date.toLocaleDateString("es-AR");
            }
            // Si viene como string (formato ISO o Y-m-d)
            if (typeof dateOfBirth === "string") {
                const date = new Date(dateOfBirth);
                if (!isNaN(date.getTime())) {
                    return date.toLocaleDateString("es-AR");
                }
                return dateOfBirth;
            }
            return "No especificada";
        } catch {
            return "No especificada";
        }
    };

    // Formatear domicilio completo
    const formatAddress = (address) => {
        if (!address) return "No especificado";
        const parts = [];
        if (address.street) parts.push(address.street);
        if (address.number) parts.push(address.number);
        if (address.floor) parts.push(`Piso ${address.floor}`);
        if (address.apartment) parts.push(`Dpto ${address.apartment}`);
        if (address.city) parts.push(address.city);
        if (address.province) parts.push(address.province);
        return parts.length > 0 ? parts.join(", ") : "No especificado";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <DashboardHeader />
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Datos</h1>
                        <p className="text-gray-600">Gestiona tu información personal</p>
                    </div>
                    <button
                        onClick={() => setShowEditModal(true)}
                        className="bg-sky-500 text-white px-6 py-2 rounded-lg hover:bg-sky-600 font-medium flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Editar Datos
                    </button>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
                    {/* Información Personal */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Información Personal</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Nombre Completo</label>
                                <p className="text-gray-900 mt-1">
                                    {displayUser?.name || displayUser?.email || "No especificado"}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Número de Documento</label>
                                <p className="text-gray-900 mt-1">{displayUser?.documentNumber || "No especificado"}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Fecha de Nacimiento</label>
                                <p className="text-gray-900 mt-1">{formatDateOfBirth(displayUser?.dateOfBirth)}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Estado Civil</label>
                                <p className="text-gray-900 mt-1">{displayUser?.maritalStatus || "No especificado"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Información de Contacto */}
                    <div className="border-t pt-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Información de Contacto</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Email</label>
                                <p className="text-gray-900 mt-1">{displayUser?.email || "No especificado"}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Teléfono</label>
                                <p className="text-gray-900 mt-1">{displayUser?.phoneNumber || "No especificado"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Domicilio */}
                    <div className="border-t pt-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Domicilio</h2>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Domicilio de Residencia</label>
                            <p className="text-gray-900 mt-1">{formatAddress(displayUser?.address)}</p>
                        </div>
                    </div>

                    {/* Información de Plan */}
                    <div className="border-t pt-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Información del Plan</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Plan</label>
                                <p className="text-gray-900 mt-1">{displayUser?.plan || "No especificado"}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Número de Asociado</label>
                                <p className="text-gray-900 mt-1">{displayUser?.associateNumber || "No especificado"}</p>
                            </div>
                            {displayUser?.cbu && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500">CBU</label>
                                    <p className="text-gray-900 mt-1">{displayUser.cbu}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showEditModal && (
                <EditarDatosModal
                    user={displayUser}
                    onClose={() => setShowEditModal(false)}
                    onSuccess={handleEditSuccess}
                />
            )}
        </div>
    );
}

