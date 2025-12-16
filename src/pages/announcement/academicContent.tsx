import { useEffect, useState } from "react";
import api from "../../api/api";
import CommentModal from "../../components/contentDisplaySection/comment/comment";
import AcademicCard, {
  type AcademicPost,
} from "../../components/contentDisplaySection/academicContent/academicContent";

interface AcademicContentProps {
  searchQuery: string;
}

export default function AcademicContent({ searchQuery }: AcademicContentProps) {
  const [posts, setPosts] = useState<AcademicPost[]>([]);
  const [searchError, setSearchError] = useState<boolean>(false);

  // Interaction State
  const [commentClicked, setCommentClicked] = useState<{
    [key: string]: boolean;
  }>({});
  const [savePostClicked, setSavePostClicked] = useState<{
    [key: string]: boolean;
  }>({});

  // Modal State
  const [activeModal, setActiveModal] = useState<{
    id: string;
    postedBy: any;
    data: any[];
    feedType: "event" | "academic" | "report";
  } | null>(null);

  // --- Handlers ---

  const handleToggleSave = (id: string) => {
    setSavePostClicked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCommentClick = (id: string, postedBy: any, comments: any[]) => {
    setActiveModal({
      id,
      postedBy,
      data: comments || [],
      feedType: "academic",
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
    setPosts((prev) =>
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

  // --- API Logic: Fetch ---
  const fetchAcademicPosts = async () => {
    try {
      const url = searchQuery
        ? `/academic/getPosts/academic?search=${encodeURIComponent(
          searchQuery
        )}`
        : "/academic/getPosts/academic";

      const response = await api.get(url);

      if (response.status === 200) {
        setSearchError(false);
        const sortedData = response.data.sort(
          (a: AcademicPost, b: AcademicPost) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setPosts(sortedData);
      }
    } catch (error) {
      console.log("Error fetching academic posts:", error);
      setSearchError(true);
    }
  };

  // --- API Logic: Add Comment ---
  const handleAddComment = async (text: string) => {
    if (!activeModal) return;

    try {
      const response = await api.post(`/academic/${activeModal.id}/comments`, {
        text,
      });

      if (response.status === 200) {
        const updatedComments = response.data;

        // Update local state instantly
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === activeModal.id
              ? { ...post, comments: updatedComments }
              : post
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
      fetchAcademicPosts();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto  bg-gray-200 sm:bg-[#f1f3f7]">
      {searchError || (searchQuery && posts.length === 0) ? (
        <div className="flex justify-center py-10">
          <p className="font-semibold text-gray-500">
            No academic posts found matching "{searchQuery}".
          </p>
        </div>
      ) : (
        <>
          {posts.map((post) => (
            <AcademicCard
              key={post._id}
              post={post}
              isSaved={savePostClicked[post._id] || false}
              isCommentOpen={commentClicked[post._id] || false}
              onToggleSave={handleToggleSave}
              onCommentClick={(id, postedBy) => handleCommentClick(id, postedBy, post.comments)}
            />
          ))}
        </>
      )}

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
    </div>
  );
}
