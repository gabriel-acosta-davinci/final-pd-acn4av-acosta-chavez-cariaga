import { useState, useRef } from "react";
import { crearGestionYSubirArchivo } from "../../utils/gestionHelper";

export default function ReintegrosModal({ userName, userCBU, onClose, onSuccess }) {
    const [tipoSeleccionado, setTipoSeleccionado] = useState("Reintegros Generales");
    const [archivos, setArchivos] = useState([null, null, null]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const fileInputRefs = useRef([]);

    const tipos = ["Reintegros Generales", "Reintegros Odontología", "Subsidio Fallecimiento y Sepelio"];

    const handleFileChange = (index, event) => {
        const file = event.target.files[0];
        if (file) {
            const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
            if (!allowedTypes.includes(file.type)) {
                setError('Formato de archivo no permitido. Formatos permitidos: PDF, PNG, JPG');
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                setError('El archivo es demasiado grande (máximo 10MB)');
                return;
            }
            const newArchivos = [...archivos];
            newArchivos[index] = file;
            setArchivos(newArchivos);
            setError("");
        }
    };

    const handleRemoveFile = (index) => {
        const newArchivos = [...archivos];
        newArchivos[index] = null;
        setArchivos(newArchivos);
        if (fileInputRefs.current[index]) {
            fileInputRefs.current[index].value = "";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Obtener el primer archivo disponible
            const archivo = archivos.find(a => a !== null) || null;

            await crearGestionYSubirArchivo(tipoSeleccionado, null, archivo);

            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.error("Error creando gestión:", error);
            setError(error.message || "Error al crear la gestión. Por favor, intenta nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Reintegros</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre
                        </label>
                        <input
                            type="text"
                            value={userName}
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            CBU
                        </label>
                        <input
                            type="text"
                            value={userCBU || ""}
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tipo
                        </label>
                        <select
                            value={tipoSeleccionado}
                            onChange={(e) => setTipoSeleccionado(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        >
                            {tipos.map((tipo) => (
                                <option key={tipo} value={tipo}>
                                    {tipo}
                                </option>
                            ))}
                        </select>
                    </div>

                    {[0, 1, 2].map((index) => (
                        <div key={index}>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Archivo {index + 1}
                            </label>
                            <div className="flex gap-2">
                                <input
                                    ref={(el) => (fileInputRefs.current[index] = el)}
                                    type="file"
                                    accept=".pdf,.png,.jpg,.jpeg"
                                    onChange={(e) => handleFileChange(index, e)}
                                    className="hidden"
                                    id={`file-input-${index}`}
                                />
                                <label
                                    htmlFor={`file-input-${index}`}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 text-center text-sm text-gray-700"
                                >
                                    {archivos[index] ? archivos[index].name : "Seleccionar archivo"}
                                </label>
                                {archivos[index] && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveFile(index)}
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                                    >
                                        Eliminar
                                    </button>
                                )}
                            </div>
                            {archivos[index] && (
                                <p className="text-xs text-gray-500 mt-1">
                                    {archivos[index].name} ({(archivos[index].size / 1024).toFixed(2)} KB)
                                </p>
                            )}
                        </div>
                    ))}

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Enviando..." : "Solicitar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}



