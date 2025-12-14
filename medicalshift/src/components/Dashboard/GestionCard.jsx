export default function GestionCard({ gestion }) {
    const getEstadoColor = (estado) => {
        switch (estado?.toLowerCase()) {
            case "pendiente":
                return "bg-yellow-100 text-yellow-800 border-yellow-300";
            case "aprobada":
            case "aprobado":
                return "bg-green-100 text-green-800 border-green-300";
            case "rechazada":
            case "rechazado":
                return "bg-red-100 text-red-800 border-red-300";
            default:
                return "bg-gray-100 text-gray-800 border-gray-300";
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
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {gestion.nombre || "Gestión sin nombre"}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{formatDate(gestion.fecha)}</span>
                        </div>
                    </div>
                </div>
                {gestion.estado && (
                    <span
                        className={`px-4 py-2 rounded-full text-sm font-medium border ${getEstadoColor(
                            gestion.estado
                        )}`}
                    >
                        {gestion.estado}
                    </span>
                )}
            </div>
        </div>
    );
}



