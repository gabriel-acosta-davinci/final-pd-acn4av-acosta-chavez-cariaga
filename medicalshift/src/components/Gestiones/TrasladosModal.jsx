import BaseGestionModal from "./BaseGestionModal";

export default function TrasladosModal({ userName, onClose, onSuccess }) {
    return (
        <BaseGestionModal
            title="Traslados"
            userName={userName}
            onClose={onClose}
            onSuccess={onSuccess}
            nombreGestion="Traslados"
            maxArchivos={1}
        />
    );
}



