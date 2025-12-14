import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import facturaService from "../services/facturaService";
import DashboardHeader from "../components/Dashboard/DashboardHeader";

export default function VerFacturas() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [facturas, setFacturas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate("/Login");
        }
    }, [authLoading, isAuthenticated, navigate]);

    useEffect(() => {
        if (isAuthenticated) {
            loadFacturasPendientes();
        }
    }, [isAuthenticated]);

    const loadFacturasPendientes = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await facturaService.list({ estado: "Pendiente", limit: 50 });
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

    const handlePagar = (factura) => {
        // Abrir MercadoPago en nueva pestaña (como en Android)
        window.open("https://www.mercadopago.com.ar", "_blank");
    };

    const formatMonto = (monto) => {
        if (!monto && monto !== 0) return "$0.00";
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            minimumFractionDigits: 2,
        }).format(monto);
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <DashboardHeader />
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Ver Facturas / Pagar</h1>
                    <p className="text-gray-600">Gestiona y paga tus facturas pendientes</p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {facturas && facturas.length > 0 ? (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Facturas Pendientes ({facturas.length})
                            </h2>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {facturas.map((factura) => (
                                <FacturaCard
                                    key={factura.id || factura._id}
                                    factura={factura}
                                    onPagar={handlePagar}
                                    formatMonto={formatMonto}
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
                            No tenés facturas pendientes de pago
                        </h3>
                        <p className="text-gray-600">
                            Todas tus facturas están al día.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

function FacturaCard({ factura, onPagar, formatMonto }) {
    const estado = factura.estado || "Pendiente";
    const isPendiente = estado.toLowerCase() === "pendiente";

    return (
        <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 text-sky-500"
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
                                <span className="text-gray-400">•</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    isPendiente
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-green-100 text-green-800"
                                }`}>
                                    {estado}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                {isPendiente && (
                    <div className="flex-shrink-0 ml-4">
                        <button
                            onClick={() => onPagar(factura)}
                            className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 font-medium flex items-center gap-2 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                />
                            </svg>
                            Pagar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}



