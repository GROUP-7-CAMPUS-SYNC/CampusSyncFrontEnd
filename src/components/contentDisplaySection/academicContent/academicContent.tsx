import { useState, useEffect, useRef } from "react";
import { MessageCircle, User, XCircleIcon } from "lucide-react";
import SaveButton from "../saveButton";
import api from "../../../api/api";
import Modal from "../../modal"; // Ensure path is correct
import Button from "../../button"; // Ensure path is correct

// Import the dropdown
import PostOptionDropDown from "./postOptionDropdown";

// --- Types ---
export interface AcademicPost {
  _id: string;
  type: string;
  title: string;
  content: string;
  image: string;
  postedBy: {
    _id: string;
    firstname: string;
    lastname: string;
  } | null;
  organization: {
    _id: string;
    organizationName: string;
    profileLink: string;
  } | null;
  taggedUsers: any[];
  comments: any[];
  createdAt: string;
  updatedAt: string;
}

interface AcademicCardProps {
  post: AcademicPost;
  isSaved?: boolean;
  isCommentOpen?: boolean;
  onToggleSave?: (id: string) => void;
  onCommentClick?: (id: string, postedBy: any) => void;
}

// --- Helper ---
function timeAgo(dateString: string) {
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  if (diffInSeconds < 60) return "Just now";
  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  return past.toLocaleDateString();
}

export default function AcademicCard({
  post,
  isSaved = false,
  onToggleSave,
  onCommentClick,
}: AcademicCardProps) {
  
  // Modals / Errors
  const [errorModal, setErrorModal] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Dropdown State
  const [userClickDropDown, setUserClickDropDown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click Outside Logic for Dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setUserClickDropDown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // --- DELETE POST LOGIC ---
  const deletePost = async () => {
    try {
      const response = await api.delete(`/academic/delete/${post._id}`);

      if (response.status === 200) {
        window.location.reload();
      }
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || "Failed to delete academic post."
      );
      setErrorModal(true);
    }
  };

  const orgName = post.organization?.organizationName || "Unknown Organization";
  const orgImage = post.organization?.profileLink;
  const posterName = post.postedBy
    ? `${post.postedBy.firstname} ${post.postedBy.lastname}`
    : "Unknown User";
  const timePosted = timeAgo(post.createdAt);

  return (
    <div className="bg-white sm:rounded-xl shadow-sm p-5 mb-0.5 sm:mb-5">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center border border-black/20">
            {orgImage ? (
              <img
                src={orgImage}
                alt={orgName}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="text-gray-400" size={24} />
            )}
          </div>

          <div className="flex flex-col">
            <h3 className="font-bold text-gray-900 leading-tight">{orgName}</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Posted by {posterName} • {timePosted}
            </p>
          </div>
        </div>

        {/* Right Side: 3 Dots + Badge */}
        <div className="flex items-center gap-4">
            
            {/* Dropdown Container */}
            <div className="relative" ref={dropdownRef}>
                <button 
                  className="text-gray-500 cursor-pointer hover:text-black p-1 rounded-full hover:bg-gray-100 transition-colors"
                  onClick={() => setUserClickDropDown(!userClickDropDown)}
                >
                    •••
                </button>

                {/* Dropdown Logic */}
                {userClickDropDown && (
                    <PostOptionDropDown
                        onClose={() => setUserClickDropDown(false)}
                        onDeleteClick={() => deletePost()}
                    />
                )}
            </div>

            <span className="inline-flex items-center bg-[#60A5FA] text-white text-sm sm:text-base font-medium sm:font-semibold px-3 py-2 sm:px-4 rounded-xl ">
            {post.type || "Academic"}
            </span>
        </div>
      </div>

      {/* CONTENT BODY */}
      <div className="mb-4">
        <h4 className="font-bold text-lg text-gray-800 mb-2">{post.title}</h4>
        <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
          {post.content}
        </p>
      </div>

      {/* IMAGE ATTACHMENT */}
      {post.image && (
        <div className="w-full bg-gray-100 rounded-lg overflow-hidden mb-4 border border-gray-100">
          <img
            src={post.image}
            alt="post attachment"
            className="w-full h-auto object-cover max-h-[550px]"
          />
        </div>
      )}
      
      <div className="flex justify-end ">
        <button
          className="flex justify-end text-sm sm:text-base cursor-pointer text-gray-500 hover:text-black mb-2"
          onClick={() => onCommentClick?.(post._id, post.postedBy)}
        >
          {post.comments?.length} Comments
        </button>
      </div>
      <hr className="border-gray-200" />
      
      {/* FOOTER ACTIONS */}
      <div className="flex items-center gap-x-5sm:gap-x-0 sm:justify-around pt-3 ">
        <button
          className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors  font-medium cursor-pointer"
          onClick={() => onCommentClick?.(post._id, post.postedBy)}
        >
          <MessageCircle />
          <span className="sm:inline hidden">Comment</span>
        </button>

        {/* UPDATED SAVE BUTTON */}
        <SaveButton
          postId={post._id}
          postType="academic"
          initialIsSaved={isSaved}
          onToggle={() => onToggleSave?.(post._id)}
        />
      </div>

      {/* --- ERROR MODAL --- */}
      {errorModal && (
        <Modal>
          <div className="text-center flex flex-col items-center justify-center p-4">
            <XCircleIcon className="w-12 h-12 text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{errorMessage}</p>
            <Button
              type="button"
              buttonText="Close"
              onClick={() => setErrorModal(false)}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}