import React, { useState } from "react";
import "../css/createPost.css";
import SearchBar from "../../../components/searchBar";
import { BiImageAdd } from "react-icons/bi";

type CloseProps = {
  onClose: () => void;
};

export default function CreatePost({ onClose }: CloseProps) {
  return (
    <>
      <div
        className="
      
      bg-white border shadow-xl 

      w-screen h-screen rounded-none

      sm:w-full sm:h-auto sm:max-w-lg sm:rounded-2xl

      p-4 lg:p-6
      
      "
      >
        <h3>Create Post</h3>

        <form>
          {/* Event Details */}
          <div className="event-details">
            <label>Event Name: </label>
            <input
              type="text"
              className="input-detail"
              placeholder="Enter Event Name"
              required
            />

            <label>Location: </label>
            <input
              type="text"
              className="input-detail"
              placeholder="Enter Event Location"
              required
            />

            <label>Course: </label>
            <input
              type="text"
              className="input-detail"
              placeholder="e.g. All BSIT Students"
              required
            />

            <label>Open To: </label>
            <input
              type="text"
              className="input-detail"
              placeholder="e.g. Open to Everyone"
              required
            />
          </div>

          {/* Date Inputs */}
          <div className="set-date-wrapper">
            <div className="set-date-container">
              <p>Start Event: </p>
              <input type="date" className="set-date" />
            </div>
            <div className="set-date-container">
              <p>End Event: </p>
              <input type="date" className="set-date" />
            </div>
          </div>

          {/* Image Input */}
          <div className="img-input-container">
            <BiImageAdd size={40} />
            <span className="text-gray-800">+ Upload Image</span>

            <input type="file" accept="image" className="img-input" />
          </div>

          {/* Buttons */}
          <div className="button-wrapper">
            <button className="close-btn" onClick={onClose}>
              Close
            </button>
            <button className="post-Btn">Post</button>
          </div>
        </form>
      </div>
    </>
  );
}
