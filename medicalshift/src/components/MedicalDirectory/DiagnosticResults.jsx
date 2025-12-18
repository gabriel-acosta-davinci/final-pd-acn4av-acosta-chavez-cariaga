import { useState, useEffect } from "react";
import cartillaService from "../../services/cartillaService";
import GoogleMapEmbed from "./GoogleMapEmbed";

export default function DiagnosticResults({ filters }) {
    const { specialty, localidad, plan } = filters;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedAddress, setSelectedAddress] = useState(null);

    useEffect(() => {
        const loadProviders = async () => {
            if (!specialty || !localidad) {
                setData(null);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await cartillaService.getProvidersGrouped('diagnostic', localidad, plan);
                const providers = response[localidad]?.[specialty] || null;
                setData(providers);
            } catch (error) {
                console.error("Error cargando providers:", error);
                setData(null);
            } finally {
                setLoading(false);
            }
        };

        loadProviders();
    }, [specialty, localidad, plan]);

    if (loading) {
        return (
            <div className="mt-12 text-center text-gray-500">
                Cargando...
            </div>
        );
    }

    if (!data || (Array.isArray(data) && data.length === 0)) {
        return (
            <div className="mt-12 text-center text-gray-500">
                No se encontraron resultados
            </div>
        );
    }

    if (typeof data === "string") {
        return (
            <div className="mt-12 text-center text-gray-500">
                {data}
            </div>
        );
    }

    const fullAddress = selectedAddress 
        ? `${selectedAddress.direccion}, ${localidad}`
        : null;

    return (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
            {/* Cards */}
            <div className="space-y-6">
                {data.map((item, i) => (
                    <div
                        key={i}
                        className={`border rounded-lg p-6 shadow-sm bg-white hover:shadow-md transition ${
                            selectedAddress === item ? 'border-sky-500 ring-2 ring-sky-200' : 'border-gray-200'
                        }`}
                    >
                        <h4 className="text-lg font-semibold text-sky-700 mb-2">
                            {item.nombre}
                        </h4>
                        <p className="text-gray-700">{item.direccion}</p>
                        <p className="text-gray-700">{localidad}</p>
                        <p className="text-sm text-gray-500 mt-1">Tel: {item.telefono}</p>
                        <button 
                            onClick={() => setSelectedAddress(item)}
                            className="mt-4 text-sm text-sky-500 hover:underline"
                        >
                            Ver en mapa
                        </button>
                    </div>
                ))}
            </div>

            {/* Mapa */}
            <div className="sticky top-4">
                <GoogleMapEmbed 
                    query={localidad}
                    address={fullAddress}
                    height={600}
                />
            </div>
        </section>
    );
}
