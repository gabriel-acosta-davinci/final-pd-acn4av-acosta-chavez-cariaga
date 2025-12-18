import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function RegisterForm({ onSwitch }) {
    const [formData, setFormData] = useState({
        name: "",
        numeroAsociado: "",
        documentNumber: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Validar que todos los campos estén completos
            if (!formData.name || !formData.email || !formData.password || !formData.documentNumber) {
                setError("Por favor complete todos los campos requeridos");
                setLoading(false);
                return;
            }

            if (formData.password.length < 6) {
                setError("La contraseña debe tener al menos 6 caracteres");
                setLoading(false);
                return;
            }

            await signup(formData);
            
            // Redirigir después del registro exitoso
            navigate("/");
        } catch (err) {
            setError(err.message || "Error al crear la cuenta. Por favor intente nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full space-y-6 animate-fade-in">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}
            <form className="space-y-4" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Nombre completo"
                    className="w-full px-4 py-2 border rounded-md"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={loading}
                />
                <input
                    type="text"
                    name="numeroAsociado"
                    placeholder="Número de asociado (opcional)"
                    className="w-full px-4 py-2 border rounded-md"
                    value={formData.numeroAsociado}
                    onChange={handleChange}
                    disabled={loading}
                />
                <input
                    type="text"
                    name="documentNumber"
                    placeholder="Número de documento"
                    className="w-full px-4 py-2 border rounded-md"
                    value={formData.documentNumber}
                    onChange={handleChange}
                    required
                    disabled={loading}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full px-4 py-2 border rounded-md"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Contraseña (mínimo 6 caracteres)"
                    className="w-full px-4 py-2 border rounded-md"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                />
                <button
                    type="submit"
                    className="w-full bg-sky-500 text-white py-2 rounded-md hover:bg-sky-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={loading}
                >
                    {loading ? "Creando cuenta..." : "Crear Cuenta"}
                </button>
            </form>
            <div className="mt-6 text-sm text-gray-600 text-center">
                ¿Ya tenés cuenta?{" "}
                <span className="text-sky-500 hover:underline cursor-pointer" onClick={() => onSwitch("login")}>
                    Iniciar sesión
                </span>
            </div>
        </div>
    );
}