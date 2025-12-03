import { useEffect, useState } from "react";
import api from "../../api/api";
import CommentModal from "./commentModal";

// ✅ FIX: Added 'type' keyword to EventPost import
import EventCard, { type EventPost } from "../../components/contentDisplaySection/eventContent"; 

interface EventContentProps {
  searchQuery: string;
}

export default function EventContent({ searchQuery }: EventContentProps) {
  const [eventPosts, setEventPosts] = useState<EventPost[]>([]);
  const [searchError, setSearchError] = useState<boolean>(false);

  // Interaction States
  const [commentClicked, setCommentClicked] = useState<{ [key: string]: boolean }>({});
  const [notifyClicked, setNotifyClicked] = useState<{ [key: string]: boolean }>({});
  const [savePostClicked, setSavePostClicked] = useState<{ [key: string]: boolean }>({});

  // Modal States
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [activeUser, setActiveUser] = useState<any>(null);

  // Constants
  const commentCount = 3000;

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

  // --- API Logic ---

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

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchEventPosts();
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <div className="flex flex-col w-full px-5 sm:px-0 max-w-4xl mx-auto">
      {searchError || (searchQuery && eventPosts.length === 0) ? (
        <div className="flex justify-center py-10">
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
              commentCount={commentCount}
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
            />
          )}
        </>
      )}
    </div>
  );
}