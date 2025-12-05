import { useEffect, useState } from "react";
import api from "../../api/api";
import LostFoundCard, {
  type ReportItem,
} from "../../components/contentDisplaySection/lostfoundContent";
import CommentModal from "../../components/contentDisplaySection/comment";

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
  const [activePostId, setActivePostId] = useState<string | null>(null);
  // We don't need separate modalComments state anymore if we look up from reportItems,
  // but to keep your logic consistent with previous iterations:
  const [modalComments, setModalComments] = useState<any[]>([]);

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
    setActivePostId(null);
    setModalComments([]);
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
    if (!activePostId || activePostId === "view-only-mode") {
      console.error("Missing Post ID");
      return;
    }

    try {
      const response = await api.post(
        `/report_types/${activePostId}/comments`,
        { text }
      );

      if (response.status === 200) {
        const updatedComments = response.data;

        // Update List
        setReportItems((prev) =>
          prev.map((item) =>
            item._id === activePostId
              ? { ...item, comments: updatedComments }
              : item
          )
        );

        // Update Modal View
        setModalComments(updatedComments);
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
                setActivePostId(item._id);
                setModalComments(comments);
              }}
            />
          ))}
        </>
      )}

      {activePostId && (
        <CommentModal
          postId={activePostId}
          comments={modalComments}
          postedBy={null}
          onClose={closeModal}
          onAddComment={handleAddComment} // ✅ Handler Added
        />
      )}
    </div>
  );
}
