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
import { Search, ChevronDown, ArrowLeft } from "lucide-react";
import api from "../../api/api";
import GlobalSearchModal from "./globalSearchModal";

export default function NavigationContainer() {
  const [searchBarValue, setSearchBarValue] = useState<string>("");

  // UI States
  const [clickNotification, setClickNotification] = useState(false);
  const [clickProfile, setClickProfile] = useState(false);
  const [clickLogOut, setClickLogOut] = useState(false);
  const [clickSmallScreenSearchBar, setClickSmallScreenSearchbar] =
    useState(false);

  // Data States
  const [badgeCount, setBadgeCount] = useState<number>(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Global Search Modal States
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [submittedQuery, setSubmittedQuery] = useState("");

  const isSmallScreen = useScreenSize(400);

  // Refs
  const navRef = useRef<HTMLDivElement>(null);
  const notifModalRef = useRef<HTMLDivElement>(null);
  const profileModalRef = useRef<HTMLDivElement>(null);
  const logoutModalRef = useRef<HTMLDivElement>(null);

  // --- 1. Fetch Recent Searches (History) ---
  const getRecentSearch = async () => {
    try {
      const response = await api.get("/recentSearch/recent?context=global");
      const searchStrings = response.data
        .map((item: any) => item.queryText)
        .filter((text: string) => text);
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
    getRecentSearch();
  }, []);

  useEffect(() => {
    if (!clickNotification) fetchUnreadCount();
  }, [clickNotification]);

  useEffect(() => {
    if (!isSmallScreen) setClickSmallScreenSearchbar(false);
  }, [isSmallScreen]);

  // Handle Outside Clicks
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as Node;
      const insideNav = navRef.current?.contains(target);
      const insideNotifModal = notifModalRef.current?.contains(target);
      const insideProfileModal = profileModalRef.current?.contains(target);
      const insideLogoutModal = logoutModalRef.current?.contains(target);

      if (
        insideNav ||
        insideNotifModal ||
        insideProfileModal ||
        insideLogoutModal
      )
        return;

      setClickNotification(false);
      setClickProfile(false);
      setClickLogOut(false);
    };
    window.addEventListener("mousedown", handleGlobalClick);
    return () => window.removeEventListener("mousedown", handleGlobalClick);
  }, []);

  // Handlers
  const handleNotificationClick = () => {
    setClickNotification(!clickNotification);
    setClickProfile(false);
    setClickLogOut(false);
  };

  const handleLogOutClick = () => {
    setClickLogOut(!clickLogOut);
    setClickNotification(false);
    setClickProfile(false);
  };

  // UPDATED: Added e.stopPropagation() to prevent bubbling to the logout container
  const handleProfileClick = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setClickProfile(!clickProfile);
  };

  // --- 3. Handle Global Search Execution ---
  const handleGlobalSearch = async (term: string) => {
    if (!term.trim()) return;

    setSubmittedQuery(term);
    setIsSearchModalOpen(true);
    setIsSearchLoading(true);
    setClickSmallScreenSearchbar(false);

    try {
      await api.post("/recentSearch/log", {
        queryText: term,
        searchContext: "global",
      });
      getRecentSearch();
      const response = await api.get(
        `/search/getGlobalSearch?search=${encodeURIComponent(term)}`
      );
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
    <div className="relative shadow-sm w-full" ref={navRef}>
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
                onSearch={handleGlobalSearch}
                placeholder="Search post, event, or item"
                recentSearch={recentSearches}
              />
            </div>

            <SuggestionGroup />
          </div>

          {/* RIGHT SIDE */}
          <div className="flex gap-x-6 items-center">
            {/* NOTIFICATION */}
            <div className="relative group">
              <Notification
                badgeCount={badgeCount}
                onClick={handleNotificationClick}
              />
              <LogoHoverMessage
                clickNotification={clickNotification}
                clickProfile={clickProfile}
                clickLogOut={clickLogOut}
                message="Notification"
              />
            </div>

            {/* PROFILE / LOG OUT */}
            <div className="relative group">
              {/* FIXED: Changed from <button> to <div> to prevent nesting error */}
              <div
                role="button"
                tabIndex={0}
                className={`p-2 flex cursor-pointer items-center gap-x-1 sm:gap-x-3 rounded-md transition-colors duration-200 ${
                  clickLogOut ? "bg-gray-400" : "hover:bg-gray-300"
                }`}
                onClick={handleLogOutClick}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        handleLogOutClick();
                    }
                }}
              >
                {/* ProfilePicture contains a <button> inside it.
                   We pass handleProfileClick which now stops propagation 
                   so clicking the image doesn't also trigger the logout logic.
                */}
                <ProfilePicture
                  profileImageURL={`${localStorage.getItem("profileLink")}`}
                  onClick={() => handleProfileClick} // TS might require wrapper if types mismatch, but this passes the function
                />

                <span className="hidden sm:inline">
                  <UserName
                    userName={`${localStorage.getItem(
                      "firstName"
                    )} ${localStorage.getItem("lastName")}`}
                  />
                </span>
                <ChevronDown
                  className={`transition-transform duration-300 ${
                    clickLogOut ? "rotate-180" : "rotate-0"
                  }`}
                />
              </div>
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
            onSearch={handleGlobalSearch}
            placeholder="Search post, event, or item"
            recentSearch={recentSearches}
          />
        </div>
      )}

      {/* MODALS */}
      {clickNotification && <NotificationClickModal ref={notifModalRef} />}
      {clickLogOut && <LogoutModal ref={logoutModalRef} />}

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