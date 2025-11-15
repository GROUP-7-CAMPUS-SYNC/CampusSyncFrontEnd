import Modal from "../../../components/modal"
import Button from "../../../components/button"
import StringTextField from "../../../components/stringTextField";
import UploadPicture from "../../../components/uploadPicture";
import { useState } from "react";

interface CreatePostProps {
  onClose: () => void;
}


export default function index({
  onClose,
} : CreatePostProps) {

  const [title, setTitle] = useState<string>("")
  const [content, setContent] = useState<string>("")
  const [image, setImage] = useState<File | null>(null)
  const [step, setSteps] = useState<number>(1)
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false)
  const [successfullySubmitted, setSuccessfullySubmitted] = useState<boolean>(false)

  const handleFirstStep = () => {
    setFormSubmitted(true)
    
    if(title.trim() == "" || content.trim() == "") return
    setFormSubmitted(false)
    setSteps(2)
  }


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)

    setSuccessfullySubmitted(true)
  }
  
  // This variable determines if the content error should show
  const showContentError = formSubmitted && content.trim() === "";

  return (
    <Modal
      cardContainerDesign = "bg-white shadow-lg rounded-lg p-6 w-[500px]"
    >
      <form onSubmit={handleSubmit} action="">

        {step == 1 && (
          <>
            <h2 className="text-2xl font-bold mb-6">Academic Details</h2>

            <StringTextField
              label="Title"
              placeholder="Enter Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              errorMessage="Title minimum of 3 characters"
              showError={formSubmitted && title.trim() === ""}
            />

            {/* === Start: Custom Textarea for Content === */}
            {/* This block replaces the 'StringTextField' for 'Content' */}
            <div className="flex flex-col gap-1">
              {/* Label (using styles from your component) */}
              <label className="text-sm text-gray-700" htmlFor="content-field">
                Content
              </label>
              
              {/* Textarea Wrapper (to match StringTextField structure) */}
              <div className="flex items-center gap-2">
                <textarea
                  id="content-field"
                  name="content-field"
                  rows={5} 
                  className={`
                    border border-gray-400 rounded-[5px] px-3 py-1 w-full 
                    focus:outline-none focus:ring-2 focus:ring-blue-400
                    ${showContentError ? "border-red-500 focus:ring-red-400" : ""}
                  `}
                  placeholder="Enter Content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              
              {/* Error Message (matches StringTextField's logic) */}
              <p className={`text-sm ${showContentError ? "text-red-500" : "text-white"}`}>
                Please fill the text field
              </p>
            </div>
            {/* === End: Custom Textarea for Content === */}


            <div className="flex flex-row gap-x-10">
              <Button
                buttonContainerDesign = "bg-white border border-[#3B82F6] p-[10px] w-full text-[#3B82F6] rounded-[6px] hover:bg-blue-50 transition-colors duration-200 hover:cursor-pointer"
                type="button"
                buttonText="Close"
                onClick={onClose}
              />

              <Button
                type="button"
                buttonText="Continue"
                onClick={handleFirstStep}
              />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold mb-6">Upload Academic Image</h2>

            <UploadPicture
              image={image}
              setImage={setImage}
            />

            {formSubmitted && !image && (
              <p className="text-red-500 text-sm mb-4 font-semibold">Please upload an image</p>
            )}

            <div className="flex flex-row gap-x-10">
              <Button
                buttonContainerDesign = "bg-white border border-[#3B82F6] p-[10px] w-full text-[#3B82F6] rounded-[6px] hover:bg-blue-50 transition-colors duration-200 hover:cursor-pointer"
                type="button"
                buttonText="Back"
                onClick={() => setSteps(1)}
              />

              <Button
                type="submit"
                buttonText="Submit"
              />
            </div>
          </>
        )}
      </form>

      {successfullySubmitted && (
        <Modal>
          <p>Successfully Submitted</p>
          <Button
            type="button"
            buttonText="Close"
            onClick={onClose}
          />
        </Modal>
      )}
    </Modal>
  )
}