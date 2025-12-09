import { useEffect, useState } from "react";
import api from "../../api/api";

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
import CommentModal from "../../components/contentDisplaySection/comment";

type FeedItem =
  | (EventPost & { feedType: "event" })
  | (AcademicPost & { feedType: "academic" })
  | (ReportItem & { feedType: "report" });

export default function DashboardContent() {
  const [feedData, setFeedData] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  // States
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());
  const [notifyItems, setNotifyItems] = useState<Set<string>>(new Set());
  const [commentOpenItems, setCommentOpenItems] = useState<Set<string>>(
    new Set()
  );

  // Modal State (Unified)
  const [activeModal, setActiveModal] = useState<{
    id: string;
    feedType?: "event" | "academic" | "report";
    data?: any; // Comments array
    postedBy?: any;
  } | null>(null);

  // --- Handlers ---
  const handleToggleSave = (id: string) => {
    setSavedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };
  const handleToggleNotify = (id: string) => {
    setNotifyItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  // Unified Handler for Opening Comment Modal
  const handleOpenCommentModal = (
    id: string,
    postedBy: any,
    feedType: "event" | "academic" | "report",
    comments: any[]
  ) => {
    setActiveModal({
      id,
      postedBy,
      feedType,
      data: comments || [],
    });
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

  // --- Handle Adding Comment ---
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

        // 1. Update Feed Data (background update for comment count)
        setFeedData((prev) =>
          prev.map((item) =>
            item._id === activeModal.id
              ? { ...item, comments: updatedComments }
              : item
          )
        );

        // 2. Update Modal Data (foreground update for list)
        setActiveModal((prev) =>
          prev ? { ...prev, data: updatedComments } : null
        );
      }
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
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

  if (loading)
    return <div className="flex justify-center p-10">Loading feed...</div>;
  if (error)
    return (
      <div className="flex justify-center p-10 text-red-500">
        Failed to load feed.
      </div>
    );

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto py-6 pb-10 bg-gray-200 sm:bg-[#f1f3f7]">
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
                commentCount={item.comments?.length || 0}
                onToggleSave={handleToggleSave}
                onToggleNotify={handleToggleNotify}
                // Use Unified Handler
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
                isSaved={savedItems.has(item._id)}
                isCommentOpen={commentOpenItems.has(item._id)}
                onToggleSave={handleToggleSave}
                // Use Unified Handler
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
                isSaved={savedItems.has(item._id)}
                onToggleSave={handleToggleSave}
                // Use Unified Handler (Pass null for postedBy if not needed for placeholder)
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
        />
      )}
    </div>
  );
}
