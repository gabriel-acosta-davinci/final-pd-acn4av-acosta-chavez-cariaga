import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import authService from "../../services/authService";
import logo from "../../assets/logo.png";

export default function DashboardHeader() {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            loadNotifications();
            // Recargar notificaciones cada 30 segundos
            const interval = setInterval(loadNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const loadNotifications = async () => {
        try {
            const response = await authService.getNotifications();
            if (response.notifications) {
                setNotifications(response.notifications);
            }
        } catch (error) {
            console.error("Error cargando notificaciones:", error);
        }
    };

    const handleLogout = () => {
        logout();
        // Limpiar cualquier estado de navegación y redirigir al login
        navigate("/Login", { replace: true });
    };

    const unreadCount = notifications.length;

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-3">
                        <img src={logo} alt="Medicalshift" className="h-10 w-10" />
                        <div>
                            <h1 className="text-xl font-bold text-sky-500">Medicalshift</h1>
                            <p className="text-xs text-gray-500">COBERTURA MÉDICA</p>
                        </div>
                    </div>

                    <nav className="hidden md:flex items-center gap-6">
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="text-gray-700 hover:text-sky-500 font-medium"
                        >
                            Inicio
                        </button>
                        <button
                            onClick={() => navigate("/dashboard/gestiones")}
                            className="text-gray-700 hover:text-sky-500 font-medium"
                        >
                            Gestiones
                        </button>
                        <button
                            onClick={() => navigate("/dashboard/cartilla")}
                            className="text-gray-700 hover:text-sky-500 font-medium"
                        >
                            Cartilla
                        </button>
                        <button
                            onClick={() => navigate("/dashboard/perfil")}
                            className="text-gray-700 hover:text-sky-500 font-medium"
                        >
                            Perfil
                        </button>
                        
                        {/* Campanita de notificaciones */}
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="relative text-gray-700 hover:text-sky-500 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>
                            
                            {/* Dropdown de notificaciones */}
                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
                                    <div className="p-4 border-b border-gray-200">
                                        <h3 className="text-lg font-semibold text-gray-900">Notificaciones</h3>
                                    </div>
                                    {notifications.length > 0 ? (
                                        <div className="divide-y divide-gray-200">
                                            {notifications.map((notification) => (
                                                <div
                                                    key={notification.id}
                                                    className="p-4 hover:bg-gray-50 cursor-pointer"
                                                    onClick={() => {
                                                        if (notification.actionUrl) {
                                                            navigate(notification.actionUrl);
                                                            setShowNotifications(false);
                                                        }
                                                    }}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                                                            notification.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                                                        }`}></div>
                                                        <div className="flex-1">
                                                            <h4 className="text-sm font-semibold text-gray-900">
                                                                {notification.title}
                                                            </h4>
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                {notification.message}
                                                            </p>
                                                            {notification.action && (
                                                                <button className="text-xs text-sky-500 hover:text-sky-600 font-medium mt-2">
                                                                    {notification.action} →
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center text-gray-500">
                                            <p>No tienes notificaciones</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 font-medium"
                        >
                            Cerrar Sesión
                        </button>
                    </nav>

                    {/* Menú móvil */}
                    <div className="md:hidden flex items-center gap-4">
                        {/* Campanita de notificaciones móvil */}
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="relative text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>
                            
                            {/* Dropdown de notificaciones móvil */}
                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
                                    <div className="p-4 border-b border-gray-200">
                                        <h3 className="text-lg font-semibold text-gray-900">Notificaciones</h3>
                                    </div>
                                    {notifications.length > 0 ? (
                                        <div className="divide-y divide-gray-200">
                                            {notifications.map((notification) => (
                                                <div
                                                    key={notification.id}
                                                    className="p-4 hover:bg-gray-50 cursor-pointer"
                                                    onClick={() => {
                                                        if (notification.actionUrl) {
                                                            navigate(notification.actionUrl);
                                                            setShowNotifications(false);
                                                        }
                                                    }}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                                                            notification.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                                                        }`}></div>
                                                        <div className="flex-1">
                                                            <h4 className="text-sm font-semibold text-gray-900">
                                                                {notification.title}
                                                            </h4>
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                {notification.message}
                                                            </p>
                                                            {notification.action && (
                                                                <button className="text-xs text-sky-500 hover:text-sky-600 font-medium mt-2">
                                                                    {notification.action} →
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center text-gray-500">
                                            <p>No tienes notificaciones</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <button className="text-gray-700">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}

