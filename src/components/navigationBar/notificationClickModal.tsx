import NotificationPersonLogo from "../../assets/notification-initial-logo.svg";
import { forwardRef, useEffect, useState } from "react";
import api from "../../api/api"; 
import PostDetailModal from "./notification/postDetailModal"; 

interface UserSender {
    _id: string;
    firstname: string;
    lastname: string;
    profileLink: string;
}

interface OrganizationSender {
    _id: string;
    organizationName: string;
    profileLink: string;
}

interface NotificationItem {
    _id: string;
    sender: UserSender;
    organization?: OrganizationSender;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: string;
    referenceModel: string; 
    referenceId: any; 
}

const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
};

const NotificationClickModal = forwardRef<HTMLDivElement>((_props, ref) => {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [selectedPost, setSelectedPost] = useState<any | null>(null);
    const [selectedPostType, setSelectedPostType] = useState<string>("");
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await api.get("/notification/getNotification");
                setNotifications(response.data);
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    const handleNotificationClick = async (notif: NotificationItem) => {
        if (!notif.isRead) {
            try {
                await api.patch(`/notification/markAsRead/${notif._id}`);
                setNotifications((prev) =>
                    prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n))
                );
            } catch (error) {
                console.error("Error marking as read", error);
            }
        }

        if (notif.referenceId) {
            setSelectedPost(notif.referenceId);
            setSelectedPostType(notif.referenceModel);
            setIsDetailModalOpen(true);
        }
    };

    return (
        <>
            <div
                ref={ref}
                className="
                    fixed top-20 right-2 sm:right-4
                    bg-white shadow-2xl rounded-xl border border-gray-200
                    z-50
                    w-[95vw] sm:w-[380px] md:w-[420px]
                    max-h-[70vh] flex flex-col
                "
            >
                {/* 1. FIXED HEADER */}
                <div className="p-4 border-b border-gray-100 shrink-0 bg-white rounded-t-xl">
                    <h3 className="font-bold text-lg text-gray-900">
                        Notifications
                    </h3>
                </div>

                {/* 2. SCROLLABLE LIST AREA */}
                <div className="overflow-y-auto flex-1 p-2 custom-scrollbar">
                    {loading ? (
                        <div className="text-center py-8 text-gray-500 text-sm">Loading...</div>
                    ) : notifications.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 text-sm">No new notifications.</div>
                    ) : (
                        <ul className="flex flex-col gap-1">
                            {notifications.map((notif) => {
                                const displayName = notif.organization 
                                    ? notif.organization.organizationName 
                                    : `${notif.sender.firstname} ${notif.sender.lastname}`;
                                
                                const displayImage = notif.organization?.profileLink 
                                    || notif.sender.profileLink 
                                    || NotificationPersonLogo;

                                return (
                                    <li
                                        key={notif._id}
                                        onClick={() => handleNotificationClick(notif)}
                                        className={`
                                            relative flex items-start gap-3 p-3 rounded-lg transition-all cursor-pointer border border-transparent
                                            ${notif.isRead 
                                                ? "hover:bg-gray-50 bg-white" 
                                                : "bg-blue-50/60 hover:bg-blue-100/50 border-blue-100"
                                            }
                                        `}
                                    >
                                        <img
                                            src={displayImage}
                                            alt="Profile"
                                            className="w-10 h-10 rounded-full bg-gray-200 object-cover shrink-0 border border-gray-200 shadow-sm"
                                        />

                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start gap-2">
                                                <p className={`text-sm text-gray-900 truncate pr-2 ${notif.isRead ? "font-medium" : "font-bold"}`}>
                                                    {displayName}
                                                </p>
                                                <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                                                    {formatTimeAgo(notif.createdAt)}
                                                </span>
                                            </div>
                                            
                                            <p className={`text-xs mt-0.5 line-clamp-2 leading-relaxed ${notif.isRead ? "text-gray-500" : "text-gray-800 font-medium"}`}>
                                                {notif.message}
                                            </p>
                                        </div>

                                        {!notif.isRead && (
                                            <span className="absolute top-4 right-3 w-2 h-2 bg-blue-600 rounded-full shadow-sm ring-2 ring-white"></span>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>

            <PostDetailModal 
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                data={selectedPost}
                type={selectedPostType}
            />
        </>
    );
});

export default NotificationClickModal;