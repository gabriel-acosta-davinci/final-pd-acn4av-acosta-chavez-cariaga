import Home from "../pages/Home";
import Login from "../pages/Login";
import About from "../pages/About";
import Contact from "../pages/Contact";
import MedicalDirectory from "../pages/MedicalDirectory";
import Plans from "../pages/Plans";
import Download from "../pages/Download.jsx";
import NotFound from "../pages/NotFound.jsx";
import Dashboard from "../pages/Dashboard";
import Gestiones from "../pages/Gestiones";
import Perfil from "../pages/Perfil";
import ProtectedRoute from "../components/ProtectedRoute";
import VerificacionExito from "../pages/VerificacionExito";
import VerificacionError from "../pages/VerificacionError";
import VerificacionExpirado from "../pages/VerificacionExpirado";

export const publicRoutes = [
    { path: "/", element: <Home /> },
    { path: "/About", element: <About /> },
    { path: "/Contact", element: <Contact /> },
    { path: "/MedicalDirectory", element: <MedicalDirectory /> },
    { path: "/Plans", element: <Plans /> },
    { path: "/Download", element: <Download /> },
    { path: "/verificacion/exito", element: <VerificacionExito /> },
    { path: "/verificacion/error", element: <VerificacionError /> },
    { path: "/verificacion/expirado", element: <VerificacionExpirado /> },
    { path: "/*", element: <NotFound /> },
];

export const isolatedRoutes = [
    { path: "/Login", element: <Login /> },
];

import Cartilla from "../pages/Cartilla";
import MisDatos from "../pages/MisDatos";
import Seguridad from "../pages/Seguridad";
import MisDocumentos from "../pages/MisDocumentos";
import Reintegros from "../pages/Reintegros";
import VerFacturas from "../pages/VerFacturas";
import ResumenPagos from "../pages/ResumenPagos";
import NuevaGestion from "../pages/NuevaGestion";
import Medicamentos from "../pages/Medicamentos";
import AutorizacionesPrevias from "../pages/AutorizacionesPrevias";
import Celiaquia from "../pages/Celiaquia";
import ReintegrosGestion from "../pages/ReintegrosGestion";
import Traslados from "../pages/Traslados";

export const protectedRoutes = [
    {
        path: "/dashboard",
        element: (
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        ),
    },
    {
        path: "/dashboard/gestiones",
        element: (
            <ProtectedRoute>
                <Gestiones />
            </ProtectedRoute>
        ),
    },
    {
        path: "/dashboard/perfil",
        element: (
            <ProtectedRoute>
                <Perfil />
            </ProtectedRoute>
        ),
    },
    {
        path: "/dashboard/cartilla",
        element: (
            <ProtectedRoute>
                <Cartilla />
            </ProtectedRoute>
        ),
    },
    {
        path: "/dashboard/perfil/mis-datos",
        element: (
            <ProtectedRoute>
                <MisDatos />
            </ProtectedRoute>
        ),
    },
    {
        path: "/dashboard/perfil/seguridad",
        element: (
            <ProtectedRoute>
                <Seguridad />
            </ProtectedRoute>
        ),
    },
    {
        path: "/dashboard/perfil/documentos",
        element: (
            <ProtectedRoute>
                <MisDocumentos />
            </ProtectedRoute>
        ),
    },
    {
        path: "/dashboard/perfil/reintegros",
        element: (
            <ProtectedRoute>
                <Reintegros />
            </ProtectedRoute>
        ),
    },
    {
        path: "/dashboard/perfil/facturas",
        element: (
            <ProtectedRoute>
                <VerFacturas />
            </ProtectedRoute>
        ),
    },
    {
        path: "/dashboard/perfil/resumen",
        element: (
            <ProtectedRoute>
                <ResumenPagos />
            </ProtectedRoute>
        ),
    },
    {
        path: "/dashboard/gestiones/nueva",
        element: (
            <ProtectedRoute>
                <NuevaGestion />
            </ProtectedRoute>
        ),
    },
    {
        path: "/dashboard/gestiones/nueva/medicamentos",
        element: (
            <ProtectedRoute>
                <Medicamentos />
            </ProtectedRoute>
        ),
    },
    {
        path: "/dashboard/gestiones/nueva/autorizaciones-previas",
        element: (
            <ProtectedRoute>
                <AutorizacionesPrevias />
            </ProtectedRoute>
        ),
    },
    {
        path: "/dashboard/gestiones/nueva/celiaquia",
        element: (
            <ProtectedRoute>
                <Celiaquia />
            </ProtectedRoute>
        ),
    },
    {
        path: "/dashboard/gestiones/nueva/reintegros",
        element: (
            <ProtectedRoute>
                <ReintegrosGestion />
            </ProtectedRoute>
        ),
    },
    {
        path: "/dashboard/gestiones/nueva/traslados",
        element: (
            <ProtectedRoute>
                <Traslados />
            </ProtectedRoute>
        ),
    },
];
