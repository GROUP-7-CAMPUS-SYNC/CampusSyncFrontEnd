// components/chat/ChatListWidget.tsx

import { MessageSquare, Loader2, MessageCircleMore, User } from "lucide-react";
import { useState, useEffect, forwardRef } from "react";
import api from "../../api/api"; 

// 1. UPDATE INTERFACE
interface ChatPartner {
  _id: string;
  firstname: string;
  lastname: string;
  profileLink?: string;
  unreadCount?: number; 
}

interface ChatListWidgetProps {
  onPartnerClick: (partner: ChatPartner) => void; 
}

const ChatListWidget = forwardRef<HTMLDivElement, ChatListWidgetProps>(
  ({ onPartnerClick }, ref) => {
    const [partners, setPartners] = useState<ChatPartner[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      const fetchPartners = async (isBackground: boolean) => {
        if (!isBackground) setIsLoading(true);
        try {
          const response = await api.get("/message/partners/list"); 
          if (response.status === 200) {
            setPartners(response.data);
          }
        } catch (error) {
          console.error("Failed to fetch chat partners:", error);
        } finally {
          if (!isBackground) setIsLoading(false);
        }
      };

      fetchPartners(false);

      const intervalId = setInterval(() => {
        fetchPartners(true);
      }, 2000);

      return () => clearInterval(intervalId);
    }, []);

    return (
      <div
        ref={ref}
        className="fixed bottom-24 right-5 z-40 w-[90vw] sm:w-96 h-[600px] max-h-[70vh] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-200 origin-bottom-right"
      >
        {/* Header */}
        <div className="bg-blue-600 p-4 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-white font-bold text-lg flex items-center gap-2">
              <MessageSquare size={20} className="text-blue-200" />
              Messages
            </h2>
            <p className="text-blue-100 text-xs mt-0.5">
              Your recent conversations
            </p>
          </div>
        </div>

        {/* Body / List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50 p-2">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <Loader2 className="animate-spin mb-2" size={32} />
              <span className="text-sm">Loading chats...</span>
            </div>
          ) : partners.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center p-6">
              <MessageCircleMore size={48} className="mb-3 opacity-20" />
              <p className="font-medium text-gray-500">No messages yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {partners.map((partner) => (
                <div
                  key={partner._id}
                  onClick={() => onPartnerClick(partner)} 
                  className="group flex items-center gap-3 p-3 rounded-xl bg-white hover:bg-blue-50 border border-transparent hover:border-blue-100 cursor-pointer transition-all duration-200 shadow-sm"
                >
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden border-2 border-white shadow-sm">
                      {partner.profileLink ? (
                        <img
                          src={partner.profileLink}
                          alt="avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                          <User size={20} />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-gray-900 truncate group-hover:text-blue-700 transition-colors">
                        {partner.firstname} {partner.lastname}
                      </h4>
                      
                      {/* 2. RENDER BADGE IF UNREAD COUNT > 0 */}
                      {partner.unreadCount && partner.unreadCount > 0 ? (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                          {partner.unreadCount}
                        </span>
                      ) : null}

                    </div>
                    <p className="text-xs text-gray-500 truncate mt-0.5 group-hover:text-blue-500/70">
                      Click to view conversation history
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t border-gray-100 text-center">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
            Inbox
          </p>
        </div>
      </div>
    );
  }
);

ChatListWidget.displayName = "ChatListWidget";

export default ChatListWidget;