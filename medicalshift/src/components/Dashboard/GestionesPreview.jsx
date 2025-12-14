import { useNavigate } from "react-router-dom";

export default function GestionesPreview({ gestiones, loading, onViewAll }) {
    const navigate = useNavigate();

    const getEstadoColor = (estado) => {
        switch (estado?.toLowerCase()) {
            case "pendiente":
                return "bg-yellow-100 text-yellow-800";
            case "aprobada":
            case "aprobado":
                return "bg-green-100 text-green-800";
            case "rechazada":
            case "rechazado":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Fecha no disponible";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("es-AR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            });
        } catch {
            return dateString;
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Últimas Gestiones</h3>
                <button
                    onClick={onViewAll}
                    className="text-sky-500 hover:text-sky-600 font-medium text-sm"
                >
                    Ver todas →
                </button>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse">
                            <div className="h-16 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>
            ) : gestiones && gestiones.length > 0 ? (
                <div className="space-y-3">
                    {gestiones.map((gestion) => (
                        <div
                            key={gestion.id || gestion._id}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => navigate("/dashboard/gestiones")}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 mb-1">
                                        {gestion.nombre || "Gestión sin nombre"}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        {formatDate(gestion.fecha)}
                                    </p>
                                </div>
                                {gestion.estado && (
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(
                                            gestion.estado
                                        )}`}
                                    >
                                        {gestion.estado}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500">
                    <svg
                        className="w-12 h-12 mx-auto mb-4 text-gray-400"
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
                    <p>No hay gestiones recientes</p>
                    <button
                        onClick={() => navigate("/dashboard/gestiones/nueva")}
                        className="mt-4 text-sky-500 hover:text-sky-600 font-medium"
                    >
                        Crear primera gestión
                    </button>
                </div>
            )}
        </div>
    );
}



