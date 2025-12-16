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
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [activeUser, setActiveUser] = useState<any>(null);

  // --- Handlers ---

  const handleToggleNotify = (id: string) => {
    setNotifyClicked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleSave = (id: string) => {
    setSavePostClicked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCommentClick = (id: string, postedBy: any) => {
    setActivePostId(id);
    setActiveUser(postedBy);
    setCommentClicked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const closeCommentModal = () => {
    setActivePostId(null);
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
    if (!activePostId) return;

    try {
      const response = await api.post(`/events/${activePostId}/comments`, {
        text,
      });

      if (response.status === 200) {
        const updatedComments = response.data;

        // Update local state instantly
        setEventPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === activePostId
              ? { ...post, comments: updatedComments }
              : post
          )
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

  // Helper: Find Active Post Data
  const activePostData = eventPosts.find((p) => p._id === activePostId);

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
              onCommentClick={handleCommentClick}
            />
          ))}

          {activePostId && (
            <CommentModal
              postId={activePostId}
              postedBy={activeUser}
              onClose={closeCommentModal}
              comments={activePostData?.comments || []} //  Pass real comments
              feedType="event"
              onAddComment={handleAddComment} //  Connect handler
            />
          )}
        </>
      )}
    </div>
  );
}
