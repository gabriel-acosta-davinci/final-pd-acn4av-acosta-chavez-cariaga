import { useState, useEffect } from "react";
import cartillaService from "../services/cartillaService";

export default function useInpatientSpecialties() {
    const [specialties, setSpecialties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSpecialties = async () => {
            try {
                const response = await cartillaService.getSpecialties('inpatient');
                const specialtiesList = response.specialties || [];
                setSpecialties(specialtiesList.map(s => s.nombre));
                setLoading(false);
            } catch (error) {
                console.error("Error cargando especialidades de internación:", error);
                setLoading(false);
            }
        };

        loadSpecialties();
    }, []);

    return { specialties, loading };
}
