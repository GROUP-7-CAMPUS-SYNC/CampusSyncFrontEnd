import TopBar from "../../components/navigationBar/index"
import SideBar from "../../components/sideBar"
import Event from "./index"
import MessageBubble from "../../components/privateChat/itemUserMessage"

export default function index() {

 return (
    <div
        className="flex flex-col h-screen overflow-hidden"
    >
        <div
            className="flex md:flex-row flex-col flex-1 overflow-hidden"
        >
            <SideBar/>
            <main
                className="flex-1 overflow-y-auto pb-16 md:pb-0 bg-[#f1f3f7]"
            >
                <TopBar/>

                <div className="fixed right-6 top-[80%] z-50">
                    <MessageBubble />
                </div>
                
                <Event/>
            </main>
        </div>
    </div>
  )
}

