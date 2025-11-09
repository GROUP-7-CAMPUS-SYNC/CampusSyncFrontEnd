import { Home, Search, Calendar, BookOpen, BookmarkPlus } from "lucide-react"
import type { SideBarProps } from "../types/sideBar"
import '../css/components/sideBar.css'

export default function sideBar({ 
    currentPage,
    setCurrentPage} : SideBarProps) {
 return (
    <nav
        className="side-bar-container"
    >
        <ul
            className="list-item-container"
        >

            <li>
                <button
                    onClick={() => setCurrentPage("home")}
                    className="logo-container"
                >
                    <Home color={`${currentPage === "home" ? "#F9BF3B" : "white"}`} className="logo-size"/>
                    <p
                        className={`typograpy ${currentPage === "home" ? "text-[#F9BF3B]" : "text-white"}`}
                    >
                        Home
                    </p>
                </button>
            </li>

            <li>
                <button
                    onClick={() => setCurrentPage("lost&found")}
                    className="logo-container"
                >
                    <Search color={`${currentPage === "lost&found" ? "#F9BF3B" : "white"}`} className="logo-size"/>

                    <p
                        className={`typograpy ${currentPage === "lost&found" ? "text-[#F9BF3B]" : "text-white"}`}
                    >
                        Lost & Found
                    </p>
                </button>
            </li>
            
            <li>
                <button
                    onClick={() => setCurrentPage("event")}
                    className="logo-container"
                >
                    <Calendar color={`${currentPage === "event" ? "#F9BF3B" : "white"}`} className="logo-size"/>
                    <p
                        className={`typograpy ${currentPage === "event" ? "text-[#F9BF3B]" : "text-white"}`} 
                    >
                        Event
                    </p>
                </button>
            </li>

            <li>
                <button
                    onClick={() => setCurrentPage("announcement")}
                    className="logo-container"
                >
                    <BookOpen color={`${currentPage === "announcement" ? "#F9BF3B" : "white"}`} className="logo-size"/>
                    <p
                        className={`typograpy ${currentPage === "announcement" ? "text-[#F9BF3B]" : "text-white"}`} 
                    >
                        Announce
                    </p>
                </button>
            </li>

            <li>
                <button
                    onClick={() => setCurrentPage("save")} 
                    className="logo-container"
                >
                    <BookmarkPlus color={`${currentPage === "save" ? "#F9BF3B" : "white"}`} className="logo-size"/>

                    <p
                        className={`typograpy ${currentPage === "save" ? "text-[#F9BF3B]" : "text-white"}`}
                    >
                        Save
                    </p>
                </button>
            </li>

        </ul>
    </nav>
  )
}