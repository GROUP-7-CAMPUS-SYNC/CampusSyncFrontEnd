import { useState } from "react";
import { X, User, Send, Loader2, CheckCircle } from "lucide-react";
import api from "../../../api/api"; 

interface PosterDetails {
  _id: string;
  firstname: string;
  lastname: string;
  profileLink?: string;
}

interface ChatInitiationModalProps {
  isOpen: boolean;
  onClose: () => void;
  poster: PosterDetails | null;
}

export default function ChatInitiationModal({
  isOpen,
  onClose,
  poster,
}: ChatInitiationModalProps) {
  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  
  // 1. New state to track success status
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !poster) return null;

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    setIsSending(true);
    try {
      const response = await api.post(`/message/send/${poster._id}`, {
        messageText: messageText,
      });

      if (response.status === 201) {
        // 2. Instead of alert, switch to success view
        setIsSuccess(true);
        setMessageText(""); 
      }
    } catch (error: any) {
      console.error("Failed to send message:", error);
      // You could also add an isError state here similar to isSuccess if desired
      alert(error.response?.data?.message || "Failed to send message.");
    } finally {
      setIsSending(false);
    }
  };

  // Helper to reset state when closing
  const handleClose = () => {
    setIsSuccess(false);
    setMessageText("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100"
        role="dialog"
        aria-modal="true"
      >
        
        {/* 3. Conditional Rendering: Show Success View or Form View */}
        {isSuccess ? (
            // --- SUCCESS VIEW ---
            <div className="flex flex-col items-center justify-center p-8 text-center animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-500 mb-6">
                    Your message to {poster.firstname} has been delivered successfully.
                </p>
                <button
                    onClick={handleClose}
                    className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
                >
                    Close
                </button>
            </div>
        ) : (
            // --- FORM VIEW (Your existing code) ---
            <>
                {/* HEADER */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-semibold text-gray-800">Start Conversation</h3>
                <button
                    onClick={handleClose}
                    className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                    <X size={20} />
                </button>
                </div>

                {/* BODY: Poster Info */}
                <div className="px-6 py-6 flex flex-col items-center">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-full bg-gray-200 p-1 mb-3 shadow-sm">
                    <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-white">
                    {poster.profileLink ? (
                        <img
                        src={poster.profileLink}
                        alt={`${poster.firstname} ${poster.lastname}`}
                        className="w-full h-full object-cover"
                        />
                    ) : (
                        <User size={40} className="text-gray-400" />
                    )}
                    </div>
                </div>

                {/* Name */}
                <h2 className="text-xl font-bold text-gray-900">
                    {poster.firstname} {poster.lastname}
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                    Send a message to coordinate the return of the item.
                </p>

                {/* Message Input */}
                <div className="w-full">
                    <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                    Message
                    </label>
                    <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder={`Hi ${poster.firstname}, I saw your post...`}
                    className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm text-gray-800 bg-gray-50 focus:bg-white transition-all outline-none"
                    />
                </div>
                </div>

                {/* FOOTER: Actions */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                <button
                    onClick={handleClose}
                    className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
                >
                    Cancel
                </button>
                
                <button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim() || isSending}
                    className={`flex items-center gap-2 px-6 py-2 text-sm font-medium text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all ${
                    !messageText.trim() || isSending
                        ? "bg-blue-300 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 hover:shadow-md"
                    }`}
                >
                    {isSending ? (
                    <Loader2 size={16} className="animate-spin" />
                    ) : (
                    <Send size={16} />
                    )}
                    {isSending ? "Sending..." : "Send Message"}
                </button>
                </div>
            </>
        )}
      </div>
    </div>
  );
}