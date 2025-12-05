import { MapPin, CalendarDays, MessageCircle, Calendar, Users, User } from "lucide-react";
import SaveButton from "./saveButton";


// --- Types ---
export interface EventPost {
  _id: string;
  type: string;
  eventName: string;
  location: string;
  course: string;
  openTo: string;
  startDate: string;
  endDate: string;
  image: string;
  postedBy: { _id: string; firstname: string; lastname: string } | null;
  organization: { _id: string; organizationName: string; profileLink: string; } | null;
  comments: any[];
  createdAt: string;
}

interface EventCardProps {
  post: EventPost;
  isSaved?: boolean;
  isNotify?: boolean;
  isCommentOpen?: boolean;
  commentCount?: number;
  // Actions
  onToggleSave?: (id: string) => void;
  onToggleNotify?: (id: string) => void;
  onCommentClick?: (id: string, postedBy: any) => void;
}

// --- Helpers ---
function formatDateTime(dateString: string) {
  const date = new Date(dateString);
  return `${date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric" })}`;
}

function timeAgo(dateString: string) {
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  if (diffInSeconds < 60) return "Just now";
  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function EventCard({
  post,
  isSaved = false,
  isNotify = false,
  commentCount = 0,
  onToggleSave,
  onToggleNotify,
  onCommentClick,
}: EventCardProps) {
  
  const hasOrg = !!post.organization;
  const avatarSrc = hasOrg ? post.organization?.profileLink : null;
  const postedByName = post.postedBy ? `${post.postedBy.firstname} ${post.postedBy.lastname}` : "Unknown";
  const displayTitle = hasOrg ? post.organization?.organizationName : postedByName;
  const timeDisplay = post.createdAt ? timeAgo(post.createdAt) : "Just now";

  return (
    <div className="mb-5 flex flex-col gap-5 border border-black/20 bg-white p-4 rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex gap-3 items-center">
          <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full border border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50">
            {avatarSrc ? (
              <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="text-gray-400" size={24} />
            )}
          </div>
          <div className="flex flex-col">
            <p className="font-semibold text-base sm:text-lg text-black">{displayTitle}</p>
            <div className="text-gray-500 text-xs sm:text-sm flex flex-wrap gap-1">
              {hasOrg && <span>Posted by {postedByName} •</span>}
              <span>{timeDisplay}</span>
            </div>
          </div>
        </div>
        <span className="inline-flex items-center bg-[#FEF9C3] px-3 py-2 sm:px-4 rounded-xl text-[#BC8019] text-sm sm:text-base font-medium sm:font-semibold">
          {post.type}
        </span>
      </div>

      {/* Image */}
      <div className="w-full rounded-lg overflow-hidden bg-gray-200 border border-gray-100">
        <img src={post.image} alt="event preview" className="w-full h-auto object-contain max-h-[500px]" />
      </div>

      {/* Details Grid */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col bg-[#EFF6FF] px-2 sm:px-4 py-2 rounded-lg">
          <p className="text-[#4B4D51] text-sm font-semibold">Event Name:</p>
          <p className="text-sm sm:text-base font-medium">{post.eventName || "N/A"}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-row items-center gap-2 bg-[#EFF6FF] px-2 sm:px-4 py-2 rounded-lg">
            <CalendarDays className="text-blue-500 w-6 h-6 shrink-0" />
            <div className="flex flex-col">
                <p className="text-[#4B4D51] text-sm font-semibold">Start:</p>
                <p className="text-sm sm:text-base font-medium">{formatDateTime(post.startDate)}</p>
            </div>
            </div>
            <div className="flex flex-row items-center gap-2 bg-[#EFF6FF] px-2 sm:px-4 py-2 rounded-lg">
            <CalendarDays className="text-blue-500 w-6 h-6 shrink-0" />
            <div className="flex flex-col">
                <p className="text-[#4B4D51] text-sm font-semibold">End:</p>
                <p className="text-sm sm:text-base font-medium">{formatDateTime(post.endDate)}</p>
            </div>
            </div>
        </div>

        <div className="flex flex-row items-center gap-2 bg-[#EFF6FF] px-2 sm:px-4 py-2 rounded-lg">
          <MapPin className="text-red-500 w-6 h-6 shrink-0" />
          <div className="flex flex-col">
            <p className="text-[#4B4D51] text-sm font-semibold">Location:</p>
            <p className="text-sm sm:text-base font-medium">{post.location || "N/A"}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-row items-center gap-2 bg-[#EFF6FF] px-2 sm:px-4 py-2 rounded-lg">
            <Users className="text-blue-500 w-6 h-6 shrink-0" />
            <div className="flex flex-col">
                <p className="text-[#4B4D51] text-sm font-semibold">Open To:</p>
                <p className="text-sm sm:text-base font-medium">{post.openTo || "N/A"}</p>
            </div>
            </div>
            <div className="flex flex-col justify-center bg-[#EFF6FF] px-2 sm:px-4 py-2 rounded-lg">
            <p className="text-[#4B4D51] text-sm font-semibold">Course:</p>
            <p className="text-sm sm:text-base font-medium">{post.course || "N/A"}</p>
            </div>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Actions */}
      <div className="flex flex-col gap-y-2">
        <button className="flex justify-end text-sm sm:text-base cursor-pointer text-gray-500 hover:text-black">
          {commentCount} comments
        </button>

        <div className="flex flex-row justify-between sm:justify-around pt-2">
          {/* Notify */}
          <button
            className={`flex flex-row items-center gap-2 cursor-pointer transition-colors ${isNotify ? "text-[#F9BF3B]" : "text-gray-600 hover:text-black"}`}
            onClick={() => onToggleNotify?.(post._id)}
          >
            <Calendar className={isNotify ? "text-[#F9BF3B]" : ""} />
            <span className="sm:block hidden font-medium">Notify Me</span>
          </button>

          {/* Comment */}
          <button
            className={`flex flex-row items-center gap-2 cursor-pointer transition-colors text-gray-600 hover:text-black`}
            onClick={() => onCommentClick?.(post._id, post.postedBy)}
          >
            <MessageCircle />
            <span className="sm:block hidden font-medium">Comment</span>
          </button>

          {/* UPDATED SAVE BUTTON */}
          <SaveButton
              postId={post._id}
              postType="event"
              initialIsSaved={isSaved}
              onToggle={() => onToggleSave?.(post._id)}
          />
        </div>
      </div>
    </div>
  );
}