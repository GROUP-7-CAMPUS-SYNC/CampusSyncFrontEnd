import { useEffect, useState } from "react";
import api from "../../api/api";
import { Briefcase, GraduationCap, Bookmark, User } from "lucide-react";

import EventCard, { type EventPost } from "../../components/contentDisplaySection/eventContent";
import AcademicCard, { type AcademicPost } from "../../components/contentDisplaySection/academicContent";
import LostFoundCard, { type ReportItem } from "../../components/contentDisplaySection/lostfoundContent";
import CommentModal from "../../components/contentDisplaySection/comment";

type FeedItem = 
  | (EventPost & { feedType: "event" })
  | (AcademicPost & { feedType: "academic" })
  | (ReportItem & { feedType: "report" });

export default function ProfilePage() {
  const [posts, setPosts] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<any>(null); 
  
  // Interaction States
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());
  const [notifyItems, setNotifyItems] = useState<Set<string>>(new Set());
  const [witnessItems, setWitnessItems] = useState<Set<string>>(new Set());
  const [commentOpenItems, setCommentOpenItems] = useState<Set<string>>(new Set());

  // Unified Modal State
  const [activeModal, setActiveModal] = useState<{
    id: string;
    feedType?: "event" | "academic" | "report";
    data?: any; 
    postedBy?: any; 
  } | null>(null);

  // --- Handlers ---
  const handleToggleSave = (id: string) => { setSavedItems((prev) => { const newSet = new Set(prev); if (newSet.has(id)) newSet.delete(id); else newSet.add(id); return newSet; }); };
  const handleToggleNotify = (id: string) => { setNotifyItems((prev) => { const newSet = new Set(prev); if (newSet.has(id)) newSet.delete(id); else newSet.add(id); return newSet; }); };
  const handleToggleWitness = (id: string) => { setWitnessItems((prev) => { const newSet = new Set(prev); if (newSet.has(id)) newSet.delete(id); else newSet.add(id); return newSet; }); };

  // ✅ Unified Handler for ALL types (Event, Academic, Report)
  const handleOpenCommentModal = (id: string, postedBy: any, feedType: "event" | "academic" | "report") => {
    const post = posts.find(p => p._id === id);
    setActiveModal({ 
        id, 
        postedBy, 
        feedType,
        data: post?.comments || [] 
    });
    setCommentOpenItems(prev => new Set(prev).add(id));
  };

  const closeModal = () => {
    if (activeModal) {
       setCommentOpenItems(prev => { const newSet = new Set(prev); newSet.delete(activeModal.id); return newSet; });
    }
    setActiveModal(null);
  };

  // --- ✅ Handle Adding Comment (Supports all types) ---
  const handleAddComment = async (text: string) => {
    if (!activeModal || !activeModal.id || !activeModal.feedType) return;

    try {
        let endpoint = "";
        if (activeModal.feedType === "event") endpoint = `/events/${activeModal.id}/comments`;
        else if (activeModal.feedType === "academic") endpoint = `/academic/${activeModal.id}/comments`;
        else if (activeModal.feedType === "report") endpoint = `/report_types/${activeModal.id}/comments`; // ✅ Added Report Logic
        
        const response = await api.post(endpoint, { text });

        if (response.status === 200) {
            const updatedComments = response.data;
            
            // Update local state instantly
            setPosts(prev => prev.map(item => 
                item._id === activeModal.id ? { ...item, comments: updatedComments } : item
            ));
            
            // Update active modal data
            setActiveModal(prev => prev ? { ...prev, data: updatedComments } : null);
        }
    } catch (error) {
        console.error("Failed to add comment:", error);
    }
  };

  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/profile/my-posts"); 
      setPosts(response.data);
      if (response.data.length > 0 && response.data[0].postedBy) {
        setUserInfo(response.data[0].postedBy);
      }
    } catch (error) {
      console.error("Error fetching profile posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUserPosts(); }, []);

  return (
    <div className="w-full max-w-4xl mx-auto pb-10">
      
      {/* 1. PROFILE HEADER */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden mb-8 border border-gray-200">
        <div className="h-32 bg-linear-to-r from-blue-600 to-indigo-600"></div>
        <div className="px-6 pb-6 relative">
            <div className="absolute -top-12 left-6 border-4 border-white rounded-full bg-white z-10">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                     {localStorage.getItem("profileLink") ? <img src={localStorage.getItem("profileLink")!} className="w-full h-full object-cover" /> : <User size={40} className="text-gray-400"/>}
                </div>
            </div>
            <div className="pt-14 sm:pt-2 sm:pl-28 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                        {userInfo ? `${userInfo.firstname} ${userInfo.lastname}` : "My Profile"}
                    </h1>
                    <div className="flex flex-col gap-1 mt-1 text-gray-600 text-sm">
                        <div className="flex items-center gap-2"> <Briefcase size={14} /> <span>Student / User</span> </div>
                        <div className="flex items-center gap-2"> <GraduationCap size={14} /> <span>University Student</span> </div>
                    </div>
                </div>
                <div className="flex gap-6 text-center">
                    <div> <p className="font-bold text-gray-900 text-lg">{posts.length}</p> <p className="text-xs text-gray-500 uppercase tracking-wide">Posts</p> </div>
                    <div> <p className="font-bold text-gray-900 text-lg">0</p> <p className="text-xs text-gray-500 uppercase tracking-wide">Following</p> </div>
                </div>
            </div>
        </div>
      </div>

      {/* 2. FEED */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-2/3 mx-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-4">My Posts</h2>
            {loading ? (
                 <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-gray-200">Loading profile activity...</div>
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
                                        commentCount={item.comments?.length || 0}
                                        onToggleSave={handleToggleSave}
                                        onToggleNotify={handleToggleNotify}
                                        onCommentClick={(id, postedBy) => handleOpenCommentModal(id, postedBy, "event")}
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
                                        onCommentClick={(id, postedBy) => handleOpenCommentModal(id, postedBy, "academic")}
                                    />
                                );
                            case "report": 
                                return (
                                    <LostFoundCard
                                        key={item._id}
                                        item={item as ReportItem}
                                        isSaved={savedItems.has(item._id)}
                                        isWitnessed={witnessItems.has(item._id)}
                                        onToggleSave={handleToggleSave}
                                        onToggleWitness={handleToggleWitness}
                                        // ✅ Use Unified Handler (Matches Dashboard Logic)
                                        onCommentClick={() => handleOpenCommentModal(item._id, null, "report")}
                                    />
                                );
                            default: return null;
                        }
                    })}
                </div>
            )}
        </div>
      </div>

      {/* --- Unified Comment Modal --- */}
      {activeModal && (
        <CommentModal
          postId={activeModal.id}
          postedBy={activeModal.postedBy}
          comments={activeModal.data}
          onClose={closeModal}
          onAddComment={handleAddComment} 
        />
      )}
    </div>
  );
}