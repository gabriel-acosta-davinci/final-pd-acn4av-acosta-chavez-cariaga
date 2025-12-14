import BaseGestionModal from "./BaseGestionModal";

export default function DiabetesModal({ userName, onClose, onSuccess }) {
    return (
        <BaseGestionModal
            title="Programa Diabetes"
            userName={userName}
            onClose={onClose}
            onSuccess={onSuccess}
            nombreGestion="Programa Diabetes"
            maxArchivos={1}
        />
    );
}



