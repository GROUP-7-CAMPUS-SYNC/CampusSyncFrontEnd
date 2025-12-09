import { MessageCircleMore, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import ChatListWidget from "./chatListWidget"; 
import ViewMessage from "./viewMessage";
import api from "../../api/api"; 

// Types
interface ChatPartner {
  _id: string;
  firstname: string;
  lastname: string;
  profileLink?: string;
}

export default function ItemUserMessage() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedPartner, setSelectedPartner] = useState<ChatPartner | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  // Fetch Current User Identity
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await api.get("/auth/me");
        if (response.status === 200) {
            setCurrentUserId(response.data._id);
        }
      } catch (error) {
        console.error("Failed to fetch current user:", error);
      }
    };

    if (!currentUserId) {
      fetchCurrentUser();
    }
  }, [currentUserId]);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        containerRef.current && 
        !containerRef.current.contains(target) && 
        buttonRef.current && 
        !buttonRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handlePartnerSelect = (partner: ChatPartner) => {
    setSelectedPartner(partner);
  };

  const handleBackToList = () => {
    setSelectedPartner(null);
  };

  // Determine if we are in a specific chat view
  const isChatOpen = Boolean(selectedPartner && currentUserId);

  return (
    <>
      {/* 1. Floating Action Button (FAB) */}
      {/* Logic: Only show this button if NO chat is currently selected */}
      {!isChatOpen && (
        <div 
            ref={buttonRef}
            className={`fixed bottom-20 right-5 z-50 flex items-center justify-center p-4 rounded-full shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 ${
            isOpen ? "bg-red-500 rotate-90" : "bg-blue-600 hover:bg-blue-700"
            }`}
            onClick={() => setIsOpen(!isOpen)}
        >
            {isOpen ? (
            <X className="text-white" size={28} />
            ) : (
            <MessageCircleMore className="text-white" size={28} />
            )}
        </div>
      )}

      {/* 2. Widget Container */}
      {isOpen && (
        <div 
          ref={containerRef}
          className="fixed bottom-24 right-5 z-40 w-[90vw] sm:w-96 h-[600px] max-h-[70vh] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-200 origin-bottom-right"
        >
          {isChatOpen ? (
            // VIEW B: Conversation
            <ViewMessage 
              partner={selectedPartner!} 
              onBack={handleBackToList}
              currentUserId={currentUserId}
            />
          ) : (
            // VIEW A: List of Chats
            <ChatListWidget 
               onPartnerClick={(partner) => handlePartnerSelect(partner)} 
            />
          )}
        </div>
      )}
    </>
  );
}