import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import gestionService from "../services/gestionService";
import DashboardHeader from "../components/Dashboard/DashboardHeader";
import GestionCard from "../components/Dashboard/GestionCard";

export default function Gestiones() {
    const { isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();
    const [gestiones, setGestiones] = useState([]);
    const [loadingGestiones, setLoadingGestiones] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate("/Login");
        }
    }, [loading, isAuthenticated, navigate]);

    useEffect(() => {
        if (isAuthenticated) {
            loadGestiones();
        }
    }, [isAuthenticated]);

    const loadGestiones = async () => {
        try {
            setLoadingGestiones(true);
            setError("");
            const response = await gestionService.list({ limit: 20 });
            if (response.gestiones) {
                setGestiones(response.gestiones);
            } else {
                setGestiones([]);
            }
        } catch (error) {
            console.error("Error cargando gestiones:", error);
            setError("Error al cargar las gestiones. Por favor, intenta nuevamente.");
            setGestiones([]);
        } finally {
            setLoadingGestiones(false);
        }
    };

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
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Mis Gestiones</h1>
                    <button
                        onClick={() => navigate("/dashboard/gestiones/nueva")}
                        className="bg-sky-500 text-white px-6 py-2 rounded-lg hover:bg-sky-600 font-medium flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Nueva Gestión
                    </button>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {loadingGestiones ? (
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : gestiones && gestiones.length > 0 ? (
                    <div className="space-y-4">
                        {gestiones.map((gestion) => (
                            <GestionCard key={gestion.id || gestion._id} gestion={gestion} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                        <svg
                            className="w-16 h-16 mx-auto mb-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No tienes gestiones aún
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Crea tu primera gestión para comenzar
                        </p>
                        <button
                            onClick={() => navigate("/dashboard/gestiones/nueva")}
                            className="bg-sky-500 text-white px-6 py-3 rounded-lg hover:bg-sky-600 font-medium"
                        >
                            Crear Primera Gestión
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}



