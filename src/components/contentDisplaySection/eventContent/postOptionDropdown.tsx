import {  Trash } from "lucide-react";


interface PostOptionDropDownProps {
  onClose: () => void;
  onDeleteClick?: () => void;
}

export default function PostOptionDropDown({
  onClose,
  onDeleteClick,
}: PostOptionDropDownProps) {
  return (
    // 1. absolute: Takes it out of the normal flow
    // 2. right-0: Aligns it to the right edge of the button
    // 3. mt-2: Adds a small gap between button and menu
    // 4. z-50: Ensures it floats on TOP of the image below
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-gray-200 ring-opacity-5 z-50 overflow-hidden">
      <div className="py-1">

        <button
          onClick={() => {
            if(onDeleteClick) onDeleteClick();
            onClose()
          }}
          className="flex items-center w-full px-4 py-3 cursor-pointer text-sm text-gray-700 hover:bg-gray-100 gap-3 transition-colors"
        >
          <Trash size={16} className="text-blue-500" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}