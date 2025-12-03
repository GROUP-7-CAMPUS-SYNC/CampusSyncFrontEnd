import { User, MapPin, Clock, Eye, MessageCircle, Bookmark, BookmarkCheck } from "lucide-react";

// --- Helper: Format Time ---
const timeAgo = (dateString: string) => {
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  if (diffInSeconds < 60) return "Just now";
  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  return past.toLocaleDateString();
};

// --- Types ---
interface PostedByUser {
  _id: string;
  firstname: string;
  lastname: string;
  profileLink: string;
}

export interface ReportItem {
  _id: string;
  reportType: "Lost" | "Found";
  itemName: string;
  description: string;
  turnOver: string;
  locationDetails: string;
  contactDetails: string;
  dateLostOrFound: string;
  image: string;
  postedBy: PostedByUser | null;
  status: string;
  witnesses: any[];
  comments: any[];
  createdAt: string;
}

interface LostFoundCardProps {
  item: ReportItem;
  isSaved?: boolean;
  isWitnessed?: boolean;
  onToggleSave?: (id: string) => void;
  onToggleWitness?: (id: string) => void;
  onCommentClick?: (comments: any[]) => void;
}

export default function LostFoundCard({
  item,
  isSaved = false,
  isWitnessed = false,
  onToggleSave,
  onToggleWitness,
  onCommentClick,
}: LostFoundCardProps) {
  
  const posterName = item.postedBy 
    ? `${item.postedBy.firstname} ${item.postedBy.lastname}` 
    : "Unknown User";

  const avatarSrc = item.postedBy?.profileLink;

  return (
    <div className="w-full bg-white shadow-md rounded-xl p-5 mb-6 border border-gray-200 mx-auto">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                className="w-full h-full object-cover"
                alt="user avatar"
              />
            ) : (
              <User size={20} className="text-white" />
            )}
          </div>
          <div>
            <p className="font-semibold">{posterName}</p>
            <p className="text-xs text-gray-500">
              {item.createdAt ? timeAgo(item.createdAt) : "Just now"}
            </p>
          </div>
        </div>

        <span
          className={`px-3 py-1 rounded-lg text-sm text-white ${
            item.reportType === "Lost" ? "bg-red-400" : "bg-green-400"
          }`}
        >
          {item.reportType}
        </span>
      </div>

      {/* MAIN IMAGE */}
      <div className="w-full h-56 bg-gray-200 rounded-lg mt-4 mb-4 flex items-center justify-center">
        {item.image ? (
          <img
            src={item.image}
            alt="item"
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <span className="text-gray-500">No Image</span>
        )}
      </div>

      {/* --- DETAILS --- */}
      <div className="space-y-3">
        <div className="flex flex-col bg-[#EFF6FF] px-2 sm:px-4 py-2 rounded-lg">
          <p className="text-[#4B4D51] text-sm font-semibold">Item name:</p>
          <p className="text-sm sm:text-base font-medium">{item.itemName}</p>
        </div>

        <div className="flex flex-col bg-[#EFF6FF] px-2 sm:px-4 py-2 rounded-lg">
          <p className="text-[#4B4D51] text-sm font-semibold">Description:</p>
          <p className="text-sm sm:text-base font-medium">{item.description}</p>
        </div>

        <div className="flex flex-col bg-[#EFF6FF] px-2 sm:px-4 py-2 rounded-lg">
          <p className="text-[#4B4D51] text-sm font-semibold">Contact:</p>
          <p className="text-sm sm:text-base font-medium">{item.contactDetails}</p>
        </div>
      </div>

      {/* --- LOCATION + TIME --- */}
      <div className="space-y-3 mt-3">
        <div className="bg-[#EFF6FF] px-4 py-2 rounded-lg flex items-center gap-2">
          <MapPin className="text-red-500 w-5 h-5" />
          <div>
            <p className="text-xs text-gray-600">Location:</p>
            <p className="font-medium">{item.locationDetails}</p>
          </div>
        </div>

        <div className="bg-[#EFF6FF] px-4 py-2 rounded-lg flex items-center gap-2">
          <Clock className="w-5 h-5" />
          <div>
            <p className="text-xs text-gray-600">Date:</p>
            <p className="font-medium">
              {new Date(item.dateLostOrFound).toLocaleString("en-US", {
                hour: "numeric",
                minute: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* --- FOOTER --- */}
      <div className="flex items-center justify-between mt-6 border-t pt-4 text-sm text-gray-600">
        {/* WITNESS */}
        <button
          onClick={() => onToggleWitness?.(item._id)}
          className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition"
        >
          <Eye
            size={20}
            className={isWitnessed ? "text-yellow-500" : ""}
          />
          <span className="text-sm mt-1 font-semibold">
            {item.witnesses?.length || 0} Witness
          </span>
        </button>

        {/* COMMENTS */}
        <button
          onClick={() => onCommentClick?.(item.comments)}
          className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition"
        >
          <MessageCircle size={20} />
          <span className="text-sm mt-1 font-semibold">
            {item.comments?.length || 0} Comments
          </span>
        </button>

        {/* SAVE */}
        <button
          onClick={() => onToggleSave?.(item._id)}
          className={`flex flex-col items-center transition ${
            isSaved ? "text-yellow-500" : "text-gray-600 hover:text-blue-600"
          }`}
        >
          {isSaved ? (
            <BookmarkCheck size={20} />
          ) : (
            <Bookmark size={20} />
          )}
          <span className="text-sm mt-1 font-semibold">
            {isSaved ? "Saved" : "Save"}
          </span>
        </button>
      </div>
    </div>
  );
}