import BaseGestionModal from "./BaseGestionModal";

export default function OncologiaModal({ userName, onClose, onSuccess }) {
    return (
        <BaseGestionModal
            title="Oncología"
            userName={userName}
            onClose={onClose}
            onSuccess={onSuccess}
            nombreGestion="Oncología"
            showFechaAplicacion={true}
            maxArchivos={1}
        />
    );
}



