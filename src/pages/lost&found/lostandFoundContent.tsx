import { useEffect, useState } from "react";
import api from "../../api/api";
import LostFoundCard, {
  type ReportItem,
} from "../../components/contentDisplaySection/lostFoundContent/lostfoundContent";
import CommentModal from "../../components/contentDisplaySection/comment/comment";

interface LostAndFoundContentProps {
  searchQuery: string;
}

export default function LostAndFoundContent({
  searchQuery,
}: LostAndFoundContentProps) {
  const [reportItems, setReportItems] = useState<ReportItem[]>([]);
  const [searchError, setSearchError] = useState<boolean>(false);

  // Interaction States
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());

  // Modal States
  const [activeModal, setActiveModal] = useState<{
    id: string;
    postedBy: any;
    data: any[];
    feedType: "event" | "academic" | "report";
  } | null>(null);

  // --- Handlers ---
  const handleSaveClick = (itemId: string) => {
    setSavedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  // --- Handle Comment Updates (Edit/Delete) ---
  const handleCommentsUpdated = (updatedComments: any[]) => {
    if (!activeModal) return;

    // 1. Update Feed Data
    setReportItems((prev) =>
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

  // --- API Logic ---

  const fetchLostAndFoundContent = async () => {
    try {
      const url = searchQuery
        ? `/report_types/getPosts/reportItems?search=${encodeURIComponent(
          searchQuery
        )}`
        : "/report_types/getPosts/reportItems";

      const response = await api.get(url);

      if (response.status === 200) {
        setSearchError(false);
        const sortedData = response.data.sort(
          (a: ReportItem, b: ReportItem) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setReportItems(sortedData);
      }
    } catch (error) {
      console.log(error);
      setSearchError(true);
    }
  };

  // --- API Logic: Add Comment ---
  const handleAddComment = async (text: string) => {
    // If ID is missing or placeholder, we can't post
    if (!activeModal || activeModal.id === "view-only-mode") {
      console.error("Missing Post ID");
      return;
    }

    try {
      const response = await api.post(
        `/report_types/${activeModal.id}/comments`,
        { text }
      );

      if (response.status === 200) {
        const updatedComments = response.data;

        // Update List
        setReportItems((prev) =>
          prev.map((item) =>
            item._id === activeModal.id
              ? { ...item, comments: updatedComments }
              : item
          )
        );

        // Update Modal View
        setActiveModal((prev) =>
          prev ? { ...prev, data: updatedComments } : null
        );
      }
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchLostAndFoundContent();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // --- Render ---

  return (
    <div className="w-full max-w-3xl mx-auto  bg-gray-200 sm:bg-[#f1f3f7]">
      {searchError || (searchQuery && reportItems.length === 0) ? (
        <div className="flex justify-center py-10">
          <p className="font-semibold text-gray-500">
            No items found matching "{searchQuery}".
          </p>
        </div>
      ) : (
        <>
          {reportItems.map((item) => (
            <LostFoundCard
              key={item._id}
              item={item}
              isSaved={savedItems.has(item._id)}
              onToggleSave={handleSaveClick}
              onCommentClick={(comments) => {
                setActiveModal({
                  id: item._id,
                  postedBy: null, // LostAndFound items might not have 'postedBy' field readily available or used like this? Assuming null as per previous code.
                  data: comments,
                  feedType: "report",
                });
              }}
            />
          ))}
        </>
      )}

      {activeModal && (
        <CommentModal
          postId={activeModal.id}
          postedBy={activeModal.postedBy}
          comments={activeModal.data}
          onClose={closeModal}
          onAddComment={handleAddComment}
          feedType={activeModal.feedType}
          onCommentsUpdated={handleCommentsUpdated}
        />
      )}
    </div>
  );
}
