// File: src/components/lostFoundPost.tsx
import React, { useState } from "react";

interface LostFoundPostProps {
  onClose: () => void;
}

const LostFoundPost: React.FC<LostFoundPostProps> = ({ onClose }) => {
  const [reportType, setReportType] = useState("Found");
  const [itemName, setItemName] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [turnedOver, setTurnedOver] = useState("");
  const [description, setDescription] = useState("");
  const [timeDetails, setTimeDetails] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      reportType,
      itemName,
      location,
      contact,
      turnedOver: reportType === "Found" ? turnedOver : null,
      description,
      timeDetails,
      image,
    };
    console.log(formData);
    alert("Post submitted!");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Lost & Found Report
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Report Type */}
          <label className="font-medium">Report Type</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="border rounded-lg p-2"
          >
            <option value="Found">Found</option>
            <option value="Lost">Lost</option>
          </select>

          {/* Item Name */}
          <label className="font-medium">Item Name</label>
          <input
            type="text"
            placeholder="e.g. Cellphone"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="border rounded-lg p-2"
            required
          />

          {/* Location Details */}
          <label className="font-medium">Location Details</label>
          <input
            type="text"
            placeholder="e.g. USTP Library"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border rounded-lg p-2"
          />

          {/* Contact */}
          <label className="font-medium">Contact</label>
          <input
            type="text"
            placeholder="e.g. FB: Annabelle"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="border rounded-lg p-2"
          />

          {/* Turned Over — only shows when Found */}
          {reportType === "Found" && (
            <>
              <label className="font-medium">Turned Over</label>
              <input
                type="text"
                placeholder="e.g. Lost & Found Center"
                value={turnedOver}
                onChange={(e) => setTurnedOver(e.target.value)}
                className="border rounded-lg p-2"
              />
            </>
          )}

          {/* Description */}
          <label className="font-medium">Description</label>
          <textarea
            placeholder="e.g. Samsung Z2 color sky blue"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded-lg p-2 resize-none"
          />

          {/* Time Details */}
          <label className="font-medium">Time Details</label>
          <input
            type="datetime-local"
            value={timeDetails}
            onChange={(e) => setTimeDetails(e.target.value)}
            className="border rounded-lg p-2"
          />

          {/* Upload Image */}
          <label className="font-medium">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImage(e.target.files ? e.target.files[0] : null)
            }
            className="border rounded-lg p-2"
          />

          {/* Buttons */}
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded-lg"
            >
              Close
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LostFoundPost;
