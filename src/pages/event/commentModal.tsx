import React from "react";
import { X, SendHorizontal } from "lucide-react";
interface CommentProps {
  postId: string;
  postedBy: { firstname: string; lastname: string } | null;
  onClose: () => void;
}

export default function CommentModal({
  postId,
  onClose,
  postedBy,
}: CommentProps) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-4 rounded-xl w-[90%] max-w-md ">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Comments</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        <div className="font-medium text-center text-gray-500 py-8">
          No Comments yet
        </div>
        <div className="flex border border-black/20 p-2 mt-2 rounded-xl">
          <textarea
            className="w-full outline-none resize-none"
            placeholder={`Comment as ${postedBy?.firstname ?? ""} ${
              postedBy?.lastname ?? ""
            }`}
          ></textarea>

          <button className="p-2 text-blue-600">
            <SendHorizontal size={25} />
          </button>
        </div>
      </div>
    </div>
  );
}
