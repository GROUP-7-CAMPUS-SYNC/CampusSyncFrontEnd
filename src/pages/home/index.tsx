import { useEffect, useState } from "react";
import api from "../../api/api";
import { X } from "lucide-react";


// --- Import Reusable Cards & Types ---
// Update paths if necessary based on your folder structure
import EventCard, { type EventPost } from "../../components/contentDisplaySection/eventContent";
import AcademicCard, { type AcademicPost } from "../../components/contentDisplaySection/academicContent";
import LostFoundCard, { type ReportItem } from "../../components/contentDisplaySection/lostfoundContent";
import CommentModal from "../event/commentModal";


type FeedItem =
  | (EventPost & { feedType: "event" })
  | (AcademicPost & { feedType: "academic" })
  | (ReportItem & { feedType: "report" });


export default function DashboardContent() {
  const [feedData, setFeedData] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);


  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());
  const [notifyItems, setNotifyItems] = useState<Set<string>>(new Set());
  const [witnessItems, setWitnessItems] = useState<Set<string>>(new Set());
  const [commentOpenItems, setCommentOpenItems] = useState<Set<string>>(new Set());


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
  useEffect(() => {
    const fetchHomeFeed = async () => {
      try {
        setLoading(true);
        const response = await api.get("/dashboard/home");
        if (response.status === 200) {
          setFeedData(response.data);
        }
      } catch (err) {
        console.error("Error fetching home feed", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };


    fetchHomeFeed();
  }, []);


  if (loading) return <div className="flex justify-center p-10">Loading feed...</div>;
  if (error) return <div className="flex justify-center p-10 text-red-500">Failed to load feed.</div>;


  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto pb-10 gap-6">
      {feedData.map((item) => {
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


          case "report":
            return (
              <LostFoundCard
                key={item._id}
                item={item as ReportItem}
                isSaved={savedItems.has(item._id)}
                isWitnessed={witnessItems.has(item._id)}
                // Fixed: Removed commentCount prop
                onToggleSave={handleToggleSave}
                onToggleWitness={handleToggleWitness}
                onCommentClick={handleViewComments}
              />
            );


          default:
            return null;
        }
      })}


      {/* --- MODALS --- */}
      {activeModal?.type === "comment_api" && (
        <CommentModal
          postId={activeModal.id}
          postedBy={activeModal.postedBy}
          onClose={closeModal}
        />
      )}


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

