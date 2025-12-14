import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import DashboardHeader from "../components/Dashboard/DashboardHeader";
import OncologiaModal from "../components/Gestiones/OncologiaModal";
import DiabetesModal from "../components/Gestiones/DiabetesModal";
import CronicasModal from "../components/Gestiones/CronicasModal";
import AutorizacionModal from "../components/Gestiones/AutorizacionModal";

export default function Medicamentos() {
    const { isAuthenticated, loading, user } = useAuth();
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [modalAbierto, setModalAbierto] = useState(null);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate("/Login");
        }
    }, [loading, isAuthenticated, navigate]);

    useEffect(() => {
        if (user) {
            setUserName(user.fullName || user.name || "Usuario");
        }
    }, [user]);

    const opciones = [
        {
            id: "oncologia",
            nombre: "Oncología",
            onClick: () => setModalAbierto("oncologia"),
        },
        {
            id: "diabetes",
            nombre: "Programa Diabetes",
            onClick: () => setModalAbierto("diabetes"),
        },
        {
            id: "cronicas",
            nombre: "Programa Patologías Crónicas",
            onClick: () => setModalAbierto("cronicas"),
        },
        {
            id: "autorizacion",
            nombre: "Medicamentos con autorización previa",
            onClick: () => setModalAbierto("autorizacion"),
        },
    ];

    const cerrarModal = () => {
        setModalAbierto(null);
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
                <div className="mb-6">
                    <button
                        onClick={() => navigate("/dashboard/gestiones/nueva")}
                        className="text-sky-600 hover:text-sky-700 font-medium flex items-center gap-2 mb-4"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Volver
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Medicamentos</h1>
                    <p className="text-gray-600 mt-2">Selecciona el tipo de medicamento que necesitas gestionar</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {opciones.map((opcion) => (
                        <button
                            key={opcion.id}
                            onClick={opcion.onClick}
                            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow text-left"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {opcion.nombre}
                                </h3>
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {modalAbierto === "oncologia" && (
                <OncologiaModal
                    userName={userName}
                    onClose={cerrarModal}
                    onSuccess={() => {
                        cerrarModal();
                        navigate("/dashboard/gestiones");
                    }}
                />
            )}
            {modalAbierto === "diabetes" && (
                <DiabetesModal
                    userName={userName}
                    onClose={cerrarModal}
                    onSuccess={() => {
                        cerrarModal();
                        navigate("/dashboard/gestiones");
                    }}
                />
            )}
            {modalAbierto === "cronicas" && (
                <CronicasModal
                    userName={userName}
                    onClose={cerrarModal}
                    onSuccess={() => {
                        cerrarModal();
                        navigate("/dashboard/gestiones");
                    }}
                />
            )}
            {modalAbierto === "autorizacion" && (
                <AutorizacionModal
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



