import { User, MapPin, Clock, Eye, MessageCircle } from "lucide-react";
import SaveButton from "./saveButton";


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
  // Callback now explicitly expects an array of comments
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
    <div className="w-full bg-white shadow-md rounded-xl p-5 mb-6 border border-gray-200 mx-auto hover:shadow-lg transition-shadow">
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
            <p className="font-semibold text-gray-900">{posterName}</p>
            <p className="text-xs text-gray-500">
              {item.createdAt ? timeAgo(item.createdAt) : "Just now"}
            </p>
          </div>
        </div>

        <span
          className={`px-3 py-1 rounded-lg text-sm font-medium text-white ${
            item.reportType === "Lost" ? "bg-red-400" : "bg-green-400"
          }`}
        >
          {item.reportType}
        </span>
      </div>

      {/* MAIN IMAGE */}
      <div className="w-full h-56 bg-gray-100 rounded-lg mt-4 mb-4 flex items-center justify-center border border-gray-100 overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt="item"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-400 text-sm">No Image Available</span>
        )}
      </div>

      {/* --- DETAILS --- */}
      <div className="space-y-3">
        <div className="flex flex-col bg-[#EFF6FF] px-3 py-2 rounded-lg">
          <p className="text-[#4B4D51] text-xs uppercase font-bold tracking-wide">Item name</p>
          <p className="text-sm sm:text-base font-semibold text-gray-800">{item.itemName}</p>
        </div>

        <div className="flex flex-col bg-[#EFF6FF] px-3 py-2 rounded-lg">
          <p className="text-[#4B4D51] text-xs uppercase font-bold tracking-wide">Description</p>
          <p className="text-sm text-gray-700">{item.description}</p>
        </div>

        <div className="flex flex-col bg-[#EFF6FF] px-3 py-2 rounded-lg">
          <p className="text-[#4B4D51] text-xs uppercase font-bold tracking-wide">Contact</p>
          <p className="text-sm font-medium text-blue-600">{item.contactDetails}</p>
        </div>
      </div>

      {/* --- LOCATION + TIME --- */}
      <div className="space-y-3 mt-3">
        <div className="bg-[#EFF6FF] px-3 py-2 rounded-lg flex items-center gap-3">
          <MapPin className="text-red-500 w-5 h-5 shrink-0" />
          <div>
            <p className="text-xs text-gray-500 font-semibold">Location</p>
            <p className="font-medium text-sm">{item.locationDetails}</p>
          </div>
        </div>

        <div className="bg-[#EFF6FF] px-3 py-2 rounded-lg flex items-center gap-3">
          <Clock className="w-5 h-5 text-gray-600 shrink-0" />
          <div>
            <p className="text-xs text-gray-500 font-semibold">Date</p>
            <p className="font-medium text-sm">
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
      <div className="flex items-center justify-between mt-6 border-t border-gray-100 pt-4 text-sm text-gray-600">
        {/* WITNESS */}
        <button
          onClick={() => onToggleWitness?.(item._id)}
          className="flex flex-col items-center group transition"
        >
          <Eye
            size={20}
            className={`transition ${isWitnessed ? "text-yellow-500" : "text-gray-500 group-hover:text-blue-500"}`}
          />
          <span className={`text-xs mt-1 font-semibold ${isWitnessed ? "text-yellow-600" : "text-gray-500"}`}>
            {item.witnesses?.length || 0} Witness
          </span>
        </button>

        {/* COMMENTS */}
        <button
          onClick={() => onCommentClick?.(item.comments)}
          className="flex flex-col items-center group transition"
        >
          <MessageCircle size={20} className="text-gray-500 group-hover:text-blue-500 transition" />
          <span className="text-xs mt-1 font-semibold text-gray-500 group-hover:text-blue-600">
            {item.comments?.length || 0} Comments
          </span>
        </button>

        {/* UPDATED SAVE BUTTON */}
        <SaveButton
            postId={item._id}
            postType="report"
            initialIsSaved={isSaved}
            onToggle={() => onToggleSave?.(item._id)}
        />
      </div>
    </div>
  );
}