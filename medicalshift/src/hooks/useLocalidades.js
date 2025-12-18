import { useState, useEffect } from "react";
import cartillaService from "../services/cartillaService";

export default function useLocalidades() {
    const [provincias, setProvincias] = useState([]);
    const [localidades, setLocalidades] = useState([]);
    const [selectedProvincia, setSelectedProvincia] = useState("");
    const [selectedLocalidad, setSelectedLocalidad] = useState("");
    const [localidadesPorProvincia, setLocalidadesPorProvincia] = useState({});
    const [loading, setLoading] = useState(true);

    // Cargar provincias al montar
    useEffect(() => {
        const loadProvinces = async () => {
            try {
                const response = await cartillaService.getProvinces();
                const provincesList = response.provinces || [];
                setProvincias(provincesList.map(p => p.nombre));

                // Cargar todas las localidades para construir el objeto localidadesPorProvincia
                const localidadesResponse = await cartillaService.getLocalidades();
                const allLocalidades = localidadesResponse.localidades || [];
                
                // Agrupar por provincia
                const grouped = {};
                provincesList.forEach(province => {
                    const provLocalidades = allLocalidades
                        .filter(loc => loc.province_id === province.id)
                        .map(loc => loc.nombre);
                    grouped[province.nombre] = provLocalidades;
                });
                setLocalidadesPorProvincia(grouped);
                setLoading(false);
            } catch (error) {
                console.error("Error cargando provincias:", error);
                setLoading(false);
            }
        };

        loadProvinces();
    }, []);

    // Cargar localidades cuando se selecciona una provincia
    useEffect(() => {
        if (selectedProvincia && localidadesPorProvincia[selectedProvincia]) {
            setLocalidades(localidadesPorProvincia[selectedProvincia] || []);
            setSelectedLocalidad("");
        } else {
            setLocalidades([]);
        }
    }, [selectedProvincia, localidadesPorProvincia]);

    return {
        localidadesPorProvincia, // para ContactForm
        provincias,              // para MedicalSearchForm
        localidades,
        selectedProvincia,
        selectedLocalidad,
        setSelectedProvincia,
        setSelectedLocalidad,
        loading,
    };
}
