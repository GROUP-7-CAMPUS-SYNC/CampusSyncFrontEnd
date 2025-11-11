import { Home, Search, Calendar, BookOpen, BookmarkPlus } from "lucide-react"
import type { SideBarProps } from "../types/sideBar"
import '../css/components/sideBar.css'
import WebsiteLogo from "../components/navigationBar/websiteLogo"


export default function sideBar({ 
    currentPage,
    setCurrentPage} : SideBarProps) {
 return (
    <nav
        className="side-bar-container"
    >
        <div
            className="hidden md:flex justify-center items-center w-full mb-5"
        >
            <WebsiteLogo 
                profileDesign="w-[100px] h-[100px]"
            />
        </div>
        <ul
            className="list-item-container"
        >

            <li>
                <button
                    onClick={() => setCurrentPage("home")}
                    className={`logo-container ${currentPage === "home" ? "logo-container-current-page" : ""}`}
                >
                    <Home className="logo-size"/>
                    <p
                        className={`typograpy`}
                    >
                        Home
                    </p>
                </button>
            </li>

            <li>
                <button
                    onClick={() => setCurrentPage("lost&found")}
                    className={`logo-container ${currentPage === "lost&found" ? "logo-container-current-page" : ""}`}
                >
                    <Search className="logo-size"/>

                    <p
                        className={`typograpy`}
                    >
                        Lost & Found
                    </p>
                </button>
            </li>
            
            <li>
                <button
                    onClick={() => setCurrentPage("event")}
                    className={`logo-container ${currentPage === "event" ? "logo-container-current-page" : ""}`}
                >
                    <Calendar className="logo-size"/>
                    <p
                        className={`typograpy`}
                    >
                        Event
                    </p>
                </button>
            </li>

            <li>
                <button
                    onClick={() => setCurrentPage("announcement")}
                    className={`logo-container ${currentPage === "announcement" ? "logo-container-current-page" : ""}`}
                >
                    <BookOpen className="logo-size"/>
                    <p
                        className={`typograpy`}
                    >
                        Announce
                    </p>
                </button>
            </li>

            <li>
                <button
                    onClick={() => setCurrentPage("save")} 
                    className={`logo-container ${currentPage === "save" ? "logo-container-current-page" : ""}`}
                >
                    <BookmarkPlus className="logo-size"/>

                    <p
                        className={`typograpy`}
                    >
                        Save
                    </p>
                </button>
            </li>

        </ul>
    </nav>
  )
}