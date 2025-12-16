import { useState, useRef, useEffect } from "react";
import { X, SendHorizontal, Loader2, User, MoreHorizontal } from "lucide-react";
import Modal from "../../../components/modal";
import Button from "../../../components/button";
import EditComment from "./editComment";
import DeleteComment from "./deleteComment";

interface CommentProps {
  postId: string;
  postedBy: { firstname: string; lastname: string } | null;
  onClose: () => void;
  comments?: any[];
  onAddComment: (text: string) => Promise<void>;
  // IMPORTANT: Callback to update parent state when comment is edited/deleted
  onCommentsUpdated?: (newComments: any[]) => void; 
  commentCount?: number;
  // We need this to tell Edit/Delete components which API route to use
  feedType?: "event" | "academic" | "report"; 
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
  onAddComment,
  postId,
  feedType = "event", // Default
  onCommentsUpdated, // New prop to handle list updates
}: CommentProps) {
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeCommentIndex, setActiveCommentIndex] = useState<number | null>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  // --- NEW STATES FOR MANAGING EDIT/DELETE ---
  // Store the full comment object selected by user
  const [selectedComment, setSelectedComment] = useState<any | null>(null);
  // Track which view is active: 'none', 'manage', 'edit', 'delete'
  const [actionView, setActionView] = useState<"none" | "manage" | "edit" | "delete">("none");

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

  // 1. Open the "Manage" menu
  const handleOpenManage = (e: React.MouseEvent, comment: any) => {
    e.stopPropagation();
    setSelectedComment(comment);
    setActionView("manage");
  };

  // 2. Handle switching views
  const handleEditClick = () => setActionView("edit");
  const handleDeleteClick = () => setActionView("delete");
  
  // 3. Reset everything
  const handleCloseActions = () => {
    setActionView("none");
    setSelectedComment(null);
  };

  // 4. Handle Successful Edit/Delete
  const handleActionSuccess = (updatedComments: any[]) => {
    if (onCommentsUpdated) {
      onCommentsUpdated(updatedComments); // Update parent state
    } else {
      // If parent didn't provide callback, we might need a fallback or just log
      console.warn("Parent did not provide onCommentsUpdated callback");
      // Optional: window.location.reload(); // Brute force refresh if desperate
    }
    handleCloseActions();
  };

  const handleCommentClick = (index: number) => {
    if (activeCommentIndex === index) {
      setActiveCommentIndex(null);
    } else {
      setActiveCommentIndex(index);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex justify-center items-center p-4 animate-fadeIn">
      {/* Background click to close active selection */}
      <div
        className="fixed inset-0 z-40"
        onClick={() => setActiveCommentIndex(null)}
      />

      <div className="bg-white rounded-xl w-full max-w-md h-[50vh] flex flex-col shadow-2xl overflow-hidden z-50 relative">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between p-4 border-b border-gray-100 bg-white z-10">
          <h2 className="text-lg font-bold text-gray-800">Comments</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Comment List */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50">
          {comments && comments.length > 0 ? (
            <div className="flex flex-col gap-4">
              {comments.map((comment, index) => {
                const user = comment.user || {};
                const name =
                  user.firstname && user.lastname
                    ? `${user.firstname} ${user.lastname}`
                    : "Unknown User";
                const profilePic = user.profileLink;
                const time = comment.createdAt
                  ? timeAgo(comment.createdAt)
                  : "Just now";

                const isActive = activeCommentIndex === index;
                const textContent = typeof comment === "object" ? comment.text : comment;
                

                return (
                  <div
                    key={index}
                    onClick={() => handleCommentClick(index)}
                    className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 p-1 -mx-1 cursor-pointer"
                  >
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
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="bg-gray-100 rounded-2xl px-3 py-2 rounded-tl-none">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <span className="text-xs font-bold text-gray-900 mr-2">
                            {name}
                          </span>
                        </div>
                        <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap break-all">
                          {textContent}
                        </p>
                      </div>
                      <div className="flex gap-3 px-2 mt-1">
                        <span className="text-[10px] font-medium text-gray-400">
                          {time}
                        </span>
                      </div>
                    </div>

                    {/* Action Button - Only show if it is MY comment */}
                    {/* Remove '&& isMyComment' if you want admins to see it too */}
                    <div className="self-center shrink-0 w-8 flex justify-center">
                      {isActive && (
                        <button
                          className="p-1.5 text-gray-500 hover:text-gray-700 rounded-full bg-white shadow-sm border border-gray-100 animate-in zoom-in duration-200"
                          aria-label="Comment options"
                          onClick={(e) => handleOpenManage(e, comment)}
                        >
                          <MoreHorizontal size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
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

        {/* Input Area */}
        <div className="shrink-0 p-3 border-t border-gray-100 bg-white">
          <div className="flex items-end gap-2 bg-gray-100 rounded-2xl p-2 border border-transparent focus-within:border-blue-300 focus-within:bg-white transition-all">
            <textarea
              className="w-full bg-transparent text-sm text-gray-800 placeholder:text-gray-500 px-2 py-1 outline-none resize-none max-h-24 min-h-6"
              placeholder={`Comment as ${
                localStorage.getItem("firstName") || "User"
              }...`}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={isSubmitting}
              rows={1}
              style={{ height: "auto", overflow: "hidden" }}
              onInput={(e) => {
                e.currentTarget.style.height = "auto";
                e.currentTarget.style.height =
                  e.currentTarget.scrollHeight + "px";
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
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <SendHorizontal size={16} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* --- LOGIC FOR MANAGE / EDIT / DELETE VIEWS --- */}
      
      {/* 1. Manage Modal (Select Action) */}
      {actionView === "manage" && selectedComment && (
        <Modal
            fullScreenOverlayDesign="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]"
            cardContainerDesign="bg-white rounded-xl p-4 w-full max-w-sm mx-4 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        >
          {/* Header */}
          <div className="flex justify-between items-center w-full mb-4 px-1 shrink-0">
            <h3 className="text-lg font-bold text-gray-800">Manage</h3>
            <button
              onClick={handleCloseActions}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mb-4 text-sm text-gray-500 italic px-2 py-2 max-h-40 overflow-y-auto break-all bg-gray-50 rounded border border-gray-100">
            "{selectedComment.text}"
          </div>

          <div className="flex flex-col gap-3 w-full shrink-0">
            <Button
              type="button"
              buttonText="Edit"
              buttonContainerDesign="bg-blue-600 p-[10px] w-full text-white rounded-[6px] hover:bg-blue-700 transition-colors duration-200 cursor-pointer font-medium"
              onClick={handleEditClick}
            />
            
            <Button
              type="button"
              buttonText="Delete"
              buttonContainerDesign="bg-red-600 p-[10px] w-full text-white rounded-[6px] hover:bg-red-700 transition-colors duration-200 cursor-pointer font-medium"
              onClick={handleDeleteClick}
            />
          </div>
        </Modal>
      )}

      {/* 2. Edit Component */}
      {actionView === "edit" && selectedComment && (
        <EditComment 
          comment={selectedComment}
          postId={postId}
          feedType={feedType}
          onClose={handleCloseActions}
          onSuccess={handleActionSuccess}
        />
      )}

      {/* 3. Delete Component */}
      {actionView === "delete" && selectedComment && (
        <DeleteComment 
          commentId={selectedComment._id}
          postId={postId}
          feedType={feedType}
          onClose={handleCloseActions}
          onSuccess={handleActionSuccess}
        />
      )}

    </div>
  );
}

function MessagePlaceholderIcon() {
  return (
    <svg
      className="w-12 h-12 opacity-20"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
    </svg>
  );
}