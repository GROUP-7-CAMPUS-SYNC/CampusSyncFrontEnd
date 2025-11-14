import Modal from "../../../components/modal"
import Button from "../../../components/button"
import StringTextField from "../../../components/stringTextField";
import { useState } from "react";
import { Calendar } from "lucide-react";

interface CreatePostProps {
    onClose: () => void;
}

export default function index({
    onClose,
} : CreatePostProps) {

    const [eventName, setEventName] = useState<string>("")
    const [eventLocation, setEventLocation] = useState<string>("")
    const [course, setCourse] = useState<string>("")
    const [openTo, setOpenTo] = useState<string>("")
    const [startDate, setStartDate] = useState<string>("")
    const [endDate, setEndDate] = useState<string>("")
    const [image, setImage] = useState<File | null>(null)
    const [formSubmitted, setFormSubmitted] = useState<boolean>(false)
    const [dateError, setDateError] = useState<string>("")
    const [step, setStep] = useState<number>(1)
    const [successfullySubmitted, setSuccessfullySubmitted] = useState<boolean>(false)


    const handleFirstStep = () => {
        setFormSubmitted(true)
        
        if(eventName.trim() == "" || eventLocation.trim() == "" || course.trim() == "" || openTo.trim() == "") return
        setFormSubmitted(false)
        setStep(2)
    }

    const handleSecondStep = () => {
        setFormSubmitted(true)
        setDateError("")

        // Check if dates are empty
        if(startDate.trim() === "" ||  endDate.trim() === "") {
            setDateError("Please fill in both start and end dates")
            return
        }

        // Convert to Date Object
        const startEventTime = new Date(startDate)
        const endEventTime = new Date(endDate)
        const now = new Date()
        const minimumStartDate = new Date(now.getTime() + 60 * 60 * 1000) // Add One Hour of current time

        // Check if start date is less than 1 hour from now
        if(startEventTime < minimumStartDate) {
            setDateError("Event must start at least 1 hour from now")
            return
        }

        // Check if start date is after end date
        if(startEventTime > endEventTime) {
            setDateError("Start date cannot be after end date")
            return
        }

        setFormSubmitted(false)
        setStep(3)
    }

    const handleFormSubmtion = (e: React.FormEvent) => {
        e.preventDefault()

        setFormSubmitted(true)

        if(!image) {
            return
        }

        console.log("✅ Form submitted successfully:", {
            eventName,
            eventLocation,
            course,
            openTo,
            startDate,
            endDate,
            image
        })

        setSuccessfullySubmitted(true)

    }

    return (
        <Modal
            cardContainerDesign = "bg-white shadow-lg rounded-lg p-6 w-[500px]"
        >
            <form onSubmit={handleFormSubmtion}>
                {step === 1 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Event Details</h2>

                        <StringTextField
                            label="Event Name"
                            placeholder="Enter Event Name"
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                            errorMessage="Event name minimum of 3 characters"
                            showError={formSubmitted && eventName.trim() === ""}
                        />

                        <StringTextField
                            label="Location"
                            placeholder="Enter Event Location"
                            value={eventLocation}
                            onChange={(e) => setEventLocation(e.target.value)}
                            errorMessage="Please fill the text field"
                            showError={formSubmitted && eventLocation.trim() === ""}
                        />

                        <StringTextField
                            label="Course"
                            placeholder="e.g. All BSIT Students"
                            value={course}
                            onChange={(e) => setCourse(e.target.value)}
                            errorMessage="Please fill the text field"
                            showError={formSubmitted && course.trim() === ""}
                        />

                        <StringTextField
                            label="Open To"
                            placeholder="e.g. Open to Everyone"
                            value={openTo}
                            onChange={(e) => setOpenTo(e.target.value)}
                            errorMessage="Please fill the text field"
                            showError={formSubmitted && openTo.trim() === ""}
                        />

                        <div className="flex flex-row gap-x-10">
                            <Button
                                buttonContainerDesign = "bg-white border border-[#3B82F6] p-[10px] w-full text-[#3B82F6] rounded-[6px] hover:bg-[#2563EB] transition-colors duration-200 hover:cursor-pointer"
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
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Event Dates</h2>

                        {/* Display Date Error */}
                        {dateError && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-lg">
                                <p className="text-red-600 text-sm font-semibold">{dateError}</p>
                            </div>
                        )}

                        {/* Start Date */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Start Date & Time
                            </label>
                            <div className="relative flex items-center">
                                <Calendar className="absolute left-3 w-5 h-5 text-gray-400 pointer-events-none" />
                                <input
                                    type="datetime-local"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            {formSubmitted && startDate.trim() === "" && (
                                <p className="text-red-500 text-sm mt-1">Please select start date</p>
                            )}
                        </div>

                        {/* End Date */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                End Date & Time
                            </label>
                            <div className="relative flex items-center">
                                <Calendar className="absolute left-3 w-5 h-5 text-gray-400 pointer-events-none" />
                                <input
                                    type="datetime-local"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            {formSubmitted && endDate.trim() === "" && (
                                <p className="text-red-500 text-sm mt-1">Please select end date</p>
                            )}
                        </div>

                        {/* Date Summary */}
                        {startDate && endDate && (
                            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-gray-700">
                                    <span className="font-semibold">Event Duration:</span> {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
                                </p>
                            </div>
                        )}

                        <div className="flex flex-row gap-x-10">
                            <Button
                                buttonContainerDesign = "bg-white border border-[#3B82F6] p-[10px] w-full text-[#3B82F6] rounded-[6px] hover:bg-blue-50 transition-colors duration-200 hover:cursor-pointer"
                                type="button"
                                buttonText="Back"
                                onClick={() => setStep(1)}
                            />

                            <Button
                                type="button"
                                buttonText="Continue"
                                onClick={handleSecondStep}
                            />
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Upload Event Image</h2>

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

                        {formSubmitted && !image && (
                            <p className="text-red-500 text-sm mb-4 font-semibold">Please upload an image</p>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex flex-row gap-x-10">
                            <Button
                                buttonContainerDesign = "bg-white border border-[#3B82F6] p-[10px] w-full text-[#3B82F6] rounded-[6px] hover:bg-blue-50 transition-colors duration-200 hover:cursor-pointer"
                                type="button"
                                buttonText="Back"
                                onClick={() => setStep(2)}
                            />

                            <Button
                                type="submit"
                                buttonText="Submit"
                                onClick={() => {
                                    setFormSubmitted(true);
                                    if (!image) return;
                                }}
                            />
                        </div>
                    </div>
                )}

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
            </form>
        </Modal>
    )
}