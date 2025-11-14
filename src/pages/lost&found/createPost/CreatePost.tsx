import { useState } from "react";
import LostFoundPost from "../../../components/LostFoundPost";

const CreatePost = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-6">
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Create Lost & Found Post
      </button>

      {isOpen && <LostFoundPost onClose={() => setIsOpen(false)} />}
    </div>
  );
};

export default CreatePost;
