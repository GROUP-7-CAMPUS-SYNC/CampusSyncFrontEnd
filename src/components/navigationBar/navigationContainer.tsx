import { useEffect, useRef, useState } from "react";
import Notification from "./notification/notification";
import ProfilePicture from "./profile/profilePicture";
import UserName from "./profile/userName";
import SearchBar from "../searchBar";
import SuggestionGroup from "./suggestionGroup/suggestionGroup";
import LogoHoverMessage from "./logoHoverMessage";
import NotificationClickModal from "./notification/notificationClickModal";
import LogoutModal from "./logout";
import { useScreenSize } from "../../hooks/useScreenSize";
import { Search, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import GlobalSearchModal from "./globalSearchModal"; 

export default function NavigationContainer() {
    const [searchBarValue, setSearchBarValue] = useState<string>("");
    
    // UI States
    const [clickNotification, setClickNotification] = useState(false);
    const [clickProfile, setClickProfile] = useState(false);
    const [clickLogOut, setClickLogOut] = useState(false);
    const [clickSmallScreenSearchBar, setClickSmallScreenSearchbar] = useState(false);
    
    // Data States
    const [badgeCount, setBadgeCount] = useState<number>(0);
    // ✅ Stores dynamic history from API (Replaces hardcoded array)
    const [recentSearches, setRecentSearches] = useState<string[]>([]);

    // Global Search Modal States
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [submittedQuery, setSubmittedQuery] = useState("");

    const navigation = useNavigate();
    const isSmallScreen = useScreenSize(400);

    // Refs
    const navRef = useRef<HTMLDivElement>(null);
    const notifModalRef = useRef<HTMLDivElement>(null);
    const profileModalRef = useRef<HTMLDivElement>(null);
    const logoutModalRef = useRef<HTMLDivElement>(null);

    // --- 1. Fetch Recent Searches (History) ---
    const getRecentSearch = async () => {
        try {
            // Fetch history specifically for 'global' context
            const response = await api.get("/recentSearch/recent?context=global");
            
            const searchStrings = response.data
                .map((item: any) => item.queryText)
                .filter((text: string) => text);

            // Remove duplicates using Set
            const uniqueSearches = [...new Set(searchStrings)] as string[];
            setRecentSearches(uniqueSearches);
        } catch (error) {
            console.error("Failed to fetch recent searches:", error);
        }
    };

    // --- 2. Fetch Notifications ---
    const fetchUnreadCount = async () => {
        try {
            const res = await api.get("/notification/getNotification");
            const unread = res.data.filter((n: any) => !n.isRead).length;
            setBadgeCount(unread);
        } catch (error) {
            console.error("Error fetching notification count:", error);
        }
    };

    // Initial Fetches
    useEffect(() => {
        fetchUnreadCount();
        getRecentSearch(); // ✅ Load history on mount
    }, []);

    useEffect(() => { if (!clickNotification) fetchUnreadCount(); }, [clickNotification]);
    useEffect(() => { if (!isSmallScreen) setClickSmallScreenSearchbar(false); }, [isSmallScreen]);

    // Handle Outside Clicks
    useEffect(() => {
        const handleGlobalClick = (e: MouseEvent) => {
            const target = e.target as Node;
            const insideNav = navRef.current?.contains(target);
            const insideNotifModal = notifModalRef.current?.contains(target);
            const insideProfileModal = profileModalRef.current?.contains(target);
            const insideLogoutModal = logoutModalRef.current?.contains(target);

            if (insideNav || insideNotifModal || insideProfileModal || insideLogoutModal) return; 

            setClickNotification(false);
            setClickProfile(false);
            setClickLogOut(false);
        };
        window.addEventListener("mousedown", handleGlobalClick);
        return () => window.removeEventListener("mousedown", handleGlobalClick);
    }, []);

    // Handlers
    const handleNotificationClick = () => { setClickNotification(!clickNotification); setClickProfile(false); setClickLogOut(false); };
    const handleProfileClick = () => { navigation("/profile"); setClickProfile(!clickProfile); setClickNotification(false); setClickLogOut(false); };
    const handleLogOutClick = () => { setClickLogOut(!clickLogOut); setClickNotification(false); setClickProfile(false); };

    // --- 3. Handle Global Search Execution ---
    const handleGlobalSearch = async (term: string) => {
        if (!term.trim()) return;

        setSubmittedQuery(term);
        setIsSearchModalOpen(true); // Open modal immediately
        setIsSearchLoading(true);
        
        // Close mobile search bar if open
        setClickSmallScreenSearchbar(false); 

        try {
            // A. Log interaction (Save to history)
            await api.post("/recentSearch/log", {
                queryText: term,
                searchContext: "global"
            });
            
            // B. Refresh history list (so next time we click search, new term is there)
            getRecentSearch(); 

            // C. Perform the search
            const response = await api.get(`/search/getGlobalSearch?search=${encodeURIComponent(term)}`);
            
            if (response.status === 200) {
                setSearchResults(response.data);
            }
        } catch (error) {
            console.error("Global search failed:", error);
            setSearchResults([]);
        } finally {
            setIsSearchLoading(false);
        }
    };

    return (
        <div className="relative shadow-lg w-full" ref={navRef}>
            {/* DESKTOP / NORMAL VIEW */}
            {clickSmallScreenSearchBar === false && (
                <div className="2xl:pl-10 flex w-full h-18 py-2 2xl:px-3 px-2 justify-between items-center gap-x-2">
                    {/* LEFT SIDE */}
                    <div className="flex gap-x-3 items-center">
                        <div className="block [@media(min-width:400px)]:hidden">
                            <button onClick={() => setClickSmallScreenSearchbar(true)}>
                                <Search />
                            </button>
                        </div>

                        <div className="hidden [@media(min-width:400px)]:block">
                            <SearchBar
                                value={searchBarValue}
                                onChange={(e) => setSearchBarValue(e.target.value)}
                                onSearch={handleGlobalSearch} // ✅ Triggers API Search
                                placeholder="Search post, event, or item"
                                recentSearch={recentSearches} // ✅ Uses dynamic API Data
                            />
                        </div>

                        <SuggestionGroup />
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="flex gap-x-6 items-center">
                        {/* NOTIFICATION */}
                        <div className="relative group">
                            <Notification badgeCount={badgeCount} onClick={handleNotificationClick} />
                            <LogoHoverMessage clickNotification={clickNotification} clickProfile={clickProfile} clickLogOut={clickLogOut} message="Notification" />
                        </div>

                        {/* PROFILE */}
                        <div className="relative group">
                            <ProfilePicture profileImageURL={`${localStorage.getItem("profileLink")}`} onClick={handleProfileClick} />
                            <LogoHoverMessage clickNotification={clickNotification} clickProfile={clickProfile} clickLogOut={clickLogOut} message="Profile" />
                        </div>

                        {/* LOGOUT */}
                        <div className="relative group">
                            <button className={`p-2 flex cursor-pointer items-center gap-x-2 rounded-md transition-colors duration-200 ${clickLogOut ? "bg-gray-400" : "hover:bg-gray-300"}`} onClick={handleLogOutClick}>
                                <UserName userName={`${localStorage.getItem("firstName")} ${localStorage.getItem("lastName")}`} />
                                {clickLogOut ? <ChevronUp /> : <ChevronDown />}
                            </button>
                            <LogoHoverMessage clickNotification={clickNotification} clickProfile={clickProfile} clickLogOut={clickLogOut} message="Log Out" />
                        </div>
                    </div>
                </div>
            )}

            {/* MOBILE SEARCH BAR */}
            {clickSmallScreenSearchBar && (
                <div className="flex flex-row justify-center items-center gap-y-10 w-full">
                    <button onClick={() => setClickSmallScreenSearchbar(false)}>
                        <ArrowLeft />
                    </button>

                    <SearchBar
                        searchBarContainerDesign="relative bg-[#EEEEEE] flex items-center gap-3 p-3 h-[6vh] w-full"
                        value={searchBarValue}
                        onChange={(e) => setSearchBarValue(e.target.value)}
                        onSearch={handleGlobalSearch} // ✅ Triggers API Search
                        placeholder="Search post, event, or item"
                        recentSearch={recentSearches} // ✅ Uses dynamic API Data
                    />
                </div>
            )}

            {/* MODALS */}
            {clickNotification && <NotificationClickModal ref={notifModalRef} />}
            {clickLogOut && <LogoutModal ref={logoutModalRef} />}

            {/* ✅ Search Result Modal */}
            <GlobalSearchModal 
                isOpen={isSearchModalOpen}
                onClose={() => setIsSearchModalOpen(false)}
                results={searchResults}
                loading={isSearchLoading}
                searchQuery={submittedQuery}
            />
        </div>
    );
}