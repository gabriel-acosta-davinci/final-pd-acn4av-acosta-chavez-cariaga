import BaseGestionModal from "./BaseGestionModal";

export default function AutorizacionesPreviasModal({ userName, onClose, onSuccess }) {
    return (
        <BaseGestionModal
            title="Autorizaciones Previas"
            userName={userName}
            onClose={onClose}
            onSuccess={onSuccess}
            nombreGestion="Autorizaciones Previas"
            showFechaAplicacion={true}
            showTipoSelector={true}
            tipos={["Prácticas/Estudios", "Internación/Cirugía", "Odontología"]}
            maxArchivos={1}
        />
    );
}



