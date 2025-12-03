import { useEffect, useState } from "react";
import api from "../../api/api";
import {
  User,
  MapPin,
  Eye,
  MessageCircle,
  Bookmark,
  CalendarDays,
  Briefcase,
  GraduationCap,
  Mail
} from "lucide-react";

// --- HELPERS (Reused) ---
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

export default function ProfilePage() {
  const [openComments, setOpenComments] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<any>(null); 
  const [witnessActive, setWitnessActive] = useState<Set<string>>(new Set());
  const [saveActive, setSaveActive] = useState<Set<string>>(new Set());

  const handleCommentClick = (comments: any[], id: string) => {
  setOpenComments(prev => (prev === id ? null : id));
};


  const toggleWitness = (id: string) => {
  setWitnessActive(prev => {
    const newSet = new Set(prev);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    return newSet;
  });
};

  const toggleSave = (id: string) => {
  setSaveActive(prev => {
    const newSet = new Set(prev);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    return newSet;
  });
};

  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/profile/my-posts"); 
      setPosts(response.data);
      
      if (response.data.length > 0 && response.data[0].postedBy) {
        setUserInfo(response.data[0].postedBy);
      }
    } catch (error) {
      console.error("Error fetching profile posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, []);

  // --- RENDERERS ---
  const renderReportItem = (item: any) => (
  <div
    key={item._id}
    className="w-full bg-white shadow-md rounded-xl p-5 mb-6 border border-gray-200"
  >
    {/* HEADER */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
            Report Item
          </span>
          <p className="text-xs text-gray-500">{timeAgo(item.createdAt)}</p>
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

    {/* IMAGE */}
    <div className="w-full h-56 bg-gray-200 rounded-lg mt-4 mb-4 flex items-center justify-center overflow-hidden">
      <img src={item.image} alt="item" className="w-full h-full object-cover" />
    </div>

    {/* DESCRIPTION */}
    <div className="space-y-2">
      <p className="font-bold text-lg text-black">{item.itemName}</p>
      <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
    </div>

    {/* ACTION BAR */}
    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center text-sm text-gray-600">

      {/* LOCATION */}
      <span className="flex items-center gap-1">
        <MapPin size={14} className="text-red-500" />
        {item.locationDetails}
      </span>

      {/* ACTION BUTTONS */}
      <div className="flex gap-4">

        {/* WITNESS BUTTON */}
        <button
          onClick={() => toggleWitness(item._id)}
          className={`flex items-center gap-1 transition ${
            witnessActive.has(item._id)
              ? "text-yellow-500"
              : "hover:text-blue-600"
          }`}
        >
          <Eye size={14} />
          <span>{item.witnesses?.length || 0}</span>
        </button>

        {/* COMMENT BUTTON */}
        <button
          onClick={() => { handleCommentClick(item.comments || [], item._id); }}
          className="flex items-center gap-1 hover:text-blue-600 transition"
        >
          <MessageCircle size={14} />
          <span>{item?.comments?.length || 0}</span>
        </button>

        {/* SAVE BUTTON */}
        <button
          onClick={() => toggleSave(item._id)}
          className={`flex items-center gap-1 transition ${
            saveActive.has(item._id)
              ? "text-yellow-500"
              : "hover:text-blue-600"
          }`}
        >
          <Bookmark size={14} />
        </button>
      </div>
    </div>

    {/* COMMENTS PANEL (Modal-like) */}
   {/* COMMENTS PANEL (Compact floating box) */}
{openComments === item._id && (
  <>
    {/* Backdrop */}
    <div
      className="fixed inset-0 bg-black/20 z-40"
      onClick={() => setOpenComments(null)}
    />

    {/* SMALL FLOATING BOX */}
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24">
      <div className="w-[320px] bg-white rounded-md shadow-lg border border-gray-300">

        {/* HEADER */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-300">
          <h3 className="text-sm font-medium text-gray-900">Comments</h3>
          <button
            onClick={() => setOpenComments(null)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* BODY */}
        <div className="p-4">
          {item.comments?.length > 0 ? (
            <p className="text-gray-700 text-sm">Comments will be shown here.</p>
          ) : (
            <p className="text-gray-500 text-sm text-center italic">
              No comments yet
            </p>
          )}
        </div>

      </div>
    </div>
  </>
)}
  </div>
);



  const renderEventItem = (item: any) => {
    const hasOrg = !!item.organization;
    const displayTitle = hasOrg ? item.organization?.organizationName : "Personal Event";

    return (
      <div key={item._id} className="mb-6 flex flex-col gap-4 border border-black/10 bg-white p-5 rounded-xl shadow-md">
         <div className="flex justify-between items-center">
            <div className="flex flex-col">
                <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Event Post</span>
                <span className="text-xs text-gray-500">{timeAgo(item.createdAt)}</span>
            </div>
            <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded">
                {displayTitle}
            </span>
         </div>

        <h3 className="text-xl font-bold">{item.eventName}</h3>

        <div className="w-full rounded-lg overflow-hidden bg-gray-200 h-48">
          <img src={item.image} alt="event" className="w-full h-full object-cover" />
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
           <div className="flex items-center gap-2 text-gray-700">
              <CalendarDays size={16} className="text-blue-500" />
              <span>{new Date(item.startDate).toLocaleDateString()}</span>
           </div>
           <div className="flex items-center gap-2 text-gray-700">
              <MapPin size={16} className="text-red-500" />
              <span className="truncate">{item.location}</span>
           </div>
        </div>

        <div className="pt-2 border-t border-gray-100 flex justify-end">
            <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition text-sm">
                <MessageCircle size={16} /> {item.comments?.length || 0} Comments
            </button>
        </div>
      </div>
    );
  };

  const renderAcademicItem = (item: any) => {
    const orgName = item.organization?.organizationName || "General Academic";
    return (
      <div key={item._id} className="bg-white rounded-xl shadow-md border border-gray-200 p-5 mb-6">
        <div className="flex justify-between items-start mb-3">
          <div className="flex flex-col">
             <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Academic</span>
             <span className="text-xs text-gray-500">{timeAgo(item.createdAt)}</span>
          </div>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
            {orgName}
          </span>
        </div>

        <h4 className="font-bold text-lg text-gray-900 mb-2">{item.title}</h4>
        <p className="text-gray-700 text-sm line-clamp-3 mb-3">{item.content}</p>

        {item.image && (
          <div className="w-full bg-gray-100 rounded-lg overflow-hidden mb-3 h-40">
            <img src={item.image} alt="attachment" className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex justify-end pt-2 border-t border-gray-100">
             <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition text-sm">
                <MessageCircle size={16} /> {item.comments?.length || 0} Comments
            </button>
        </div>
      </div>
    );
  };

  // --- MAIN UI ---
  return (
    <div className="w-full max-w-4xl mx-auto pb-10">
      
      {/* 1. PROFILE HEADER */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden mb-8 border border-gray-200">
        {/* Cover Image */}
        <div className="h-32 bg-linear-to-r from-blue-600 to-indigo-600"></div>
        
        <div className="px-6 pb-6 relative">
            {/* Avatar - Absolute Positioned */}
            <div className="absolute -top-12 left-6 border-4 border-white rounded-full bg-white z-10">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                     <User size={40} className="text-gray-400"/>
                </div>
            </div>

            {/* Info Section - Adjusted Spacing */}
            {/* pt-14: Pushes text down on mobile so it doesn't hide behind centered avatar (if stacked).
                sm:pt-2: On desktop, we want the name higher up, next to the avatar.
                sm:pl-28: Adds left padding equal to Avatar Width + Gap so text doesn't overlap.
            */}
            <div className="pt-14 sm:pt-2 sm:pl-28 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                        {userInfo ? `${userInfo.firstname} ${userInfo.lastname}` : "My Profile"}
                    </h1>
                    <div className="flex flex-col gap-1 mt-1 text-gray-600 text-sm">
                        <div className="flex items-center gap-2">
                            <Briefcase size={14} />
                            <span>Student / User</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <GraduationCap size={14} />
                            <span>University Student</span> 
                        </div>
                    </div>
                </div>

                <div className="flex gap-6 text-center">
                    <div>
                        <p className="font-bold text-gray-900 text-lg">{posts.length}</p>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Posts</p>
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 text-lg">0</p>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Following</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* 2. FEED SECTION */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Sidebar */}
        <div className="w-full lg:w-1/3 space-y-4">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-800 mb-4">About</h3>
                <p className="text-sm text-gray-600 mb-4">
                    Member of the university community. Active in various organizations and academic events.
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Mail size={16} />
                    <span>contact@email.com</span>
                </div>
            </div>
        </div>

        {/* Main Feed */}
        <div className="w-full lg:w-2/3">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Activity History</h2>
            
            {loading ? (
                 <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-gray-200">
                    Loading profile activity...
                 </div>
            ) : posts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Bookmark size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No posts yet</h3>
                    <p className="text-gray-500 text-sm">Posts you create will appear here.</p>
                </div>
            ) : (
                <div>
                    {posts.map((item) => {
                        if (item.feedType === "report") return renderReportItem(item);
                        if (item.feedType === "event") return renderEventItem(item);
                        if (item.feedType === "academic") return renderAcademicItem(item);
                        return null;
                    })}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}