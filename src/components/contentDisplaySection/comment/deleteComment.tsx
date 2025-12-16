import { useState } from "react";
import Modal from "../../modal";
import Button from "../../button";
import api from "../../../api/api"; // Adjust path

interface DeleteCommentProps {
  commentId: string;
  postId: string;
  feedType?: "event" | "academic" | "report";
  onClose: () => void;
  onSuccess: (updatedComments: any[]) => void;
}

export default function DeleteComment({ 
  commentId, 
  postId, 
  feedType = "event", 
  onClose, 
  onSuccess 
}: DeleteCommentProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    setError("");

    try {
      let endpointPrefix = "";
      if (feedType === "event") endpointPrefix = "events";
      else if (feedType === "academic") endpointPrefix = "academic";
      else if (feedType === "report") endpointPrefix = "report_types";

      // Call API (DELETE)
      const response = await api.delete(
        `/${endpointPrefix}/${postId}/comments/${commentId}`
      );

      if (response.status === 200) {
        onSuccess(response.data.comments || response.data);
        onClose();
      }
    } catch (err: any) {
      console.error("Failed to delete comment:", err);
      setError(err.response?.data?.message || "Failed to delete comment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      fullScreenOverlayDesign="fixed inset-0 bg-black/50 flex items-center justify-center z-[70]"
      cardContainerDesign="bg-white rounded-xl p-6 w-full max-w-sm mx-4 shadow-2xl overflow-hidden flex flex-col items-center text-center"
    >
      <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Comment?</h3>
      <p className="text-sm text-gray-500 mb-6">
        Are you sure you want to delete this comment? This action cannot be undone.
      </p>

      {error && <p className="text-xs text-red-500 mb-4">{error}</p>}

      <div className="flex gap-3 w-full">
        <Button 
          type="button" 
          buttonText="Cancel" 
          buttonContainerDesign="bg-gray-200 w-full text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 text-sm font-medium"
          onClick={onClose} 
        />
        <Button 
          type="button" 
          buttonText={loading ? "Deleting..." : "Delete"} 
          buttonContainerDesign="bg-red-600 w-full text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm font-medium"
          onClick={handleDelete} 
        />
      </div>
    </Modal>
  );
}