import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import documentService from "../services/documentService";
import DashboardHeader from "../components/Dashboard/DashboardHeader";

export default function MisDocumentos() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate("/Login");
        }
    }, [authLoading, isAuthenticated, navigate]);

    useEffect(() => {
        if (isAuthenticated) {
            loadDocuments();
        }
    }, [isAuthenticated]);

    const loadDocuments = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await documentService.listDocuments({ limit: 50 });
            if (response.documents) {
                setDocuments(response.documents);
            } else {
                setDocuments([]);
            }
        } catch (err) {
            console.error("Error cargando documentos:", err);
            setError("Error al cargar los documentos. Por favor, intenta nuevamente.");
            setDocuments([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (doc) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("No estás autenticado. Por favor, inicia sesión nuevamente.");
                return;
            }

            // Obtener el ID de la gestión para construir la URL
            const gestionId = doc.gestionId || doc.id;
            if (!gestionId) {
                alert("No se puede descargar: ID de gestión no disponible");
                return;
            }

            // Construir la URL del endpoint
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
            const downloadUrl = `${apiBaseUrl}/gestiones/${gestionId}/document`;

            // Hacer la petición con el token de autenticación
            const response = await fetch(downloadUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
                    return;
                }
                const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }));
                throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
            }

            // Obtener el blob del archivo
            const blob = await response.blob();
            
            // Obtener el nombre del archivo del header o usar uno por defecto
            const contentDisposition = response.headers.get('content-disposition');
            let fileName = doc.originalName || doc.fileName || 'documento';
            
            // Intentar extraer el nombre del archivo del header Content-Disposition
            if (contentDisposition) {
                const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                if (fileNameMatch && fileNameMatch[1]) {
                    fileName = fileNameMatch[1].replace(/['"]/g, '');
                }
            }

            // Crear un enlace temporal para descargar el archivo
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            
            // Limpiar
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Error descargando documento:", err);
            alert(`Error al descargar el documento: ${err.message || 'Error desconocido'}`);
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return "Fecha no disponible";
        try {
            // Si es un número (milisegundos), crear Date directamente
            const date = typeof timestamp === 'number' 
                ? new Date(timestamp) 
                : new Date(timestamp);
            
            if (isNaN(date.getTime())) {
                return "Fecha no disponible";
            }
            
            return date.toLocaleDateString("es-AR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            });
        } catch {
            return "Fecha no disponible";
        }
    };

    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <DashboardHeader />
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Documentos</h1>
                    <p className="text-gray-600">Gestiona y descarga tus documentos</p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {documents && documents.length > 0 ? (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Documentos ({documents.length})
                            </h2>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {documents.map((doc, index) => (
                                <DocumentCard
                                    key={doc.id || doc.fileName || index}
                                    document={doc}
                                    onDownload={handleDownload}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                        <svg
                            className="w-16 h-16 mx-auto mb-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No se encontraron documentos
                        </h3>
                        <p className="text-gray-600">
                            No tenés documentos en los últimos 3 meses.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

function DocumentCard({ document, onDownload }) {
    const formatDate = (timestamp) => {
        if (!timestamp) return "Fecha no disponible";
        try {
            const date = typeof timestamp === 'number' 
                ? new Date(timestamp) 
                : new Date(timestamp);
            
            if (isNaN(date.getTime())) {
                return "Fecha no disponible";
            }
            
            return date.toLocaleDateString("es-AR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            });
        } catch {
            return "Fecha no disponible";
        }
    };

    const fileName = document.originalName || document.fileName || "Documento sin nombre";
    const gestionName = document.gestionName || document.nombre;
    const tipoGestion = gestionName ? `Gestión: ${gestionName}` : "Documento";
    const fecha = formatDate(document.uploadedAt);

    return (
        <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                            <svg
                                className="w-8 h-8 text-sky-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-base font-semibold text-gray-900 truncate">
                                {fileName}
                            </h3>
                            <div className="mt-1 flex items-center gap-4 text-sm text-gray-600">
                                <span>{tipoGestion}</span>
                                <span className="text-gray-400">•</span>
                                <span>{fecha}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-shrink-0 ml-4">
                    <button
                        onClick={() => onDownload(document)}
                        className="bg-sky-500 text-white px-4 py-2 rounded-md hover:bg-sky-600 font-medium flex items-center gap-2 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                        </svg>
                        Descargar
                    </button>
                </div>
            </div>
        </div>
    );
}



