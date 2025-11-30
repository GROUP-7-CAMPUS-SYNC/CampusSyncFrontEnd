import TopBar from "../../components/navigationBar/index"
import SideBar from "../../components/sideBar"
import Profile from "./index"

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
                className="flex-1 overflow-y-auto pb-16 md:pb-0" 
            >
                <TopBar/>

                <Profile/>
            </main>
        </div>
    </div>
  )
}