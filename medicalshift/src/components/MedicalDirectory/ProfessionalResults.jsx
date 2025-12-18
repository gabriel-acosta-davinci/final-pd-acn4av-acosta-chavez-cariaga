import { useState, useEffect } from "react";
import cartillaService from "../../services/cartillaService";
import GoogleMapEmbed from "./GoogleMapEmbed";

export default function ProfessionalResults({ filters }) {
    const { specialty, localidad, nombre, plan } = filters;
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAddress, setSelectedAddress] = useState(null);

    useEffect(() => {
        const loadProfessionals = async () => {
            if (!specialty || !localidad) {
                setResults([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await cartillaService.searchProfessionals({
                    specialty,
                    localidad,
                    nombre: nombre || undefined,
                    plan: plan || undefined,
                });
                setResults(response.professionals || []);
            } catch (error) {
                console.error("Error cargando profesionales:", error);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        loadProfessionals();
    }, [specialty, localidad, nombre, plan]);

    if (loading) {
        return (
            <div className="mt-12 text-center text-gray-500">
                Cargando...
            </div>
        );
    }

    if (results.length === 0) {
        return (
            <div className="mt-12 text-center text-gray-500">
                No se encontraron profesionales que coincidan con tu búsqueda.
            </div>
        );
    }

    const fullAddress = selectedAddress 
        ? `${selectedAddress.direccion}, ${selectedAddress.localidad}`
        : null;

    return (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
            <div className="space-y-6">
                {results.map((item, i) => (
                    <div
                        key={i}
                        className={`border rounded-lg p-6 shadow-sm bg-white hover:shadow-md transition ${
                            selectedAddress === item ? 'border-sky-500 ring-2 ring-sky-200' : 'border-gray-200'
                        }`}
                    >
                        <h4 className="text-lg font-semibold text-sky-700 mb-2">
                            {item.nombre}
                        </h4>
                        <p className="text-gray-700">{item.especialidad}</p>
                        <p className="text-gray-700">{item.institucion}</p>
                        <p className="text-gray-700">{item.direccion}</p>
                        <p className="text-gray-700">{item.localidad}</p>
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
