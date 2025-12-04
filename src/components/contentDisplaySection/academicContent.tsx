import { MessageCircle, User } from "lucide-react";
import SaveButton from "./saveButton";

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
    isCommentOpen = false,
    onToggleSave,
    onCommentClick,
}: AcademicCardProps) {
    
    const orgName = post.organization?.organizationName || "Unknown Organization";
    const orgImage = post.organization?.profileLink;
    const posterName = post.postedBy 
        ? `${post.postedBy.firstname} ${post.postedBy.lastname}` 
        : "Unknown User";
    const timePosted = timeAgo(post.createdAt);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-5">
            {/* HEADER */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center border border-gray-100">
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
                        <h3 className="font-bold text-gray-900 leading-tight">
                            {orgName}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Posted by {posterName} • {timePosted}
                        </p>
                    </div>
                </div>

                <span className="inline-flex items-center bg-[#60A5FA] text-white text-sm sm:text-base font-medium sm:font-semibold px-3 py-2 sm:px-4 rounded-xl shadow-sm">
                    {post.type || "Academic"}
                </span>
            </div>

            {/* CONTENT BODY */}
            <div className="mb-4">
                <h4 className="font-bold text-lg text-gray-800 mb-2">
                    {post.title}
                </h4>
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
                        className="w-full h-auto object-cover max-h-[500px]"
                    />
                </div>
            )}

            {/* FOOTER ACTIONS */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <button
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium"
                    onClick={() => onCommentClick?.(post._id, post.postedBy)}
                >
                    <MessageCircle
                        size={18}
                        className={`${isCommentOpen ? "text-[#F9BF3B]" : ""}`}
                    />
                    <span className={`${isCommentOpen ? "text-[#F9BF3B]" : ""}`}>
                        Comment
                    </span>
                </button>

                {/* UPDATED SAVE BUTTON */}
                <SaveButton
                    postId={post._id}
                    postType="academic"
                    initialIsSaved={isSaved}
                    onToggle={() => onToggleSave?.(post._id)}
                />
            </div>
        </div>
    );
}