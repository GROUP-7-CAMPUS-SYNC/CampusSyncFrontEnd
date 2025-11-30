import { useEffect, useState } from "react";
import api from "../../api/api"; // Ensure this path is correct
import {
  User,
  MapPin,
  Eye,
  MessageCircle,
  Bookmark,
  BookmarkCheck,
  CalendarDays,
  Calendar,
} from "lucide-react";

// --- UTILITIES ---
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

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric" })}`;
};

export default function HomeFeed() {
  const [feedItems, setFeedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Simple state trackers for UI interaction (mock logic)
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());

  const fetchHomeFeed = async () => {
    try {
      setLoading(true);
      const response = await api.get("/dashboard/home");
      setFeedItems(response.data);
    } catch (error) {
      console.error("Error fetching feed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeFeed();
  }, []);

  const handleSaveClick = (itemId: string) => {
    setSavedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) newSet.delete(itemId);
      else newSet.add(itemId);
      return newSet;
    });
  };

  // --- RENDERERS ---

  // 1. REPORT ITEM CARD (Lost & Found)
  const renderReportItem = (item: any) => (
    <div key={item._id} className="w-full bg-white shadow-md rounded-xl p-5 mb-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
            {item.image ? (
              <img src={item.image} className="w-full h-full object-cover" alt="avatar" />
            ) : (
              <User size={20} className="text-white" />
            )}
          </div>
          <div>
            <p className="font-semibold">
              {item.postedBy ? `${item.postedBy.firstname} ${item.postedBy.lastname}` : "Unknown User"}
            </p>
            <p className="text-xs text-gray-500">{timeAgo(item.createdAt)}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-lg text-sm text-white ${item.reportType === "Lost" ? "bg-red-400" : "bg-green-400"}`}>
          {item.reportType}
        </span>
      </div>

      <div className="w-full h-56 bg-gray-200 rounded-lg mt-4 mb-4 flex items-center justify-center overflow-hidden">
        <img src={item.image} alt="item" className="w-full h-full object-cover" />
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-gray-500 text-sm font-medium">Item name:</p>
          <p className="font-medium text-lg text-black">{item.itemName}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm font-medium">Description:</p>
          <p className="text-base text-black">{item.description}</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <p className="flex items-center gap-2 text-sm">
          <MapPin size={18} className="text-red-500" /> {item.locationDetails}
        </p>
      </div>

      <div className="flex items-center justify-between text-gray-600 mt-5 border-t pt-3 text-sm">
        <button className="flex items-center gap-1 hover:text-blue-600 transition">
           <Eye size={16} /> {item.witnesses?.length || 0} Witness
        </button>
        <button className="flex items-center gap-1 hover:text-blue-600 transition">
          <MessageCircle size={16} /> {item.comments?.length || 0} comments
        </button>
      </div>
    </div>
  );

  // 2. EVENT ITEM CARD
  const renderEventItem = (item: any) => {
    const hasOrg = !!item.organization;
    const avatarSrc = hasOrg ? item.organization?.profileLink : null;
    const displayTitle = hasOrg ? item.organization?.organizationName : `${item.postedBy?.firstname} ${item.postedBy?.lastname}`;

    return (
      <div key={item._id} className="mb-6 flex flex-col gap-5 border border-black/20 bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex gap-3 items-center">
            <div className="h-12 w-12 rounded-full border border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50">
              {avatarSrc ? (
                <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="text-gray-400" size={24} />
              )}
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-lg text-black">{displayTitle}</p>
              <div className="text-gray-500 text-sm flex gap-1">
                <span>{timeAgo(item.createdAt)}</span>
              </div>
            </div>
          </div>
          <span className="inline-flex items-center bg-[#FEF9C3] px-3 py-1 rounded-xl text-[#BC8019] text-sm font-semibold">
            Event
          </span>
        </div>

        <div className="w-full rounded-lg overflow-hidden bg-gray-200">
          <img src={item.image} alt="event" className="w-full h-auto object-contain max-h-[400px]" />
        </div>

        <div className="flex flex-col gap-2">
           <h3 className="text-xl font-bold">{item.eventName}</h3>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              <div className="flex items-center gap-2 bg-blue-50 p-2 rounded">
                 <CalendarDays className="text-blue-500 w-5 h-5" />
                 <span className="text-sm font-medium">{formatDateTime(item.startDate)}</span>
              </div>
              <div className="flex items-center gap-2 bg-blue-50 p-2 rounded">
                 <MapPin className="text-red-500 w-5 h-5" />
                 <span className="text-sm font-medium">{item.location}</span>
              </div>
           </div>
        </div>

        <hr className="border-gray-200 mt-2" />
        
        <div className="flex flex-row justify-around pt-2">
            <button className="flex flex-row items-center gap-2 cursor-pointer text-gray-600 hover:text-blue-600">
                <Calendar size={20} /> <span className="text-sm font-medium">Notify Me</span>
            </button>
            <button className="flex flex-row items-center gap-2 cursor-pointer text-gray-600 hover:text-blue-600">
                <MessageCircle size={20} /> <span className="text-sm font-medium">Comment</span>
            </button>
             <button
              onClick={() => handleSaveClick(item._id)}
              className={`flex items-center gap-2 cursor-pointer ${savedItems.has(item._id) ? "text-yellow-500" : "text-gray-600"}`}
            >
              {savedItems.has(item._id) ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
              <span className="text-sm font-medium">Save</span>
            </button>
        </div>
      </div>
    );
  };

  // 3. ACADEMIC ITEM CARD
  const renderAcademicItem = (item: any) => {
    const orgName = item.organization?.organizationName || "Unknown Org";
    const orgImage = item.organization?.profileLink;
    const posterName = item.postedBy ? `${item.postedBy.firstname} ${item.postedBy.lastname}` : "Unknown";

    return (
      <div key={item._id} className="bg-white rounded-xl shadow-md border border-gray-200 p-5 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center border border-gray-100">
              {orgImage ? (
                <img src={orgImage} alt={orgName} className="w-full h-full object-cover" />
              ) : (
                <User className="text-gray-400" size={24} />
              )}
            </div>
            <div className="flex flex-col">
              <h3 className="font-bold text-gray-900 leading-tight">{orgName}</h3>
              <p className="text-xs text-gray-500 mt-0.5">Posted by {posterName} • {timeAgo(item.createdAt)}</p>
            </div>
          </div>
          <span className="bg-blue-400 text-white text-xs font-semibold px-3 py-1 rounded-lg">
            Academic
          </span>
        </div>

        <div className="mb-4">
          <h4 className="font-bold text-lg text-gray-800 mb-2">{item.title}</h4>
          <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">{item.content}</p>
        </div>

        {item.image && (
          <div className="w-full bg-gray-100 rounded-lg overflow-hidden mb-4 border border-gray-100">
            <img src={item.image} alt="attachment" className="w-full h-auto object-cover max-h-[500px]" />
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium">
            <MessageCircle size={18} />
            <span>{item.comments?.length || 0} comments</span>
          </button>
           <button
              onClick={() => handleSaveClick(item._id)}
              className={`flex items-center gap-2 cursor-pointer ${savedItems.has(item._id) ? "text-yellow-500" : "text-gray-600"}`}
            >
              {savedItems.has(item._id) ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
              <span>Save</span>
            </button>
        </div>
      </div>
    );
  };

  // --- MAIN RENDER ---
  return (
    <div className="w-full max-w-3xl mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Home Feed</h1>
      
      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading your feed...</div>
      ) : feedItems.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No posts available.</div>
      ) : (
        <div className="flex flex-col">
          {feedItems.map((item) => {
            if (item.feedType === "report") return renderReportItem(item);
            if (item.feedType === "event") return renderEventItem(item);
            if (item.feedType === "academic") return renderAcademicItem(item);
            return null;
          })}
        </div>
      )}
    </div>
  );
}