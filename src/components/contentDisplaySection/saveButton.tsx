import { Bookmark } from "lucide-react"; // Removed unused BookmarkCheck

interface SaveButtonProps {
  isSaved?: boolean;
  onClick?: () => void;
}

export default function SaveButton({
  isSaved = false,
  onClick,
}: SaveButtonProps) {
  return (
    <button
      className={`flex flex-row items-center gap-2 cursor-pointer transition-colors ${
        isSaved ? "text-[#F9BF3B]" : "text-gray-600 hover:text-black"
      }`}
      // FIX: Use the 'onClick' prop passed from the parent, not 'onToggleSave'
      onClick={(e) => {
        e.stopPropagation(); // Prevents clicking the card background
        onClick?.(); 
      }}
    >
      <Bookmark className={isSaved ? "fill-[#F9BF3B] text-[#F9BF3B]" : ""} />
      <span className="sm:block hidden font-medium">
        {isSaved ? "Saved" : "Save"}
      </span>
    </button>
  );
}