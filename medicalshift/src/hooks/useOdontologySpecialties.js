import { useState, useEffect } from "react";
import cartillaService from "../services/cartillaService";

export default function useOdontologySpecialties() {
    const [specialties, setSpecialties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSpecialties = async () => {
            try {
                const response = await cartillaService.getSpecialties('odontology');
                const specialtiesList = response.specialties || [];
                setSpecialties(specialtiesList.map(s => s.nombre));
                setLoading(false);
            } catch (error) {
                console.error("Error cargando especialidades de odontología:", error);
                setLoading(false);
            }
        };

        loadSpecialties();
    }, []);

    return { specialties, loading };
}
