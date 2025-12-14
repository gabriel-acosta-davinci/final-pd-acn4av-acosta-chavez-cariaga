import BaseGestionModal from "./BaseGestionModal";

export default function AutorizacionModal({ userName, onClose, onSuccess }) {
    return (
        <BaseGestionModal
            title="Medicamentos con autorización previa"
            userName={userName}
            onClose={onClose}
            onSuccess={onSuccess}
            nombreGestion="Medicamentos con autorización previa"
            showFechaAplicacion={true}
            maxArchivos={1}
        />
    );
}



