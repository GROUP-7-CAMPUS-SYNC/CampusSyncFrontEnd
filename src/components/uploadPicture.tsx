import React from 'react'

interface UploadPictureProps {
    image: File | null;
    setImage: React.Dispatch<React.SetStateAction<File | null>>;
}

export default function uploadPicture({ 
    image, 
    setImage 
}: UploadPictureProps) {
  return (
    <>
        {/* Image Preview */}
        {image && (
            <div className="mb-6">
                <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                    <img
                        src={URL.createObjectURL(image)}
                        alt="Preview"
                        className="w-full h-full object-contain"
                    />
                </div>
                <button
                    type="button"
                    onClick={() => setImage(null)}
                    className="mt-2 text-sm text-red-500 hover:text-red-700 font-semibold"
                >
                    Remove Image
                </button>
            </div>
        )}

        {/* Image Upload Area */}
        {!image && (
            <label className="mb-6 flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                        className="w-12 h-12 text-gray-400 mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                    <p className="text-sm text-gray-500 font-semibold">Click to upload image</p>
                    <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
                </div>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        if (e.target.files?.[0]) {
                            setImage(e.target.files[0]);
                        }
                    }}
                    className="hidden"
                />
            </label>
        )}
    </>
  )
}
