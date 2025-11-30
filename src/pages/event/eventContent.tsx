import { useEffect, useState } from "react";
import api from "../../api/api";
import {
  MapPin,
  CalendarDays,
  MessageCircle,
  Calendar,
  Bookmark,
  Users,
} from "lucide-react";
import CommentModal from "./commentModal";

interface EventPost {
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
  organization: {
    _id: string;
    organizationName: string;
    profileLink: string;
  } | null;
  comments: any[];
  createdAt: string;
}

// Helper: Format specific dates (start/end)
function formatDateTime(dateString: string) {
  const date = new Date(dateString);
  const d = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const t = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
  });
  return `${d} · ${t}`;
}

// Helper: Calculate relative time (posted 5 mins ago)
function timeAgo(dateString: string) {
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
}

export default function EventContent() {
  const [eventPosts, setEventPosts] = useState<EventPost[]>([]);
  const [commentClicked, setCommentClicked] = useState<{
    [key: string]: boolean;
  }>({});
  const [notifyClicked, setNotifyClicked] = useState<{
    [key: string]: boolean;
  }>({});
  const [savePostClicked, setSavePostClicked] = useState<{
    [key: string]: boolean;
  }>({});
  
  const commentCount = 3000;

  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [activeUser, setActiveUser] = useState<any>(null);
  const openCommentModal = (postId: string, postedBy: any) => {
    setActivePostId(postId);
    setActiveUser(postedBy);
  };

  const closeCommentModal = () => {
    setActivePostId(null);
  };

  const fetchEventPosts = async () => {
    try {
      const response = await api.get("/events/getPosts/event");
      // Optional: Sort by newest first
      const sortedData = response.data.sort((a: EventPost, b: EventPost) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setEventPosts(sortedData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEventPosts();
    const interval = setInterval(fetchEventPosts, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col w-full px-5 sm:px-0 max-w-4xl">
      {eventPosts.map((post) => {
        // Variable declared here was previously unused
        const isCommentClicked = commentClicked[post._id] || false;
        const isNotifyClicked = notifyClicked[post._id] || false;
        const isSaved = savePostClicked[post._id] || false;

        return (
          <div
            key={post._id}
            className="mb-5 flex flex-col gap-5 border border-black/20 bg-white p-4 rounded-lg"
          >
            {/* Post Head */}
            <div className="flex items-center justify-between">
              <div className="flex gap-3 items-center">
                <img
                  src={post.image}
                  alt="preview"
                  className="h-12 sm:h-14 rounded"
                />
                <div>
                  <p className="font-semibold text-base sm:text-lg">
                    {post.postedBy
                      ? `${post.postedBy.firstname} ${post.postedBy.lastname}`
                      : "Unknown"}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {post.createdAt ? timeAgo(post.createdAt) : "Just now"}
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center bg-[#FEF9C3] px-3 py-2  sm:px-4 rounded-xl text-[#BC8019] text-sm sm:text-base font-medium sm:font-semibold">
                {post.type}
              </span>
            </div>

            {/* Post Image */}
            <div className="w-full rounded-lg overflow-hidden bg-gray-200">
              <img
                src={post.image}
                alt="preview"
                className="w-full h-auto object-contain max-h-[500px]"
              />
            </div>

            {/* Post Details */}
            <div className="flex flex-col gap-4">
              {/* Event Name */}
              <div className="flex flex-col bg-[#EFF6FF] px-2 sm:px-4 py-2 rounded-lg">
                <p className="text-[#4B4D51] text-sm font-semibold">
                  Event Name:
                </p>
                <p className="text-sm sm:text-base font-medium">
                  {post.eventName || "N/A"}
                </p>
              </div>

              {/* Start Date */}
              <div className="flex flex-row items-center gap-2 bg-[#EFF6FF] px-2 sm:px-4 py-2 rounded-lg">
                <CalendarDays className="text-blue-500 w-6 h-6 sm:w-8 sm:h-8" />
                <div className="flex flex-col">
                  <p className="text-[#4B4D51] text-sm font-semibold">
                    Start Event:
                  </p>
                  <p className="text-sm sm:text-base font-medium">
                    {formatDateTime(post.startDate)}
                  </p>
                </div>
              </div>

              {/* End Date */}
              <div className="flex flex-row items-center gap-2 bg-[#EFF6FF] px-2 sm:px-4 py-2 rounded-lg">
                <CalendarDays className="text-blue-500 w-6 h-6 sm:w-8 sm:h-8" />
                <div className="flex flex-col">
                  <p className="text-[#4B4D51] text-sm font-semibold">
                    End Event:
                  </p>
                  <p className="text-sm sm:text-base font-medium">
                    {formatDateTime(post.endDate)}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex flex-row items-center gap-2 bg-[#EFF6FF] px-2 sm:px-4 py-2 rounded-lg">
                <MapPin className="text-red-500 w-6 h-6 " />
                <div className="flex flex-col">
                  <p className="text-[#4B4D51] text-sm font-semibold">
                    Location:
                  </p>
                  <p className="text-sm sm:text-base font-medium">
                    {post.location || "N/A"}
                  </p>
                </div>
              </div>

              {/* Open To */}
              <div className="flex flex-row items-center gap-2 bg-[#EFF6FF] px-2 sm:px-4 py-2 rounded-lg">
                <Users className="text-blue-500 w-6 h-6 sm:w-8 sm:h-8" />
                <div className="flex flex-col">
                  <p className="text-[#4B4D51] text-sm font-semibold">
                    Open To:
                  </p>
                  <p className="text-sm sm:text-base font-medium">
                    {post.openTo || "N/A"}
                  </p>
                </div>
              </div>

              {/* Course */}
              <div className="flex flex-col bg-[#EFF6FF] px-2 sm:px-4 py-2 rounded-lg">
                <p className="text-[#4B4D51] text-sm font-semibold">Course:</p>
                <p className="text-sm sm:text-base font-medium">
                  {post.course || "N/A"}
                </p>
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Interaction Buttons */}
            <div className="flex flex-col gap-y-2 justify-around">
              <button className="flex justify-end text-sm sm:text-base cursor-pointer">
                {commentCount} comments
              </button>

              <div className="flex flex-row justify-start gap-2 sm:gap-0 sm:justify-around">
                {/* Notify */}
                <button
                  className="flex flex-row items-center gap-2 cursor-pointer"
                  onClick={() =>
                    setNotifyClicked((prev) => ({
                      ...prev,
                      [post._id]: !prev[post._id],
                    }))
                  }
                >
                  <Calendar
                    className={` ${isNotifyClicked ? "text-[#F9BF3B]" : ""}`}
                  />
                  <p
                    className={`sm:block hidden ${
                      isNotifyClicked ? "text-[#F9BF3B]" : ""
                    }`}
                  >
                    Notify Me
                  </p>
                </button>

                {/* Comment - FIXED: Now uses isCommentClicked for styling */}
                <button
                  className="flex flex-row items-center gap-2 cursor-pointer"
                  onClick={() => {
                    openCommentModal(post._id, post.postedBy);
                    setCommentClicked((prev) => ({
                      ...prev,
                      [post._id]: !prev[post._id],
                    }));
                  }}
                >
                  <MessageCircle 
                    className={`${isCommentClicked ? "text-[#F9BF3B]" : ""}`}
                  />
                  <p 
                    className={`sm:block hidden ${isCommentClicked ? "text-[#F9BF3B]" : ""}`}
                  >
                    Comment
                  </p>
                </button>

                {/* Save */}
                <button
                  className="flex flex-row items-center gap-2 cursor-pointer"
                  onClick={() =>
                    setSavePostClicked((prev) => ({
                      ...prev,
                      [post._id]: !prev[post._id],
                    }))
                  }
                >
                  <Bookmark
                    className={`${
                      isSaved ? "fill-[#F9BF3B] text-[#F9BF3B]" : ""
                    }`}
                  />
                  <div
                    className={`sm:block hidden ${
                      isSaved ? "text-[#F9BF3B] " : ""
                    }`}
                  >
                    <p>{isSaved ? "Saved" : "Save"}</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        );
      })}
      {activePostId && (
        <CommentModal
          postId={activePostId}
          postedBy={activeUser}
          onClose={closeCommentModal}
        />
      )}
    </div>
  );
}