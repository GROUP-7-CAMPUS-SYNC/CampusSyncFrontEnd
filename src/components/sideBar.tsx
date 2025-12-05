import {
  Home,
  Search,
  Calendar,
  GraduationCap,
  BookmarkPlus,
} from "lucide-react";
import "../css/components/sideBar.css";
import WebsiteLogo from "../components/navigationBar/websiteLogo";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation

export default function SideBar() {
  // Standard naming convention: Capitalize components
  const navigation = useNavigate();
  const location = useLocation(); // Hook to get current URL path

  // Helper function to determine if a path is active
  const isActive = (path: string) => location.pathname === path;

  // Common class logic to avoid repetition
  const getButtonClass = (path: string) =>
    `logo-container ${
      isActive(path) ? "logo-container-current-page" : "md:hover:bg-gray-300"
    }`;

  return (
    <nav className="side-bar-container">
      <div className="hidden md:flex justify-around sm:justify-center items-center w-full mb-5">
        <WebsiteLogo profileDesign="w-[100px] h-[100px]" />
      </div>
      <ul className="list-item-container">
        {/* Dashboard / Home */}
        <li>
          <button
            onClick={() => navigation("/home")}
            className={getButtonClass("/home")}
          >
            <Home className="logo-size" />
            <p className="typograpy hidden sm:inline">Dashboard</p>
          </button>
        </li>

        {/* Lost & Found */}
        <li>
          <button
            onClick={() => navigation("/lost&found")}
            className={getButtonClass("/lost&found")}
          >
            <Search className="logo-size" />
            <p className="typograpy hidden sm:inline">Lost & Found</p>
          </button>
        </li>

        {/* Event */}
        <li>
          <button
            onClick={() => navigation("/event")}
            className={getButtonClass("/event")}
          >
            <Calendar className="logo-size" />
            <div className="flex flex-row justify-between w-full items-center typograpy">
              <p className="hidden sm:inline">Event</p>
            </div>
          </button>
        </li>

        {/* Academic */}
        <li>
          <button
            onClick={() => navigation("/academic")}
            className={getButtonClass("/academic")}
          >
            <GraduationCap className="logo-size" />
            <p className="typograpy hidden sm:inline">Academic</p>
          </button>
        </li>

        {/* Save */}
        <li>
          <button
            onClick={() => navigation("/save")}
            className={getButtonClass("/save")}
          >
            <BookmarkPlus className="logo-size" />
            <p className="typograpy hidden sm:inline">Save</p>
          </button>
        </li>
      </ul>
    </nav>
  );
}
