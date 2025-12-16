import { useEffect, useState } from "react";
import api from "../../api/api";
import CommentModal from "../../components/contentDisplaySection/comment/comment";
import EventCard, {
  type EventPost,
} from "../../components/contentDisplaySection/eventContent/eventContent";

interface EventContentProps {
  searchQuery: string;
}

export default function EventContent({ searchQuery }: EventContentProps) {
  const [eventPosts, setEventPosts] = useState<EventPost[]>([]);
  const [searchError, setSearchError] = useState<boolean>(false);

  // Interaction States
  const [commentClicked, setCommentClicked] = useState<{
    [key: string]: boolean;
  }>({});
  const [notifyClicked, setNotifyClicked] = useState<{
    [key: string]: boolean;
  }>({});
  const [savePostClicked, setSavePostClicked] = useState<{
    [key: string]: boolean;
  }>({});

  // Modal States
  const [activeModal, setActiveModal] = useState<{
    id: string;
    postedBy: any;
    data: any[];
    feedType: "event" | "academic" | "report";
  } | null>(null);

  // --- Handlers ---

  const handleToggleNotify = (id: string) => {
    setNotifyClicked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleSave = (id: string) => {
    setSavePostClicked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCommentClick = (id: string, postedBy: any, comments: any[]) => {
    setActiveModal({
      id,
      postedBy,
      data: comments || [],
      feedType: "event",
    });
    setCommentClicked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const closeCommentModal = () => {
    setActiveModal(null);
  };

  // --- Handle Comment Updates (Edit/Delete) ---
  const handleCommentsUpdated = (updatedComments: any[]) => {
    if (!activeModal) return;

    // 1. Update Feed Data
    setEventPosts((prev) =>
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

  // --- API Logic: Fetch Posts ---
  const fetchEventPosts = async () => {
    try {
      const url = searchQuery
        ? `/events/getPosts/event?search=${encodeURIComponent(searchQuery)}`
        : `/events/getPosts/event`;
      const response = await api.get(url);

      if (response.status === 200) {
        setSearchError(false);
        const sortedData = response.data.sort(
          (a: EventPost, b: EventPost) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setEventPosts(sortedData);
      }
    } catch (error) {
      setSearchError(true);
    }
  };

  // --- API Logic: Add Comment ---
  const handleAddComment = async (text: string) => {
    if (!activeModal) return;

    try {
      const response = await api.post(`/events/${activeModal.id}/comments`, {
        text,
      });

      if (response.status === 200) {
        const updatedComments = response.data;

        // Update local state instantly
        setEventPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === activeModal.id
              ? { ...post, comments: updatedComments }
              : post
          )
        );

        // Update Modal Data
        setActiveModal((prev) =>
          prev ? { ...prev, data: updatedComments } : null
        );
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchEventPosts();
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto bg-gray-200 sm:bg-[#f1f3f7]">
      {searchError || (searchQuery && eventPosts.length === 0) ? (
        <div className="flex justify-center">
          <p className="font-semibold text-gray-500">
            No items found matching "{searchQuery}".
          </p>
        </div>
      ) : (
        <>
          {eventPosts.map((post) => (
            <EventCard
              key={post._id}
              post={post}
              isSaved={savePostClicked[post._id] || false}
              isNotify={notifyClicked[post._id] || false}
              isCommentOpen={commentClicked[post._id] || false}
              commentCount={post.comments?.length || 0} //  Use real count
              onToggleSave={handleToggleSave}
              onToggleNotify={handleToggleNotify}
              onCommentClick={(id, postedBy) => handleCommentClick(id, postedBy, post.comments)}
            />
          ))}

          {activeModal && (
            <CommentModal
              postId={activeModal.id}
              postedBy={activeModal.postedBy}
              comments={activeModal.data}
              onClose={closeCommentModal}
              onAddComment={handleAddComment}
              feedType={activeModal.feedType}
              onCommentsUpdated={handleCommentsUpdated}
            />
          )}
        </>
      )}
    </div>
  );
}
