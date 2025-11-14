import {
  Home,
  Search,
  Calendar,
  GraduationCap,
  BookmarkPlus,
  Triangle,
} from "lucide-react";
import type { SideBarProps } from "../types/sideBar";
import "../css/components/sideBar.css";
import WebsiteLogo from "../components/navigationBar/websiteLogo";
import { useState } from "react";

export default function sideBar({ currentPage, setCurrentPage }: SideBarProps) {
  const [arrowClicked, setArrowClicked] = useState<{ [key: string]: boolean }>(
    {}
  );

  return (
    <nav className="side-bar-container">
      <div className="hidden md:flex justify-center items-center w-full mb-5">
        <WebsiteLogo profileDesign="w-[100px] h-[100px]" />
      </div>
      <ul className="list-item-container">
        <li>
          <button
            onClick={() => setCurrentPage("home")}
            className={`logo-container ${
              currentPage === "home"
                ? "logo-container-current-page"
                : "md:hover:bg-gray-300"
            }`}
          >
            <Home className="logo-size" />
            <p className={`typograpy`}>Home</p>
          </button>
        </li>

        <li>
          <button
            onClick={() => setCurrentPage("lost&found")}
            className={`logo-container ${
              currentPage === "lost&found"
                ? "logo-container-current-page"
                : "md:hover:bg-gray-300"
            }`}
          >
            <Search className="logo-size" />

            <p className={`typograpy`}>Lost & Found</p>
          </button>
        </li>

        <li>
          <button
            onClick={() => setCurrentPage("event")}
            className={`logo-container ${
              currentPage === "event"
                ? "logo-container-current-page"
                : "md:hover:bg-gray-300"
            }`}
          >
            <Calendar className="logo-size" />
            <p className={`typograpy`}>Event</p>
          </button>
        </li>

        <li>
          <button
            onClick={() => setCurrentPage("academic")}
            className={`logo-container ${
              currentPage === "academic"
                ? "logo-container-current-page"
                : "md:hover:bg-gray-300"
            }`}
          >
            <GraduationCap className="logo-size" />
            <p className={`typograpy`}>Academic</p>
          </button>
        </li>

        <li>
          <button
            onClick={() => setCurrentPage("save")}
            className={`logo-container ${
              currentPage === "save"
                ? "logo-container-current-page"
                : "md:hover:bg-gray-300"
            }`}
          >
            <BookmarkPlus className="logo-size" />

            <p className={`typograpy`}>Save</p>
          </button>
        </li>
      </ul>
    </nav>
  );
}
