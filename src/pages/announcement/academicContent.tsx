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
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [activeUser, setActiveUser] = useState<any>(null);

  // --- Handlers ---

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
    if (!activePostId) return;

    try {
      const response = await api.post(`/academic/${activePostId}/comments`, {
        text,
      });

      if (response.status === 200) {
        const updatedComments = response.data;

        // Update local state instantly
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === activePostId
              ? { ...post, comments: updatedComments }
              : post
          )
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

  // Helper: Find Active Post Data
  const activePostData = posts.find((p) => p._id === activePostId);

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
              onCommentClick={handleCommentClick}
            />
          ))}
        </>
      )}

      {activePostId && (
        <CommentModal
          postId={activePostId}
          postedBy={activeUser}
          comments={activePostData?.comments || []} // Pass real comments
          feedType="academic"
          onClose={closeCommentModal}
          onAddComment={handleAddComment} // Connect handler
        />
      )}
    </div>
  );
}
