import { useState, useEffect, useRef } from "react";
import { Send, ArrowLeft, Loader2, User } from "lucide-react";
import api from "../../api/api"; // Adjust path as needed

// Types
interface ChatPartner {
  _id: string;
  firstname: string;
  lastname: string;
  profileLink?: string;
}

interface Message {
  _id: string;
  sender: {
    _id: string;
    firstname: string;
    lastname: string;
    profileLink?: string;
  };
  messageText: string;
  createdAt: string;
}

interface ViewMessageProps {
  partner: ChatPartner;
  onBack: () => void;
  currentUserId: string;
}

export default function ViewMessage({
  partner,
  onBack,
  currentUserId,
}: ViewMessageProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Only for initial load
  const [isSending, setIsSending] = useState(false);

  // Ref to auto-scroll to bottom
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Fetch Conversation History (POLLING)
  useEffect(() => {
    // We define the function inside useEffect
    const fetchMessages = async (isBackground: boolean) => {
      // Only show spinner on the very first load, not every 2 seconds
      if (!isBackground) setIsLoading(true);
      
      try {
        const response = await api.get(`/message/${partner._id}`);
        if (response.status === 200) {
          // Update state with new messages
          setMessages(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        if (!isBackground) setIsLoading(false);
      }
    };

    const maskAsRead = async () => {
        try
        {
            await api.put(`/message/markAsRead/${partner._id}`);
        }
        catch(error)
        {
            console.error(error)
        }
    }

    // A. Initial Fetch (Show Loading Spinner)
    fetchMessages(false);
    maskAsRead()

    // B. Set up Interval (Run every 2 seconds, No Spinner)
    const intervalId = setInterval(() => {
      fetchMessages(true);
    }, 2000);

    // C. Cleanup: Stop the timer when user leaves this chat or component unmounts
    return () => clearInterval(intervalId);

  }, [partner._id]);

  // 2. Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 3. Handle Send Message
  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newMessage.trim()) return;

    setIsSending(true);
    try {
      const response = await api.post(`/message/send/${partner._id}`, {
        messageText: newMessage,
      });

      if (response.status === 201) {
        // Add the new message immediately to UI
        setMessages((prev) => [...prev, response.data]);
        setNewMessage(""); 
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  // Helper to format time
  const formatTime = (dateString: string) => {
    // Handle potential invalid dates gracefully
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* --- HEADER --- */}
      <div className="flex items-center gap-3 p-3 border-b border-gray-100 bg-white shadow-sm shrink-0 z-10">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden border border-gray-100">
            {partner.profileLink ? (
              <img
                src={partner.profileLink}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                <User size={18} />
              </div>
            )}
          </div>

            {/* Name */}
            <h3 className="font-semibold text-gray-800 text-sm">
                {partner.firstname} {partner.lastname}
            </h3>
          
        </div>
      </div>

      {/* --- MESSAGE LIST --- */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4 custom-scrollbar">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-gray-400" size={24} />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p className="text-sm">No messages yet.</p>
            <p className="text-xs">Say hello to start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            // Safety check: ensure sender exists before accessing _id
            const senderId = msg.sender?._id || msg.sender; // Handle populated vs unpopulated
            const isMe = senderId === currentUserId;
            
            return (
              <div
                key={index}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
                    isMe
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                  }`}
                >
                  <p>{msg.messageText}</p>
                  <p
                    className={`text-[10px] mt-1 text-right ${
                      isMe ? "text-blue-200" : "text-gray-400"
                    }`}
                  >
                    {formatTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* --- INPUT FOOTER --- */}
      <form
        onSubmit={handleSendMessage}
        className="p-3 bg-white border-t border-gray-100 flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-gray-100 text-gray-800 text-sm rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
        />
        <button
          type="submit"
          disabled={!newMessage.trim() || isSending}
          className={`p-2.5 rounded-full transition-all duration-200 ${
            !newMessage.trim() || isSending
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg hover:scale-105"
          }`}
        >
          {isSending ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Send size={18} className="ml-0.5" />
          )}
        </button>
      </form>
    </div>
  );
}