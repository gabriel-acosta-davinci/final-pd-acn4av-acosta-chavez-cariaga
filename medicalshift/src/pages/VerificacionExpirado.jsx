import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function VerificacionExpirado() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="mb-6">
                    <img src={logo} alt="Medicalshift" className="h-16 w-16 mx-auto mb-4" />
                </div>
                
                <div className="mb-6">
                    <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-12 h-12 text-yellow-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Enlace Expirado
                    </h1>
                    <p className="text-gray-600">
                        El enlace de verificación ha expirado. Los enlaces de verificación son válidos por 60 minutos.
                    </p>
                </div>

                <div className="space-y-4">
                    <p className="text-sm text-gray-500">
                        Por favor, solicita un nuevo email de verificación desde la sección de Seguridad.
                    </p>
                    <button
                        onClick={() => navigate("/Login")}
                        className="w-full bg-sky-500 text-white px-6 py-3 rounded-md hover:bg-sky-600 font-medium transition-colors"
                    >
                        Ir al Inicio de Sesión
                    </button>
                </div>
            </div>
        </div>
    );
}

