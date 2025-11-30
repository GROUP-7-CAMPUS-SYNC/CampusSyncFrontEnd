import { useEffect, useState } from "react";
import api from "../../api/api";
import { 
    MessageCircle, 
    Bookmark, 
    User, 
} from "lucide-react";

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

// Helper: Calculate relative time (e.g., "5 hours ago")
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

export default function AcademicContent() {
    const [posts, setPosts] = useState<AcademicPost[]>([]);

    const fetchAcademicPosts = async () => {
        try {
            const response = await api.get("/academic/getPosts/academic");
            // Optional: Sort by newest first
            const sortedData = response.data.sort((a: AcademicPost, b: AcademicPost) => 
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setPosts(sortedData);
        } catch (error) {
            console.log("Error fetching academic posts:", error);
        }
    };

    useEffect(() => {
        fetchAcademicPosts();
    }, []);

    return (
        <div className="flex flex-col w-full max-w-2xl mx-auto pb-10">
            {posts.map((post) => {
                // Determine display values
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
                                {/* Organization Avatar */}
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

                                {/* Text Info */}
                                <div className="flex flex-col">
                                    {/* Organization Name (Top) */}
                                    <h3 className="font-bold text-gray-900 leading-tight">
                                        {orgName}
                                    </h3>
                                    
                                    {/* Posted By (Bottom) */}
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        Posted by {posterName} • {timePosted}
                                    </p>
                                </div>
                            </div>

                            {/* Badge */}
                            <span className="bg-[#60A5FA] text-white text-xs font-semibold px-3 py-1 rounded-lg shadow-sm">
                                {post.type || "Academic"}
                            </span>
                        </div>

                        {/* CONTENT BODY */}
                        <div className="mb-4">
                            {/* Title */}
                            <h4 className="font-bold text-lg text-gray-800 mb-2">
                                {post.title}
                            </h4>
                            
                            {/* Content Text */}
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
                            <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium">
                                <MessageCircle size={18} />
                                <span>{post.comments?.length || 0} comments</span>
                            </button>

                            <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium">
                                <Bookmark size={18} />
                                <span>Save</span>
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}