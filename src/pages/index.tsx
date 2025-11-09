import { useState } from "react"
import TopBar from "../components/navigationBar/index"
import SideBar from "../components/sideBar"
import Home from "../pages/home"
import Announcement from "../pages/announcement"
import LostAndFound from "../pages/lost&found"
import Event from "../pages/event"
import Save from "../pages/save"

export default function index() {

    const [currentPage, setCurrentPage] = useState<string>("home")

    const renderPage = () => {
        switch(currentPage) {
            case "home":
                return <Home/>
            case "lost&found":
                return <LostAndFound/>
            case "event":
                return <Event/>
            case "announcement":
                return <Announcement/>
            case "save":
                return <Save/>
            default:
                return <Home/>
        }
    }
 return (
    <div
        className="flex flex-col h-screen overflow-hidden"
    >
        <TopBar/>
        <div
            className="flex md:flex-row flex-col flex-1 overflow-hidden"
        >
            <SideBar currentPage={currentPage} setCurrentPage={setCurrentPage}/>
            <main
                className="flex-1 overflow-y-auto pb-16 md:pb-0" 
            >
                {renderPage()}
            </main>
        </div>
    </div>
  )
}