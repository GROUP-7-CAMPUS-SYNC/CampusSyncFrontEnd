import { useEffect, useState } from "react";
import api from "../../api/api";
import { 
    MessageCircle, 
    Bookmark, 
    BookmarkCheck, // Added Check icon for saved state
    User, 
} from "lucide-react";
import CommentModal from "./commentModal";

// Interface matching your Academic Model
interface AcademicPost {
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

// ✅ 1. Add Props Interface
interface AcademicContentProps {
    searchQuery: string;
}

// Helper: Calculate relative time
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

// ✅ 2. Accept Prop
export default function AcademicContent({ searchQuery }: AcademicContentProps) {
    const [posts, setPosts] = useState<AcademicPost[]>([]);
    const [commentClicked, setCommentClicked] = useState<{ [key: string]: boolean }>({});
    const [savePostClicked, setSavePostClicked] = useState<{ [key: string]: boolean }>({});
    
    // New State for search feedback
    const [searchError, setSearchError] = useState<boolean>(false);

    const [activePostId, setActivePostId] = useState<string | null>(null);
    const [activeUser, setActiveUser] = useState<any>(null);

    const openCommentModal = (postId: string, postedBy: any) => {
        setActivePostId(postId);
        setActiveUser(postedBy);
    };

    const closeCommentModal = () => {
        setActivePostId(null);
    };

    const fetchAcademicPosts = async () => {
        try {
            // ✅ 3. Dynamic URL Construction
            // Ensure your backend endpoint '/academic/getPosts/academic' supports ?search=...
            const url = searchQuery
                ? `/academic/getPosts/academic?search=${encodeURIComponent(searchQuery)}`
                : "/academic/getPosts/academic";

            const response = await api.get(url);
            
            if (response.status === 200) {
                setSearchError(false);
                const sortedData = response.data.sort((a: AcademicPost, b: AcademicPost) => 
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setPosts(sortedData);
            }
        } catch (error) {
            console.log("Error fetching academic posts:", error);
            setSearchError(true);
        }
    };

    // ✅ 4. Trigger on search change
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchAcademicPosts();
        }, 500); 

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    return (
        <div className="flex flex-col w-full max-w-4xl mx-auto pb-10">
            {/* ✅ 5. Handle Search Feedback */}
            {searchError || (searchQuery && posts.length === 0) ? (
                <div className="flex justify-center py-10">
                    <p className="font-semibold text-gray-500">No academic posts found matching "{searchQuery}".</p>
                </div>
            ) : (
                <>
                    {posts.map((post) => {
                        const orgName = post.organization?.organizationName || "Unknown Organization";
                        const orgImage = post.organization?.profileLink;
                        const posterName = post.postedBy 
                            ? `${post.postedBy.firstname} ${post.postedBy.lastname}` 
                            : "Unknown User";
                        const timePosted = timeAgo(post.createdAt);

                        return (
                            <div 
                                key={post._id} 
                                className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-5"
                            >
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
                                        onClick={() => {
                                            openCommentModal(post._id, post.postedBy);
                                            setCommentClicked((prev) => ({ 
                                                ...prev, 
                                                [post._id]: !prev[post._id]
                                            }));
                                        }}
                                    >
                                        <MessageCircle
                                            size={18}
                                            className={`${commentClicked[post._id] ? "text-[#F9BF3B]" : ""}`}
                                        />
                                        <span className={`${commentClicked[post._id] ? "text-[#F9BF3B]" : ""}`}>
                                            Comment
                                        </span>
                                    </button>

                                    <button
                                        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium"
                                        onClick={() =>
                                            setSavePostClicked((prev) => ({
                                                ...prev,
                                                [post._id]: !prev[post._id],
                                            }))
                                        }
                                    >
                                        {savePostClicked[post._id] ? (
                                            <BookmarkCheck size={18} className="text-[#F9BF3B]" />
                                        ) : (
                                            <Bookmark size={18} />
                                        )}
                                        <span className={`${savePostClicked[post._id] ? "text-[#F9BF3B]" : ""}`}>
                                            {savePostClicked[post._id] ? "Saved" : "Save"}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </>
            )}

            {activePostId && (
                <CommentModal
                    postId={activePostId}
                    postedBy={activeUser}
                    onClose={closeCommentModal}
                />
            )}
        </div>
    );
}