import Modal from "../../../components/modal" // Corrected path
import Button from "../../../components/button" // Corrected path
import StringTextField from "../../../components/stringTextField"; // Corrected path
import UploadPicture from "../../../components/uploadPicture"; // Corrected path
import { useState, useEffect } from "react";
import { Calendar, CheckCircle } from "lucide-react";
import api from "../../../api/api" // Corrected path


interface Organization {
    _id: string;
    organizationName: string;
}

interface CreatePostProps {
    onClose: () => void;
}

const PLACEHOLDER_IMAGE_URL = "https://res.cloudinary.com/dzbzkil3e/image/upload/v1762858878/Rectangle_4_zgkeds.png";


export default function Index({
    onClose,
}: CreatePostProps) {


    // Event Details State (Step 1 & 2) - Retained from original event form
    const [eventName, setEventName] = useState<string>("")
    const [eventLocation, setEventLocation] = useState<string>("")
    const [course, setCourse] = useState<string>("")
    const [openTo, setOpenTo] = useState<string>("")
    const [startDate, setStartDate] = useState<string>("")
    const [endDate, setEndDate] = useState<string>("")
   
    // Organization State - Added from academic reference
    const [managedOrgs, setManagedOrgs] = useState<Organization[]>([]);
    const [organizationId, setOrganizationId] = useState<string>("");


    // UI/Flow State
    const [image, setImage] = useState<File | null>(null)
    const [formSubmitted, setFormSubmitted] = useState<boolean>(false)
    const [dateError, setDateError] = useState<string>("")
    const [step, setStep] = useState<number>(1)
    const [successfullySubmitted, setSuccessfullySubmitted] = useState<boolean>(false)
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [submissionError, setSubmissionError] = useState<string | null>(null);

    useEffect(() => {
        const getAllOrganizationAssigned = async () => {
            try
            {
                // Target the correct event endpoint for organization validation
                const response = await api.get("/events/get_managed_organization");
               
                const orgData = response.data.organization;


                if (Array.isArray(orgData) && orgData.length > 0) {
                    const formattedData: Organization[] = orgData.map((org: any) => ({
                        _id: org._id,
                        organizationName: org.organizationName,
                    }));
                   
                    setManagedOrgs(formattedData);
                    setOrganizationId(formattedData[0]._id); // Auto-select first organization
                }
            }
            catch(error)
            {
                console.error("Error fetching organizations:", error);
                setSubmissionError("Failed to load organization data for posting.");
            }
        };


        getAllOrganizationAssigned();
    }, []);




    const handleFirstStep = () => {
        setFormSubmitted(true)
        setSubmissionError(null)
       
        // Validate all required fields in step 1, including organizationId
        if(eventName.trim() === "" || eventLocation.trim() === "" || course.trim() === "" || openTo.trim() === "" || organizationId === "") return


        setFormSubmitted(false)
        setStep(2)
    }


    const handleSecondStep = () => {
        setFormSubmitted(true)
        setDateError("")


        // Date validation logic (Your original logic)
        if(startDate.trim() === "" || endDate.trim() === "") {
            setDateError("Please fill in both start and end dates")
            return
        }


        const startEventTime = new Date(startDate)
        const endEventTime = new Date(endDate)
        const now = new Date()
        const minimumStartDate = new Date(now.getTime() + 60 * 60 * 1000)


        if(startEventTime < minimumStartDate) {
            setDateError("Event must start at least 1 hour from now")
            return
        }


        if(startEventTime >= endEventTime) {
            setDateError("Start date cannot be after or the same as end date")
            return
        }


        setFormSubmitted(false)
        setStep(3)
    }


    // --- 2. API Submission Logic (Merged from reference code) ---
    const handleFormSubmtion = async (e: React.FormEvent) => {
        e.preventDefault()


        setFormSubmitted(true)
        setSubmissionError(null);


        if(!image) {
            return // Stop if image is missing
        }


        setIsSubmitting(true);


        const payload = {
            eventName,
            location: eventLocation,
            course,
            openTo,
            // Convert to ISO string for backend Mongoose Date handling
            startDate: new Date(startDate).toISOString(),
            endDate: new Date(endDate).toISOString(),
            image: PLACEHOLDER_IMAGE_URL,
            organizationId // Crucial: Organization ID is included
        }


        try {
            // Send data to the event creation endpoint
            const response = await api.post("/events/create_post", payload);
           
            if (response.status === 201) {
                setSuccessfullySubmitted(true);
            } else {
                 setSubmissionError(response.data?.message || `Submission failed with status: ${response.status}`);
            }


        } catch (e: any) {
            console.error("Event submission failed:", e);
            setSubmissionError(e.response?.data?.message || 'A network error occurred during submission.');
        } finally {
            setIsSubmitting(false);
        }
    }


    // Determine if submission is blocked by loading organization data
    const isOrgLoading = managedOrgs.length === 0 && organizationId === "";


    return (
        <Modal
            cardContainerDesign = "bg-white shadow-lg rounded-lg p-6 w-[500px]"
        >
            {/* Show success modal if submitted */}
            {successfullySubmitted ? (
                <div className="text-center p-4">
                    <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-4" />
                    <p className="font-semibold mb-4 text-lg">Event Post Created Successfully!</p>
                    <Button
                        type="button"
                        buttonText="Close"
                        onClick={onClose}
                    />
                </div>
            ) : (
                <form onSubmit={handleFormSubmtion}>
                   
                    {/* General Submission Error Display */}
                    {submissionError && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                            <p className="font-semibold">Error:</p>
                            <p>{submissionError}</p>
                        </div>
                    )}


                    {step === 1 && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Event Details</h2>
                           
                            {/* --- Organization Dropdown (Integrated) --- */}
                            <div className="flex flex-col gap-1 mb-4">
                                <label className="text-sm text-gray-700 font-semibold" htmlFor="org-select">
                                    Post As Organization:
                                </label>
                                <div className="relative">
                                    <select
                                        id="org-select"
                                        value={organizationId}
                                        onChange={(e) => setOrganizationId(e.target.value)}
                                        className="appearance-none border border-gray-400 rounded-[5px] px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white cursor-pointer text-gray-900"
                                        disabled={isOrgLoading || managedOrgs.length === 0}
                                    >
                                        {isOrgLoading ? (
                                            <option disabled>Loading organizations...</option>
                                        ) : managedOrgs.length > 0 ? (
                                            managedOrgs.map((org) => (
                                                <option key={org._id} value={org._id} className="text-gray-900">
                                                    {org.organizationName}
                                                </option>
                                            ))
                                        ) : (
                                            <option disabled>No managed organizations found</option>
                                        )}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                        </svg>
                                    </div>
                                </div>
                                {formSubmitted && organizationId === "" && (
                                    <p className="text-red-500 text-sm mt-1">Please select an organization</p>
                                )}
                            </div>
                            {/* --- End Organization Dropdown --- */}
                           
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


                            <div className="flex flex-row gap-x-10 mt-2">
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
                            {startDate && endDate && !dateError && (
                                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-sm text-gray-700">
                                        <span className="font-semibold">Event Duration:</span> {new Date(startDate).toLocaleString()} - {new Date(endDate).toLocaleString()}
                                    </p>
                                </div>
                            )}


                            <div className="flex flex-row gap-x-10 mt-2">
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
                           
                            <div className="mb-4 text-sm text-gray-600 bg-gray-50 p-2 rounded border border-gray-200">
                                Posting as: <strong>{managedOrgs.find(o => o._id === organizationId)?.organizationName || 'N/A'}</strong>
                            </div>


                            <UploadPicture
                                image={image}
                                setImage={setImage}
                            />


                            {formSubmitted && !image && (
                                <p className="text-red-500 text-sm mb-4 font-semibold">Please upload an image</p>
                            )}


                            {/* Navigation Buttons */}
                            <div className="flex flex-row gap-x-10 mt-2">
                                <Button
                                    buttonContainerDesign = "bg-white border border-[#3B82F6] p-[10px] w-full text-[#3B82F6] rounded-[6px] hover:bg-blue-50 transition-colors duration-200 hover:cursor-pointer"
                                    type="button"
                                    buttonText="Back"
                                    onClick={() => setStep(2)}
                                />


                                <Button
                                    type="submit"
                                    buttonText= "Submit"
                                />
                            </div>
                        </div>
                    )}
                </form>
            )}
        </Modal>
    )
}

