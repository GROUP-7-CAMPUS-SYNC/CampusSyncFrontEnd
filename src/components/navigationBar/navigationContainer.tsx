    import { useEffect, useState } from "react"
    import Notification from "./notification"
    import Profile from "./profile/profilePicture"
    import UserName from "./profile/userName"
    import SearchBar from "../searchBar"
    import SuggestionGroup from "./suggestionGroup/suggestionGroup"
    import LogoHoverMessage from "./logoHoverMessage"
    import NotificationClickModal from "./notificationClickModal"
    import ProfileClickModal from "./profileClickModal"
    import LogOutUser from "./logout"
    import { useScreenSize } from "../../hooks/useScreenSize"
    import { Search, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react"

    export default function navigationContainer() {
        
        const [searchBarValue, setSearchBarValue] = useState<string>("")
        const [clickNotification, setClickNotification] = useState<boolean>(false)
        const [clickProfile, setClickProfile] = useState<boolean>(false)
        const [clickLogOut, setClickLogOut] = useState<boolean>(false)
        const [clickSmallScreenSearchBar, setClickSmallScreenSearchbar] = useState<boolean>(false)

        const isSmallScreen = useScreenSize(400)

        {/**
        * @effect State Synchronization for Responsive UI
        *
        * @purpose
        * This effect synchronizes the component's React state (`clickSmallScreenSearchBar`)
        * with the browser's viewport size (`isSmallScreen` hook). It prevents a
        * common UI bug where the state and the CSS media queries fall out of sync.
        *
        * @problem_Scenario
        * 1. User is on a small screen (`isSmallScreen` is true).
        * 2. User taps the `Search` icon, setting `clickSmallScreenSearchBar` to `true`.
        * 3. The mobile search bar (with the `<ArrowLeft>` icon) correctly appears.
        * 4. User then resizes the browser window to be large (`isSmallScreen` becomes false).
        * 5. **THE BUG:** The React state (`clickSmallScreenSearchBar`) remains `true`,
        * causing the mobile search UI to persist and the main desktop navigation
        * (SuggestionGroup, Profile, etc.) to remain hidden, breaking the layout.
        *
        * @solution
        * This effect listens *only* for changes to the `isSmallScreen` boolean.
        * When `isSmallScreen` changes to `false` (meaning the screen is now large),
        * it forcefully resets the component state by setting `clickSmallScreenSearchBar`
        * back to `false`.
        *
        * @result
        * The main desktop navigation is reliably restored, ensuring the component's
        * appearance always matches the current viewport size.
        */
        }
        useEffect(() => {
            if (!isSmallScreen) {
                setClickSmallScreenSearchbar(false)
            } 
        }, [isSmallScreen])

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

        const recentSearchesData: string[] = [
            "Student ID",
            "Laptop Acer",
            "Week of welcome",
            "Samsung phone",
            "Cyber Security",
            "Organization of Student Asso."
        ]

    return (
        <div
            className="2xl:pl-10 flex shadow-lg w-full h-18 py-2 2xl:px-3 px-2"
        >
            {clickSmallScreenSearchBar == false && (        
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
                            <button
                                onClick={() => setClickSmallScreenSearchbar(!clickSmallScreenSearchBar)}
                            >
                                <Search />
                            </button>
                        </div>


                        {/* Medium and larger screens: show SearchBar */}
                        <div className="hidden [@media(min-width:400px)]:block">
                            <SearchBar
                                value={searchBarValue}
                                onChange={(e) => setSearchBarValue(e.target.value)}
                                placeholder="Search post, event, or item"
                                recentSearch={recentSearchesData}
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
            </div>)}

            {clickSmallScreenSearchBar == true && (
                <div
                    className="flex flex-row justify-center items-center gap-y-10 w-full"
                >
                    <button
                        onClick={() => setClickSmallScreenSearchbar(false)}
                    >
                        <ArrowLeft/>
                    </button>
                    <SearchBar
                        searchBarContainerDesign = "relative bg-[#EEEEEE] flex items-center gap-3 p-3 h-[6vh]  w-full"
                        value={searchBarValue}
                        onChange={(e) => setSearchBarValue(e.target.value)}
                        placeholder="Search post, event, or item"
                        recentSearch={recentSearchesData}
                    />
                </div>
            )}



            {clickNotification && <NotificationClickModal />}
            {clickProfile && <ProfileClickModal />}
            {clickLogOut && <LogOutUser />}
            
        </div>
    )
    }
