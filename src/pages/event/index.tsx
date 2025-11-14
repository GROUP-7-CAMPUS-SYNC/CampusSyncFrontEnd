import React, { useState } from "react";
import SearchBarLogo from "../../assets/search-bar-logo.svg";
import ProfileLogo from "../../assets/profile-logo.svg";
import CreatePost from "./createPost";
import "./css/index.css";
import SearchBar from "../event/SearchPost/index";

export default function index() {
  const [isPostClicked, setIsPostClicked] = useState(false);
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [searchBarValue, setSearchBarValue] = useState("");
  const recentSearchData: string[] = [
    "CITC Days",
    "ROTC Event",
    "Week of Welcome",
    "MASTS",
  ];
  return (
    <>
      <div className="flex justify-center sm:p-6 py-6 px-2 bg-[#fafafa]">
        {/* Header */}
        <div className="header">
          {/* Profile Logo Btn */}
          <button className=" profile-btn">
            <img src={ProfileLogo} alt="profile-logo" />
          </button>

          {/* Search Bar */}

          <div className="search-bar">
            <SearchBar
              value={searchBarValue}
              onChange={(e) => setSearchBarValue(e.target.value)}
              placeholder="Search"
              recentSearch={recentSearchData}
            />
          </div>

          {/* Post Btn */}
          <button className="post-btn" onClick={() => setIsPostClicked(true)}>
            Post
          </button>
        </div>

        {/* Feed */}
      </div>

      {isPostClicked && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/30">
          <CreatePost onClose={() => setIsPostClicked(false)} />
        </div>
      )}
    </>
  );
}
