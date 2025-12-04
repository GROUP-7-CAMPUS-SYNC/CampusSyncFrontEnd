import { useState, useEffect } from "react";
import { Bookmark, Loader2 } from "lucide-react";
import api from "../../api/api"; 

interface SaveButtonProps {
  postId: string;
  postType: "event" | "academic" | "report"; 
  initialIsSaved?: boolean;
  onToggle?: (newStatus: boolean) => void; 
}

export default function SaveButton({
  postId,
  postType,
  initialIsSaved = false,
  onToggle,
}: SaveButtonProps) {
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  // Helper: Map Frontend Types to Backend Model Names
  const getBackendType = (type: string) => {
    switch (type) {
      case "event": return "Event";
      case "academic": return "Academic";
      case "report": return "ReportItem";
      default: throw new Error("Invalid post type");
    }
  };

  // 1. SYNC ON MOUNT: Check DB if this user actually saved this post
  useEffect(() => {
    let isMounted = true; 

    const fetchSavedStatus = async () => {
      try {
        const backendType = getBackendType(postType);
        // Hits your new route: /api/saved/check/:type/:postId
        const response = await api.get(`/saved/check/${backendType}/${postId}`);
        
        if (isMounted && response.data) {
           setIsSaved(response.data.isSaved);
        }
      } catch (error) {
        console.error("Failed to sync saved status:", error);
      } finally {
        if (isMounted) setCheckingStatus(false);
      }
    };

    fetchSavedStatus();

    return () => { isMounted = false; };
  }, [postId, postType]);

  // 2. TOGGLE LOGIC
  const handleSaveClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (loading) return;

    // Optimistic Update
    const newStatus = !isSaved;
    setIsSaved(newStatus);
    
    if (onToggle) onToggle(newStatus);

    try {
      setLoading(true);
      const backendType = getBackendType(postType);

      // Hits your toggle route: /api/saved/toggle
      await api.post("/saved/toggle", {
        postId: postId,
        type: backendType
      });

    } catch (error) {
      console.error("Failed to save:", error);
      // Revert UI if API fails
      setIsSaved(!newStatus);
      if (onToggle) onToggle(!newStatus);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSaveClick}
      disabled={loading}
      className={`flex flex-row items-center gap-2 cursor-pointer transition-colors ${
        isSaved ? "text-[#F9BF3B]" : "text-gray-600 hover:text-black"
      }`}
    >
      {loading || checkingStatus ? (
         // Show spinner while saving OR while initially checking DB
         <Loader2 className="animate-spin w-5 h-5" />
      ) : (
         <Bookmark className={isSaved ? "fill-[#F9BF3B] text-[#F9BF3B]" : ""} />
      )}
      <span className="sm:block hidden font-medium">
        {isSaved ? "Saved" : "Save"}
      </span>
    </button>
  );
}