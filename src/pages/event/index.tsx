import React, { useState } from "react";
import SearchBarLogo from "../../assets/search-bar-logo.svg";
import ProfileLogo from "../../assets/profile-logo.svg";
import SearchPost from "./SearchPost";
import CreatePost from "./createPost";
import "./css/index.css";

export default function index() {
  const [isPostClicked, setIsPostClicked] = useState(false);
  const [isSearchClicked, setIsSearchClicked] = useState(false);

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
          <div className="relative w-full">
            <div className="search-bar">
              <img
                src={SearchBarLogo}
                alt="search"
                className="search-bar-Logo"
              />
              <input
                onClick={() => setIsSearchClicked(true)}
                type="text"
                placeholder="Search Event"
                className="search-input"
              />
            </div>
            {isSearchClicked && (
              <div className="absolute top-full mt-2 left-0 flex items-center justify-start gap-3 w-full p-3 bg-white text-gray-500 rounded-br-4xl rounded-bl-4xl shadow-md">
                <div className="mb-5">Arrow</div>
                <SearchPost />
              </div>
            )}
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
          <CreatePost />
        </div>
      )}
    </>
  );
}
