import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import DashboardHeader from "../components/Dashboard/DashboardHeader";
import PerfilOption from "../components/Dashboard/PerfilOption";

export default function Perfil() {
    const { user, isAuthenticated, loading, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate("/Login");
        }
    }, [loading, isAuthenticated, navigate]);

    const handleLogout = () => {
        logout();
        navigate("/Login");
    };

    const opciones = [
        {
            id: "mis-datos",
            titulo: "Mis Datos",
            descripcion: "Ver y editar tu información personal",
            icono: "user",
            onClick: () => navigate("/dashboard/perfil/mis-datos"),
        },
        {
            id: "seguridad",
            titulo: "Seguridad",
            descripcion: "Cambiar contraseña y configuración de seguridad",
            icono: "lock",
            onClick: () => navigate("/dashboard/perfil/seguridad"),
        },
        {
            id: "documentos",
            titulo: "Mis Documentos",
            descripcion: "Ver y gestionar tus documentos",
            icono: "document",
            onClick: () => navigate("/dashboard/perfil/documentos"),
        },
        {
            id: "reintegros",
            titulo: "Cuenta de Reintegro",
            descripcion: "Gestionar tus reintegros",
            icono: "money",
            onClick: () => navigate("/dashboard/perfil/reintegros"),
        },
        {
            id: "facturas",
            titulo: "Ver Facturas / Pagar",
            descripcion: "Ver y pagar tus facturas",
            icono: "card",
            onClick: () => navigate("/dashboard/perfil/facturas"),
        },
        {
            id: "resumen",
            titulo: "Resumen de Cuenta / Pagos",
            descripcion: "Ver historial de pagos y resumen de cuenta",
            icono: "chart",
            onClick: () => navigate("/dashboard/perfil/resumen"),
        },
    ];

    if (loading || !isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <DashboardHeader />
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Perfil</h1>
                    <p className="text-gray-600">
                        Gestiona tu información y configuración
                    </p>
                </div>

                {/* Información del usuario */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-sky-100 rounded-full p-4">
                            <svg className="w-8 h-8 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                {user?.name || user?.email || "Usuario"}
                            </h2>
                            <p className="text-gray-600">{user?.email}</p>
                            {user?.associateNumber && (
                                <p className="text-sm text-gray-500">
                                    Asociado: {user.associateNumber}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Opciones del perfil */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {opciones.map((opcion) => (
                        <PerfilOption key={opcion.id} {...opcion} />
                    ))}
                </div>

                {/* Botón de cerrar sesión */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 font-medium flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </div>
    );
}

