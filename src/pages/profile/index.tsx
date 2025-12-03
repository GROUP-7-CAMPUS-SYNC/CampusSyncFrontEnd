import { useEffect, useState } from "react";
import api from "../../api/api";
import {
  Briefcase,
  GraduationCap,
  Bookmark,
  X
} from "lucide-react";

// --- Import Reusable Cards & Types ---

import EventCard, { type EventPost } from "../../components/contentDisplaySection/eventContent";
import AcademicCard, { type AcademicPost } from "../../components/contentDisplaySection/academicContent";
import LostFoundCard, { type ReportItem } from "../../components/contentDisplaySection/lostfoundContent";
import CommentModal from "../event/commentModal"; 

// --- Types ---
type FeedItem = 
  | (EventPost & { feedType: "event" })
  | (AcademicPost & { feedType: "academic" })
  | (ReportItem & { feedType: "report" });

export default function ProfilePage() {
  const [posts, setPosts] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<any>(null); 
  
  // --- Interaction States ---
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());
  const [notifyItems, setNotifyItems] = useState<Set<string>>(new Set());
  const [witnessItems, setWitnessItems] = useState<Set<string>>(new Set());
  const [commentOpenItems, setCommentOpenItems] = useState<Set<string>>(new Set());

  // --- Modal State ---
  const [activeModal, setActiveModal] = useState<{
    type: "comment_api" | "comment_list"; 
    id: string;
    data?: any; 
    postedBy?: any; 
  } | null>(null);

  // --- Handlers ---
  const handleToggleSave = (id: string) => {
    setSavedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id); else newSet.add(id);
      return newSet;
    });
  };

  const handleToggleNotify = (id: string) => {
    setNotifyItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id); else newSet.add(id);
      return newSet;
    });
  };

  const handleToggleWitness = (id: string) => {
    setWitnessItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id); else newSet.add(id);
      return newSet;
    });
  };

  const handleOpenCommentForm = (id: string, postedBy: any) => {
    setActiveModal({ type: "comment_api", id, postedBy });
    setCommentOpenItems(prev => new Set(prev).add(id));
  };

  const handleViewComments = (comments: any[]) => {
    setActiveModal({ type: "comment_list", id: "", data: comments });
  };

  const closeModal = () => {
    if (activeModal?.type === "comment_api") {
       setCommentOpenItems(prev => {
           const newSet = new Set(prev);
           newSet.delete(activeModal.id);
           return newSet;
       });
    }
    setActiveModal(null);
  };

  // --- Fetch Data ---
  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/profile/my-posts"); 
      setPosts(response.data);
      
      // If we have posts, grab the user info from the first one 
      // (Assuming the backend populates postedBy on these items)
      if (response.data.length > 0 && response.data[0].postedBy) {
        setUserInfo(response.data[0].postedBy);
      }
    } catch (error) {
      console.error("Error fetching profile posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, []);

  // --- RENDER ---
  return (
    <div className="w-full max-w-4xl mx-auto pb-10">
      
      {/* 1. PROFILE HEADER (Preserved Design) */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden mb-8 border border-gray-200">
        {/* Cover Image */}
        <div className="h-32 bg-linear-to-r from-blue-600 to-indigo-600"></div>
        
        <div className="px-6 pb-6 relative">
            {/* Avatar - Absolute Positioned */}
            <div className="absolute -top-12 left-6 border-4 border-white rounded-full bg-white z-10">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                     <img
                      src={`${localStorage.getItem("profileLink")}`}
                     />

                     
                </div>
            </div>

            {/* Info Section - Adjusted Spacing */}
            <div className="pt-14 sm:pt-2 sm:pl-28 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                        {userInfo ? `${userInfo.firstname} ${userInfo.lastname}` : "My Profile"}
                    </h1>
                    <div className="flex flex-col gap-1 mt-1 text-gray-600 text-sm">
                        <div className="flex items-center gap-2">
                            <Briefcase size={14} />
                            <span>Student / User</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <GraduationCap size={14} />
                            <span>University Student</span> 
                        </div>
                    </div>
                </div>

                <div className="flex gap-6 text-center">
                    <div>
                        <p className="font-bold text-gray-900 text-lg">{posts.length}</p>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Posts</p>
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 text-lg">0</p>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Following</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* 2. FEED SECTION */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Main Feed */}
        <div className="w-full lg:w-2/3 mx-auto">
            {/* Renamed "Activity History" to "My Posts" */}
            <h2 className="text-xl font-bold text-gray-800 mb-4">My Posts</h2>
            
            {loading ? (
                 <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-gray-200">
                    Loading profile activity...
                 </div>
            ) : posts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Bookmark size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No posts yet</h3>
                    <p className="text-gray-500 text-sm">Posts you create will appear here.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {posts.map((item) => {
                        switch (item.feedType) {
                            case "event":
                                return (
                                    <EventCard
                                        key={item._id}
                                        post={item as EventPost}
                                        isSaved={savedItems.has(item._id)}
                                        isNotify={notifyItems.has(item._id)}
                                        isCommentOpen={commentOpenItems.has(item._id)}
                                        commentCount={3000}
                                        onToggleSave={handleToggleSave}
                                        onToggleNotify={handleToggleNotify}
                                        onCommentClick={handleOpenCommentForm}
                                    />
                                );
                            case "academic":
                                return (
                                    <AcademicCard
                                        key={item._id}
                                        post={item as AcademicPost}
                                        isSaved={savedItems.has(item._id)}
                                        isCommentOpen={commentOpenItems.has(item._id)}
                                        onToggleSave={handleToggleSave}
                                        onCommentClick={handleOpenCommentForm}
                                    />
                                );
                            case "report": // Lost & Found
                                return (
                                    <LostFoundCard
                                        key={item._id}
                                        item={item as ReportItem}
                                        isSaved={savedItems.has(item._id)}
                                        isWitnessed={witnessItems.has(item._id)}
                                        // Removed commentCount prop as per previous fix
                                        onToggleSave={handleToggleSave}
                                        onToggleWitness={handleToggleWitness}
                                        onCommentClick={handleViewComments}
                                    />
                                );
                            default:
                                return null;
                        }
                    })}
                </div>
            )}
        </div>
      </div>

      {/* --- MODALS --- */}
      
      {/* 1. Modal for Adding Comments (Event/Academic) */}
      {activeModal?.type === "comment_api" && (
        <CommentModal
          postId={activeModal.id}
          postedBy={activeModal.postedBy}
          onClose={closeModal}
        />
      )}

      {/* 2. Modal for Viewing Comments List (Lost & Found) */}
      {activeModal?.type === "comment_list" && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-96 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Comments</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-4">
              {activeModal.data && activeModal.data.length > 0 ? (
                <div className="space-y-3">
                  {activeModal.data.map((c: any, index: number) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-700">{JSON.stringify(c)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 text-sm py-8">No comments yet</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}