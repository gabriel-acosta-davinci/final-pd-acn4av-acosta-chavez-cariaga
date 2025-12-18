import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import DashboardHeader from "../components/Dashboard/DashboardHeader";
import CeliaquiaModal from "../components/Gestiones/CeliaquiaModal";

export default function Celiaquia() {
    const { isAuthenticated, loading, user } = useAuth();
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [modalAbierto, setModalAbierto] = useState(true);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate("/Login");
        }
    }, [loading, isAuthenticated, navigate]);

    useEffect(() => {
        if (user) {
            setUserName(user.name || "Usuario");
        }
    }, [user]);

    const cerrarModal = () => {
        setModalAbierto(false);
        navigate("/dashboard/gestiones/nueva");
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
            
            {modalAbierto && (
                <CeliaquiaModal
                    userName={userName}
                    onClose={cerrarModal}
                    onSuccess={() => {
                        cerrarModal();
                        navigate("/dashboard/gestiones");
                    }}
                />
            )}
        </div>
    );
}



