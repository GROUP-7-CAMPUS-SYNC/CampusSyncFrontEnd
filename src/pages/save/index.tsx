import { useEffect, useState } from "react";
import api from "../../api/api";
import { BookmarkX, Loader2 } from "lucide-react";

// --- Import Reusable Cards & Types ---
import EventCard, {
  type EventPost,
} from "../../components/contentDisplaySection/eventContent/eventContent";
import AcademicCard, {
  type AcademicPost,
} from "../../components/contentDisplaySection/academicContent/academicContent";
import LostFoundCard, {
  type ReportItem,
} from "../../components/contentDisplaySection/lostFoundContent/lostfoundContent";
import CommentModal from "../../components/contentDisplaySection/comment/comment";

// Unified Type Definition
type FeedItem =
  | (EventPost & { feedType: "event" })
  | (AcademicPost & { feedType: "academic" })
  | (ReportItem & { feedType: "report" });

export default function SavedContent() {
  const [savedPosts, setSavedPosts] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // --- Interaction States ---
  const [notifyItems, setNotifyItems] = useState<Set<string>>(new Set());
  const [commentOpenItems, setCommentOpenItems] = useState<Set<string>>(
    new Set()
  );

  // --- Modal State ---
  const [activeModal, setActiveModal] = useState<{
    id: string;
    feedType: "event" | "academic" | "report"; // Removed '?' to enforce type safety
    data?: any;
    postedBy?: any;
  } | null>(null);

  // ==============================
  // 1. HANDLERS
  // ==============================

  // UNSAVE HANDLER: Removes item from the UI immediately
  const handleRemoveSaved = (id: string) => {
    setSavedPosts((prev) => prev.filter((item) => item._id !== id));
  };

  const handleToggleNotify = (id: string) => {
    setNotifyItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  // Unified Comment Modal Opener
  const handleOpenCommentModal = (
    id: string,
    postedBy: any,
    feedType: "event" | "academic" | "report",
    comments: any[]
  ) => {
    setActiveModal({ id, postedBy, feedType, data: comments || [] });
    setCommentOpenItems((prev) => new Set(prev).add(id));
  };

  const closeModal = () => {
    if (activeModal) {
      setCommentOpenItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(activeModal.id);
        return newSet;
      });
    }
    setActiveModal(null);
  };

  // Handle Adding Comment
  const handleAddComment = async (text: string) => {
    if (!activeModal || !activeModal.id || !activeModal.feedType) return;

    try {
      let endpoint = "";
      if (activeModal.feedType === "event")
        endpoint = `/events/${activeModal.id}/comments`;
      else if (activeModal.feedType === "academic")
        endpoint = `/academic/${activeModal.id}/comments`;
      else if (activeModal.feedType === "report")
        endpoint = `/report_types/${activeModal.id}/comments`;

      const response = await api.post(endpoint, { text });

      if (response.status === 200) {
        const updatedComments = response.data;

        // Update List Logic
        setSavedPosts((prev) =>
          prev.map((item) =>
            item._id === activeModal.id
              ? { ...item, comments: updatedComments }
              : item
          )
        );

        // Update Modal Logic
        setActiveModal((prev) =>
          prev ? { ...prev, data: updatedComments } : null
        );
      }
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  // --- Handle Comment Updates (Edit/Delete) ---
  const handleCommentsUpdated = (updatedComments: any[]) => {
    if (!activeModal) return;

    // 1. Update Saved Posts List
    setSavedPosts((prev) =>
      prev.map((item) =>
        item._id === activeModal.id
          ? { ...item, comments: updatedComments }
          : item
      )
    );

    // 2. Update Modal Data
    setActiveModal((prev) =>
      prev ? { ...prev, data: updatedComments } : null
    );
  };

  // ==============================
  // 2. FETCH DATA
  // ==============================
  useEffect(() => {
    const fetchSavedFeed = async () => {
      try {
        setLoading(true);
        const response = await api.get("/saved/all");

        if (response.status === 200) {
          setSavedPosts(response.data);
        }
      } catch (err) {
        console.error("Error fetching saved feed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedFeed();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin text-blue-500" />
      </div>
    );

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto pb-10 py-6 bg-gray-200 sm:bg-[#f1f3f7]">
      {savedPosts.length === 0 && (
        <div className="flex flex-col items-center justify-center text-gray-400 mt-20 gap-4">
          <BookmarkX size={48} />
          <p>You haven't saved any posts yet.</p>
        </div>
      )}

      {savedPosts.map((item) => {
        switch (item.feedType) {
          case "event":
            return (
              <EventCard
                key={item._id}
                post={item as EventPost}
                isSaved={true}
                isNotify={notifyItems.has(item._id)}
                isCommentOpen={commentOpenItems.has(item._id)}
                commentCount={item.comments?.length || 0}
                onToggleSave={() => handleRemoveSaved(item._id)}
                onToggleNotify={() => handleToggleNotify(item._id)}
                onCommentClick={(id, postedBy) =>
                  handleOpenCommentModal(id, postedBy, "event", item.comments)
                }
              />
            );

          case "academic":
            return (
              <AcademicCard
                key={item._id}
                post={item as AcademicPost}
                isSaved={true}
                isCommentOpen={commentOpenItems.has(item._id)}
                onToggleSave={() => handleRemoveSaved(item._id)}
                onCommentClick={(id, postedBy) =>
                  handleOpenCommentModal(
                    id,
                    postedBy,
                    "academic",
                    item.comments
                  )
                }
              />
            );

          case "report":
            return (
              <LostFoundCard
                key={item._id}
                item={item as ReportItem}
                isSaved={true}
                onToggleSave={() => handleRemoveSaved(item._id)}
                onCommentClick={(comments) =>
                  handleOpenCommentModal(item._id, null, "report", comments)
                }
              />
            );

          default:
            return null;
        }
      })}

      {/* --- Unified Comment Modal --- */}
      {activeModal && (
        <CommentModal
          postId={activeModal.id}
          postedBy={activeModal.postedBy}
          comments={activeModal.data}
          onClose={closeModal}
          onAddComment={handleAddComment}
          // IMPORTANT FIXES:
          feedType={activeModal.feedType} // 1. Pass feedType
          onCommentsUpdated={handleCommentsUpdated} // 2. Handle updates
        />
      )}
    </div>
  );
}