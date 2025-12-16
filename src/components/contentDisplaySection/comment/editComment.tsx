import { useState } from "react";
import Modal from "../../modal";
import Button from "../../button";
import api from "../../../api/api"; // Adjust path to your api instance

interface EditCommentProps {
  comment: any; // The comment object containing _id and text
  postId: string;
  // We need feedType to determine the correct API endpoint
  feedType?: "event" | "academic" | "report"; 
  onClose: () => void;
  onSuccess: (updatedComments: any[]) => void;
}

export default function EditComment({ 
  comment, 
  postId, 
  feedType = "event", // Default fallback
  onClose, 
  onSuccess 
}: EditCommentProps) {
  const [text, setText] = useState(comment.text || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError("");

    try {
      // 1. Determine Endpoint based on feedType
      let endpointPrefix = "";
      if (feedType === "event") endpointPrefix = "events";
      else if (feedType === "academic") endpointPrefix = "academic";
      else if (feedType === "report") endpointPrefix = "report_types";

      // 2. Call API (PUT)
      const response = await api.put(
        `/${endpointPrefix}/${postId}/comments/${comment._id}`, 
        { text }
      );

      if (response.status === 200) {
        // 3. Pass the fresh comments array back to parent
        onSuccess(response.data.comments || response.data); 
        onClose();
      }
    } catch (err: any) {
      console.error("Failed to edit comment:", err);
      setError(err.response?.data?.message || "Failed to update comment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      fullScreenOverlayDesign="fixed inset-0 bg-black/50 flex items-center justify-center z-[70]"
      cardContainerDesign="bg-white rounded-xl p-4 w-full max-w-sm mx-4 shadow-2xl overflow-hidden flex flex-col"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">Edit Comment</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          ✕
        </button>
      </div>

      <textarea
        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 resize-none"
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={loading}
      />

      {error && <p className="text-xs text-red-500 mb-2">{error}</p>}

      <div className="flex gap-2 justify-end">
        <Button 
          type="button" 
          buttonText="Cancel" 
          buttonContainerDesign="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 text-sm"
          onClick={onClose} 
        />
        <Button 
          type="button" 
          buttonText={loading ? "Saving..." : "Save"} 
          buttonContainerDesign="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
          onClick={handleSave} 
        />
      </div>
    </Modal>
  );
}