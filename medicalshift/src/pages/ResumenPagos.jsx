import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import facturaService from "../services/facturaService";
import DashboardHeader from "../components/Dashboard/DashboardHeader";

export default function ResumenPagos() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [facturas, setFacturas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filterEstado, setFilterEstado] = useState(""); // "" = todas, "Pendiente", "Pagada"

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate("/Login");
        }
    }, [authLoading, isAuthenticated, navigate]);

    useEffect(() => {
        if (isAuthenticated) {
            loadFacturas();
        }
    }, [isAuthenticated, filterEstado]);

    const loadFacturas = async () => {
        try {
            setLoading(true);
            setError("");
            const filters = { limit: 100 };
            if (filterEstado) {
                filters.estado = filterEstado;
            }
            const response = await facturaService.list(filters);
            if (response.facturas) {
                setFacturas(response.facturas);
            } else {
                setFacturas([]);
            }
        } catch (err) {
            console.error("Error cargando facturas:", err);
            setError("Error al cargar las facturas. Por favor, intenta nuevamente.");
            setFacturas([]);
        } finally {
            setLoading(false);
        }
    };

    const formatMonto = (monto) => {
        if (!monto && monto !== 0) return "$0.00";
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            minimumFractionDigits: 2,
        }).format(monto);
    };

    const getEstadoColor = (estado) => {
        switch (estado?.toLowerCase()) {
            case "pendiente":
                return "bg-yellow-100 text-yellow-800 border-yellow-300";
            case "pagada":
                return "bg-green-100 text-green-800 border-green-300";
            default:
                return "bg-gray-100 text-gray-800 border-gray-300";
        }
    };

    // Calcular totales
    const totalPendiente = facturas
        .filter((f) => f.estado?.toLowerCase() === "pendiente")
        .reduce((sum, f) => sum + (f.monto || 0), 0);
    
    const totalPagado = facturas
        .filter((f) => f.estado?.toLowerCase() === "pagada")
        .reduce((sum, f) => sum + (f.monto || 0), 0);

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <DashboardHeader />
            
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Resumen de Cuenta / Pagos</h1>
                    <p className="text-gray-600">Historial completo de tus facturas y pagos</p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {/* Resumen de Totales */}
                {facturas.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="text-sm font-medium text-gray-500 mb-1">Total Facturas</div>
                            <div className="text-2xl font-bold text-gray-900">{facturas.length}</div>
                        </div>
                        <div className="bg-yellow-50 rounded-xl shadow-md p-6 border border-yellow-200">
                            <div className="text-sm font-medium text-yellow-700 mb-1">Pendiente</div>
                            <div className="text-2xl font-bold text-yellow-900">{formatMonto(totalPendiente)}</div>
                        </div>
                        <div className="bg-green-50 rounded-xl shadow-md p-6 border border-green-200">
                            <div className="text-sm font-medium text-green-700 mb-1">Pagado</div>
                            <div className="text-2xl font-bold text-green-900">{formatMonto(totalPagado)}</div>
                        </div>
                    </div>
                )}

                {/* Filtros */}
                <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                    <div className="flex items-center gap-4">
                        <label className="text-sm font-medium text-gray-700">Filtrar por estado:</label>
                        <select
                            value={filterEstado}
                            onChange={(e) => setFilterEstado(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        >
                            <option value="">Todas</option>
                            <option value="Pendiente">Pendientes</option>
                            <option value="Pagada">Pagadas</option>
                        </select>
                    </div>
                </div>

                {/* Lista de Facturas */}
                {facturas && facturas.length > 0 ? (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Historial de Facturas ({facturas.length})
                            </h2>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {facturas.map((factura) => (
                                <FacturaResumenCard
                                    key={factura.id || factura._id}
                                    factura={factura}
                                    formatMonto={formatMonto}
                                    getEstadoColor={getEstadoColor}
                                />
                            ))}
                        </div>
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
                            No tenés facturas en tu historial
                        </h3>
                        <p className="text-gray-600">
                            {filterEstado 
                                ? `No se encontraron facturas con estado "${filterEstado}"`
                                : "Aún no tenés facturas registradas."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

function FacturaResumenCard({ factura, formatMonto, getEstadoColor }) {
    const estado = factura.estado || "Sin estado";
    const isPendiente = estado.toLowerCase() === "pendiente";

    return (
        <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                isPendiente ? "bg-yellow-100" : "bg-green-100"
                            }`}>
                                <svg
                                    className={`w-6 h-6 ${isPendiente ? "text-yellow-600" : "text-green-600"}`}
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
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-base font-semibold text-gray-900">
                                Período: {factura.periodo || "No especificado"}
                            </h3>
                            <div className="mt-1 flex items-center gap-4 text-sm">
                                <span className="text-gray-600">
                                    Monto: <span className="font-semibold text-gray-900">{formatMonto(factura.monto)}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-shrink-0 ml-4">
                    <span
                        className={`px-4 py-2 rounded-full text-sm font-medium border ${getEstadoColor(estado)}`}
                    >
                        {estado}
                    </span>
                </div>
            </div>
        </div>
    );
}



