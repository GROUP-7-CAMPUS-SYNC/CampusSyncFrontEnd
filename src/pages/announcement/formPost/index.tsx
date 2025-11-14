import Modal from "../../../components/modal"
import Button from "../../../components/button"

interface CreatePostProps {
    onClose: () => void;
}


export default function index({
    onClose,
} : CreatePostProps) {
  return (
    <Modal>
        <p>Create Post in Annoucement</p>

        <Button
            type="button"
            buttonText="Close"
            onClick={onClose}
        />
    </Modal>
  )
}

