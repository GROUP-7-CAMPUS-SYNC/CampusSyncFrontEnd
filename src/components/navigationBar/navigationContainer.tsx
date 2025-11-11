import { useState } from "react"
import Notification from "./notification"
import Profile from "./profile/profilePicture"
import UserName from "./profile/userName"
import SearchBar from "../searchBar"
import SuggestionGroup from "./suggestionGroup/suggestionGroup"
import LogoHoverMessage from "./logoHoverMessage"
import NotificationClickModal from "./notificationClickModal"
import ProfileClickModal from "./profileClickModal"
import LogOutUser from "./logout"
import { Search, ChevronDown, ChevronUp } from "lucide-react"

export default function navigationContainer() {
    
    const [searchBarValue, setSearchBarValue] = useState<string>("")
    const [clickNotification, setClickNotification] = useState<boolean>(false)
    const [clickProfile, setClickProfile] = useState<boolean>(false)
    const [clickLogOut, setClickLogOut] = useState<boolean>(false)

    const handleNotificationClick = () => {
        setClickNotification(!clickNotification)
        setClickProfile(false)
        setClickLogOut(false)
    }

    const handleProfileClick = () => {
        setClickProfile(!clickProfile)
        setClickNotification(false)
        setClickLogOut(false)
    }

    const handleLogOutClick = () => {
        setClickLogOut(!clickLogOut)
        setClickNotification(false)
        setClickProfile(false)
    }

  return (
    <div
        className="2xl:pl-10 flex border-b w-full h-18 py-2 2xl:px-3 px-2"
    >
        <div
            className="w-full flex justify-between gap-x-2 items-center"
        >
            <div
                className="flex gap-x-3 items-center "
            >
                <div
                    className=""
                >
                    {/* Small screen: only show Search icon */}
                    <div className="block [@media(min-width:400px)]:hidden">
                        <Search />
                    </div>


                    {/* Medium and larger screens: show SearchBar */}
                    <div className="hidden [@media(min-width:400px)]:block">
                        <SearchBar
                            value={searchBarValue}
                            onChange={(e) => setSearchBarValue(e.target.value)}
                            placeholder="Search post, event, or item"
                        />
                    </div>
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
                    <LogoHoverMessage
                        clickNotification={clickNotification}
                        clickProfile={clickProfile}
                        clickLogOut={clickLogOut} 
                        message="Notification" 
                    />
                </div>

                <div className="relative group">
                    <Profile 
                        profileImageURL="https://res.cloudinary.com/dzbzkil3e/image/upload/v1762858878/Rectangle_4_zgkeds.png"
                        onClick={handleProfileClick}
                    />

                    <LogoHoverMessage
                        clickNotification={clickNotification}
                        clickProfile={clickProfile}
                        clickLogOut={clickLogOut} 
                        message="Profile" 
                    />
                </div>

                <div className="relative group">
                    <button
                        className={`p-2 cursor-pointer flex flex-row items-center gap-x-2 rounded-md transition-colors duration-200 ${
                            clickLogOut 
                            ? 'bg-gray-400' // Active state (matches your image)
                            : 'hover:bg-gray-300' // Subtle hover when not active
                        }`}
                        onClick={handleLogOutClick}
                    >
                        <UserName 
                            userName="Liam"
                        />

                        {clickLogOut ? <ChevronUp/> : <ChevronDown/>}
                    </button>

                    <LogoHoverMessage
                        clickNotification={clickNotification}
                        clickProfile={clickProfile}
                        clickLogOut={clickLogOut}
                        message="Log Out" 
                    />
                </div>

            </div>
        </div>

        {clickNotification && <NotificationClickModal />}
        {clickProfile && <ProfileClickModal />}
        {clickLogOut && <LogOutUser />}
        
    </div>
  )
}
