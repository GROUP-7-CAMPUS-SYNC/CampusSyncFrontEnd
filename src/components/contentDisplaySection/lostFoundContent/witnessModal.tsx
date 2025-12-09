import Modal from "../../../components/modal"
import Button from "../../../components/button"

interface WitnessModalProps {
    onClose: () => void;
    onProceed: () => void
}


export default function WitnessModal({onClose, onProceed } : WitnessModalProps) {
  return (
    <Modal>
        <p className="mb-4">After you click proceed, you cannot undo this action.</p>

        <div
            className="flex justify-between "
        >
            <div className="w-[48%]">
                <Button
                    type="button"
                    buttonText="Cancel"
                    onClick={onClose}
                />
            </div>

            <div className="w-[48%]">
                <Button
                    type="button"
                    buttonText="Proceed"
                    onClick={onProceed}
                />
            </div>
        </div>
    </Modal>
  )
}