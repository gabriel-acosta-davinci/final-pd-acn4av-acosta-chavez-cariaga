import BaseGestionModal from "./BaseGestionModal";

export default function CronicasModal({ userName, onClose, onSuccess }) {
    return (
        <BaseGestionModal
            title="Programa Patologías Crónicas"
            userName={userName}
            onClose={onClose}
            onSuccess={onSuccess}
            nombreGestion="Programa Patologías Crónicas"
            maxArchivos={1}
        />
    );
}



