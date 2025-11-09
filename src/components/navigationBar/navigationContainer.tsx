import { useState } from "react"
import Notification from "./notification"
import WebsiteLogo from "./websiteLogo"
import Profile from "./profile"
import SearchBar from "../searchBar"
import SuggestionGroup from "./suggestionGroup/suggestionGroup"
import LogoHoverMessage from "./logoHoverMessage"
import NotificationClickModal from "./notificationClickModal"
import ProfileClickModal from "./profileClickModal"
import { Search } from "lucide-react"

export default function navigationContainer() {
    
    const [searchBarValue, setSearchBarValue] = useState<string>("")
    // const [clickSuggestionGroup, setClickSuggestionGroup] = useState<boolean>(false)
    const [clickNotification, setClickNotification] = useState<boolean>(false)
    const [clickProfile, setClickProfile] = useState<boolean>(false)

    const handleNotificationClick = () => {
        setClickNotification(!clickNotification)
        setClickProfile(false)
    }

    const handleProfileClick = () => {
        setClickProfile(!clickProfile)
        setClickNotification(false)
    }

  return (
    <div
        className="flex justify-between bg-[#F9BF3B] w-full h-18 py-2 lg:px-10 px-2"
    >
        <div
            className="flex"
        >
            <WebsiteLogo />
        </div>
        <div
            className="w-[80vw] flex sm:justify-between justify-end gap-x-2 items-center"
        >
            <div
                className="flex gap-x-3 items-center "
            >
                {/* Small screen: only show Search icon */}
                <div className="block [@media(min-width:500px)]:hidden">
                    <Search />
                </div>


                {/* Medium and larger screens: show SearchBar */}
                <div className="hidden [@media(min-width:500px)]:block">
                    <SearchBar
                    value={searchBarValue}
                    onChange={(e) => setSearchBarValue(e.target.value)}
                    placeholder="Search post, event, or item"
                    />
                </div>

                <SuggestionGroup />
            </div>

            {/* Right Section - Icons */}
            <div className="flex gap-x-6 items-center">
                <div className="relative group">
                <Notification 
                    badgeCount={5}
                    onClick={handleNotificationClick}
                />
                <LogoHoverMessage message="Notification" />
                </div>

                <div className="relative group">
                <Profile onClick={handleProfileClick}/>
                <LogoHoverMessage message="Profile" />
                </div>
            </div>
        </div>

        {clickNotification && <NotificationClickModal />}
        {clickProfile && <ProfileClickModal />}
        
    </div>
  )
}
