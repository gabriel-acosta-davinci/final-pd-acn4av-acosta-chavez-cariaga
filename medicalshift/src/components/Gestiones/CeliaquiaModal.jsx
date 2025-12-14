import BaseGestionModal from "./BaseGestionModal";

export default function CeliaquiaModal({ userName, onClose, onSuccess }) {
    return (
        <BaseGestionModal
            title="Programa de Celiaquía"
            userName={userName}
            onClose={onClose}
            onSuccess={onSuccess}
            nombreGestion="Programa de Celiaquía"
            maxArchivos={2}
        />
    );
}



