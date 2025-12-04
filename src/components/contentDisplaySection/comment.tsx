import { useState, useRef, useEffect } from "react";
import { X, SendHorizontal, Loader2, User } from "lucide-react";

interface CommentProps {
  postId: string;
  postedBy: { firstname: string; lastname: string } | null;
  onClose: () => void;
  comments?: any[];
  onAddComment: (text: string) => Promise<void>;
}

function timeAgo(dateString: string) {
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function CommentModal({
  onClose,
  comments = [],
  onAddComment
}: CommentProps) {
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new comments arrive
  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  const handleSendClick = async () => {
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddComment(commentText);
      setCommentText("");
    } catch (error) {
      console.error("Failed to send comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex justify-center items-center p-4 animate-fadeIn">
      <div className="bg-white rounded-xl w-full max-w-md h-[50vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header - Fixed Height */}
        <div className="flex shrink-0 items-center justify-between p-4 border-b border-gray-100 bg-white z-10">
          <h2 className="text-lg font-bold text-gray-800">Comments</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Comment List - Scrollable Area */}
        {/* flex-1: Takes up all remaining space between header and footer */}
        {/* overflow-y-auto: Adds scrollbar when content exceeds height */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50">
          {comments && comments.length > 0 ? (
            <div className="flex flex-col gap-4">
              {comments.map((comment, index) => {
                const user = comment.user || {};
                const name = user.firstname && user.lastname 
                  ? `${user.firstname} ${user.lastname}` 
                  : "Unknown User";
                const profilePic = user.profileLink;
                const time = comment.createdAt ? timeAgo(comment.createdAt) : "Just now";

                return (
                  <div key={index} className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {/* Avatar */}
                    <div className="shrink-0">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 border border-gray-200">
                        {profilePic ? (
                          <img 
                            src={profilePic} 
                            alt={name} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <User size={16} />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1">
                      <div className="bg-gray-100 rounded-2xl px-3 py-2 rounded-tl-none">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <span className="text-xs font-bold text-gray-900 mr-2">{name}</span>
                        </div>
                        <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap wrap-break-words">
                          {typeof comment === "object" ? comment.text : comment}
                        </p>
                      </div>
                      
                      {/* Meta Data */}
                      <div className="flex gap-3 px-2 mt-1">
                        <span className="text-[10px] font-medium text-gray-400">{time}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {/* Invisible element to scroll to */}
              <div ref={commentsEndRef} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
              <MessagePlaceholderIcon />
              <p className="text-sm font-medium">No comments yet</p>
              <p className="text-xs">Be the first to share your thoughts!</p>
            </div>
          )}
        </div>

        {/* Input Area - Fixed at Bottom */}
        <div className="shrink-0 p-3 border-t border-gray-100 bg-white">
          <div className="flex items-end gap-2 bg-gray-100 rounded-2xl p-2 border border-transparent focus-within:border-blue-300 focus-within:bg-white transition-all">
            <textarea
              className="w-full bg-transparent text-sm text-gray-800 placeholder:text-gray-500 px-2 py-1 outline-none resize-none max-h-24 min-h-6"
              placeholder={`Comment as ${localStorage.getItem("firstName") || "User"}...`}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={isSubmitting}
              rows={1}
              style={{ height: 'auto', overflow: 'hidden' }}
              onInput={(e) => {
                e.currentTarget.style.height = 'auto';
                e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
              }}
            />
            <button 
              className={`p-2 rounded-full transition-all shrink-0 ${
                !commentText.trim() 
                  ? "text-gray-400 cursor-not-allowed" 
                  : "text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
              }`}
              onClick={handleSendClick}
              disabled={isSubmitting || !commentText.trim()}
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <SendHorizontal size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MessagePlaceholderIcon() {
  return (
    <svg className="w-12 h-12 opacity-20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
    </svg>
  );
}