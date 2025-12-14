import { useState, useEffect } from "react";
import userService from "../../services/userService";
import useLocalidades from "../../hooks/useLocalidades";

export default function EditarDatosModal({ user, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        phoneNumber: "",
        email: "",
        maritalStatus: "",
        street: "",
        number: "",
        floor: "",
        apartment: "",
        city: "",
        province: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { provincias, localidades, selectedProvincia, selectedLocalidad, setSelectedProvincia, setSelectedLocalidad } = useLocalidades();

    useEffect(() => {
        if (user) {
            setFormData({
                phoneNumber: user.phoneNumber || "",
                email: user.email || "",
                maritalStatus: user.maritalStatus || "",
                street: user.address?.street || "",
                number: user.address?.number || "",
                floor: user.address?.floor || "",
                apartment: user.address?.apartment || "",
                city: user.address?.city || "",
                province: user.address?.province || "",
            });
            // Establecer provincia y localidad si existen
            if (user.address?.province) {
                setSelectedProvincia(user.address.province);
            }
            if (user.address?.city) {
                setSelectedLocalidad(user.address.city);
            }
        }
    }, [user, setSelectedProvincia, setSelectedLocalidad]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Validar campos obligatorios
        if (!formData.phoneNumber || !formData.email || !formData.street || !formData.number || !formData.city || !selectedProvincia) {
            setError("Por favor, completá todos los campos obligatorios");
            setLoading(false);
            return;
        }

        // Validar número
        const number = parseInt(formData.number);
        if (isNaN(number) || number <= 0) {
            setError("El número debe ser un valor numérico válido");
            setLoading(false);
            return;
        }

        try {
            const updateData = {
                phoneNumber: formData.phoneNumber,
                email: formData.email,
                maritalStatus: formData.maritalStatus,
                street: formData.street,
                number: number,
                floor: formData.floor || null,
                apartment: formData.apartment || null,
                city: formData.city || selectedLocalidad,
                province: selectedProvincia,
            };

            await userService.updateCurrentUser(updateData);
            onSuccess();
        } catch (err) {
            console.error("Error actualizando usuario:", err);
            setError(err.message || "Error al actualizar los datos. Por favor, intenta nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Editar Datos</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                        disabled={loading}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    {/* Información de Contacto */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Contacto</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Teléfono <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Estado Civil
                                </label>
                                <input
                                    type="text"
                                    name="maritalStatus"
                                    value={formData.maritalStatus}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Domicilio */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Domicilio</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Calle <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="street"
                                    value={formData.street}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Número <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="number"
                                    value={formData.number}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Piso</label>
                                <input
                                    type="text"
                                    name="floor"
                                    value={formData.floor}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                    disabled={loading}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                                <input
                                    type="text"
                                    name="apartment"
                                    value={formData.apartment}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                    disabled={loading}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Provincia <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={selectedProvincia}
                                    onChange={(e) => setSelectedProvincia(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                    required
                                    disabled={loading}
                                >
                                    <option value="">Seleccionar provincia</option>
                                    {provincias.map((prov) => (
                                        <option key={prov} value={prov}>
                                            {prov}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Localidad <span className="text-red-500">*</span>
                                </label>
                                {selectedProvincia ? (
                                    <select
                                        value={selectedLocalidad || formData.city}
                                        onChange={(e) => {
                                            setSelectedLocalidad(e.target.value);
                                            setFormData((prev) => ({ ...prev, city: e.target.value }));
                                        }}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                        required
                                        disabled={loading}
                                    >
                                        <option value="">Seleccionar localidad</option>
                                        {localidades.map((loc) => (
                                            <option key={loc} value={loc}>
                                                {loc}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                        required
                                        disabled={loading}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end gap-4 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? "Guardando..." : "Guardar Cambios"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}



