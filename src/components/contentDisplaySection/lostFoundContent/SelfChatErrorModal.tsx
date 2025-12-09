// components/lostFound/SelfChatErrorModal.tsx

import { AlertCircle } from "lucide-react";
import Modal from "../../modal"; // Ensure path matches your project
import Button from "../../button"; // Ensure path matches your project

interface SelfChatErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SelfChatErrorModal({
  isOpen,
  onClose,
}: SelfChatErrorModalProps) {
  if (!isOpen) return null;

  return (
    <Modal>
      <div className="flex flex-col items-center justify-center p-4 text-center">
        {/* Icon Container */}
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="text-red-600" size={24} />
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Action Not Allowed
        </h3>

        {/* Description */}
        <p className="text-gray-500 text-sm mb-6 max-w-[250px]">
          You cannot start a chat with yourself. This post was created by you.
        </p>

        {/* Button */}
        <div className="w-full">
          <Button
            type="button"
            buttonText="Got it"
            onClick={onClose}
            // You can optionally override styles here if your Button component supports className
            // className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2 rounded-lg transition-colors"
          />
        </div>
      </div>
    </Modal>
  );
}