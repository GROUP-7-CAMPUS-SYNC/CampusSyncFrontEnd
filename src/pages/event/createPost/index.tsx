import React from "react";
import "../css/createPost.css";
import { BiImageAdd } from "react-icons/bi";

export default function CreatePost() {
  return (
    <>
      <div className="w-full max-w-lg md:mx-auto mx-14 bg-white rounded-2xl md:p-6 p-4 border shadow-xl shadow-white">
        <h3>Create Post</h3>

        <form>
          {/* Event Details */}
          <div className="event-details">
            <label>Event Name: </label>
            <input
              type="text"
              className="input-detail"
              placeholder="Enter Event Name"
            />

            <label>Location: </label>
            <input
              type="text"
              className="input-detail"
              placeholder="Enter Event Location"
            />

            <label>Course: </label>
            <input
              type="text"
              className="input-detail"
              placeholder="e.g. All BSIT Students"
            />

            <label>Open To: </label>
            <input
              type="text"
              className="input-detail"
              placeholder="e.g. Open to Everyone"
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
          <label className="img-input-container">
            <BiImageAdd size={40} />
            <span className="text-gray-800">+ Upload Image</span>

            <input type="file" accept="image" className="img-input" />
          </label>

          {/* Buttons */}
          <div className="button-wrapper">
            <button className="close-btn">Close</button>
            <button className="post-btn">Post</button>
          </div>
        </form>
      </div>
    </>
  );
}
