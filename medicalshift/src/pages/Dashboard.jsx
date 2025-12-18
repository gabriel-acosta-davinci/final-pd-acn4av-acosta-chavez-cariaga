import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import gestionService from "../services/gestionService";
import DashboardHeader from "../components/Dashboard/DashboardHeader";
import UserCard from "../components/Dashboard/UserCard";
import GestionesPreview from "../components/Dashboard/GestionesPreview";
import CartillaSearch from "../components/Dashboard/CartillaSearch";

export default function Dashboard() {
    const { user, isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();
    const [gestiones, setGestiones] = useState([]);
    const [loadingGestiones, setLoadingGestiones] = useState(true);

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
            const response = await gestionService.list({ limit: 3 });
            if (response.gestiones) {
                setGestiones(response.gestiones);
            }
        } catch (error) {
            console.error("Error cargando gestiones:", error);
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
                {/* Saludo personalizado */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {getGreeting()}, {user?.name?.split(" ")[0] || "Usuario"}!
                    </h1>
                    <p className="text-gray-600 mt-2">{getTimeMessage()}</p>
                </div>

                {/* Tarjeta de usuario */}
                <div className="mb-8">
                    <UserCard user={user} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Preview de gestiones */}
                    <div>
                        <GestionesPreview 
                            gestiones={gestiones} 
                            loading={loadingGestiones}
                            onViewAll={() => navigate("/dashboard/gestiones")}
                        />
                    </div>

                    {/* Búsqueda de cartilla */}
                    <div>
                        <CartillaSearch onViewAll={() => navigate("/MedicalDirectory")} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function getGreeting() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return "Buenos días";
    if (hour >= 12 && hour < 18) return "Buenas tardes";
    if (hour >= 18 && hour < 22) return "Buenas noches";
    return "Buenas noches";
}

function getTimeMessage() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return "Que tengas una excelente mañana";
    if (hour >= 12 && hour < 18) return "¡Buena tarde!";
    if (hour >= 18 && hour < 22) return "Disfrutá tu noche";
    return "Es hora de descansar";
}

