import { useState } from "react";
import useMedicSpecialties from "../../hooks/useMedicSpecialties.js";
import useLocalidades from "../../hooks/useLocalidades.js";
import usePlans from "../../hooks/usePlans.js";

export default function MedicalSearchForm({ onSearch, defaultPlan = "", defaultLocalidad = "" }) {
    const { specialties } = useMedicSpecialties();
    const { provincias, localidades, selectedProvincia, selectedLocalidad, setSelectedProvincia, setSelectedLocalidad } = useLocalidades();
    const { plans } = usePlans();
    
    const [selectedSpecialty, setSelectedSpecialty] = useState("");
    const [selectedPlan, setSelectedPlan] = useState(defaultPlan || "");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedSpecialty || !selectedLocalidad) {
            alert("Por favor, completá todos los campos requeridos");
            return;
        }
        onSearch({
            plan: selectedPlan,
            specialty: selectedSpecialty,
            localidad: selectedLocalidad,
        });
    };

    return (
        <section className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold text-sky-700 mb-4">
                Especialidades Médicas
            </h3>

            <form
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                onSubmit={handleSubmit}
            >
                {/* Plan */}
                <select
                    className="border rounded-md p-2 text-gray-700"
                    value={selectedPlan}
                    onChange={(e) => setSelectedPlan(e.target.value)}
                >
                    <option value="">Seleccioná plan (opcional)</option>
                    {plans.map((plan) => (
                        <option key={plan.id} value={plan.id}>
                            {plan.name}
                        </option>
                    ))}
                </select>

                {/* Especialidad */}
                <select
                    className="border rounded-md p-2 text-gray-700"
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    required
                >
                    <option value="">Seleccioná especialidad <span className="text-red-500">*</span></option>
                    {specialties.map((spec) => (
                        <option key={spec} value={spec}>
                            {spec}
                        </option>
                    ))}
                </select>

                {/* Provincia */}
                <select
                    className="border rounded-md p-2 text-gray-700"
                    value={selectedProvincia}
                    onChange={(e) => {
                        setSelectedProvincia(e.target.value);
                        setSelectedLocalidad(""); // Reset localidad al cambiar provincia
                    }}
                    required
                >
                    <option value="">Seleccioná provincia <span className="text-red-500">*</span></option>
                    {provincias.map((prov) => (
                        <option key={prov} value={prov}>
                            {prov}
                        </option>
                    ))}
                </select>

                {/* Localidad */}
                <select
                    className="border rounded-md p-2 text-gray-700"
                    value={selectedLocalidad}
                    onChange={(e) => setSelectedLocalidad(e.target.value)}
                    required
                    disabled={!selectedProvincia}
                >
                    <option value="">
                        {selectedProvincia ? "Seleccioná localidad *" : "Primero seleccioná una provincia"}
                    </option>
                    {localidades.map((loc) => (
                        <option key={loc} value={loc}>
                            {loc}
                        </option>
                    ))}
                </select>

                <div className="md:col-span-2">
                    <button
                        type="submit"
                        className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-md transition w-full md:w-auto"
                    >
                        Buscar
                    </button>
                </div>
            </form>
        </section>
    );
}
