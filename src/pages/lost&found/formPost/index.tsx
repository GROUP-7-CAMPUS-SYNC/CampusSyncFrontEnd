import Modal from "../../../components/modal";
import Button from "../../../components/button";
import StringTextField from "../../../components/stringTextField";
import UploadPicture from "../../../components/uploadPicture";
import { useState } from "react";
import type { ChangeEvent } from "react";
import { Calendar, Loader2 } from "lucide-react"; 
import api from "../../../api/api";
import { CheckCircle, XCircleIcon } from "lucide-react"; 

interface CreatePostProps {
  onClose: () => void;
}

export default function index({ onClose }: CreatePostProps) {
  const [reportType, setReportType] = useState<string>("Found");
  const [itemName, setItemName] = useState<string>("");
  const [locationDetails, setLocationDetails] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [validContact, setValidContact] = useState<boolean>(true);
  const [turnedOver, setTurnedOver] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [timeDetails, setTimeDetails] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [successfullySubmitted, setSuccessfullySubmitted] = useState<boolean>(false);
  const [step, setSteps] = useState<number>(1);
  const [dateError, setDateError] = useState<boolean>(false);

  // NEW: Loading State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const showContentError = formSubmitted && description.trim() === "";

  const [cloudinaryError, setCloudinaryError] = useState<boolean>(false);
  const [cloudinaryErrorMessage, setCloudinaryErrorMessage] = useState<string>("");

  const formatPhoneNumber = (value: string): string => {
    const digits = value.replace(/\D/g, "");
    const limited = digits.slice(0, 11);

    if (limited.length <= 4) {
      return limited;
    } else if (limited.length <= 7) {
      return limited.slice(0, 4) + " " + limited.slice(4);
    } else {
      return (
        limited.slice(0, 4) + " " + limited.slice(4, 7) + " " + limited.slice(7)
      );
    }
  };

  const validatePhoneNumber = (contact: string): boolean => {
    const digitsOnly = contact.replace(/\D/g, "");
    return digitsOnly.length === 11 && digitsOnly.startsWith("09");
  };

  const handleContactChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setContact(formatted);
    setValidContact(validatePhoneNumber(formatted));
  };

  const handleFirstStep = () => {
    setFormSubmitted(true);

    if (
      itemName.trim() == "" ||
      description.trim() == "" ||
      (reportType === "Found" && turnedOver.trim() === "")
    )
      return;

    setFormSubmitted(false);
    setSteps(2);
  };

  const handleSecondStep = () => {
    setFormSubmitted(true);

    const isContactValid = validatePhoneNumber(contact);
    setValidContact(isContactValid);

    if (
      contact.trim() == "" ||
      !isContactValid ||
      locationDetails.trim() == "" ||
      timeDetails.trim() == ""
    ) {
      return;
    }
    const foundItemTime = new Date(timeDetails);
    const today = new Date();

    if (foundItemTime > today) {
      setDateError(true);
      return;
    }

    setFormSubmitted(false);
    setSteps(3);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isSubmitting) return;

    setFormSubmitted(true);
    if (!image) return;

    // Start Loading
    setIsSubmitting(true);

    try {
      const signatureResponse = await api.get("/upload/generate_signature");

      const { timestamp, signature, folder, apiKey, cloudName } =
        signatureResponse.data;

      // PREPARE FORM DATA FOR CLOUDINARY
      const formData = new FormData();
      formData.append("file", image);

      // Essential Signed Upload Parameters
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("folder", folder);

      // Upload to cloudunary Directly
      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) {
        setCloudinaryError(true);
        setCloudinaryErrorMessage(
          uploadData.error.message || "Unknown Error during upload imaage"
        );
        setIsSubmitting(false); // Stop loading on error
      } else {
        const payload = {
          reportType,
          itemName,
          description,
          locationDetails,
          contactDetails: contact,
          dateLostOrFound: timeDetails,
          turnOver: turnedOver,
          image: uploadData.secure_url,
        };
        const response = await api.post("/report_types/createPost", payload);
        
        if (response.status === 201) {
            setSuccessfullySubmitted(true);
            setIsSubmitting(false); // Stop loading on success
            
        } else {
            setIsSubmitting(false); // Stop on API failure
        }
      }
    } catch (error) {
      console.log(error);
      setIsSubmitting(false); // Stop loading on crash
    }
  };

  return (
    <>
      {/* Main Modal Form */}
      <Modal cardContainerDesign="bg-white shadow-lg rounded-lg p-6 w-[500px]">
        {successfullySubmitted ? (
            <div className="text-center flex flex-col items-center justify-center p-4">
            <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">
                Post Created!
            </h2>
            <p className="text-gray-600 mb-6">
                Report Item post has been successfully published.
            </p>
            <Button type="button" buttonText="Close" onClick={onClose} />
            </div>
        ) : (
            <form onSubmit={handleSubmit} action="">
            {step === 1 && (
                <>
                <h2 className="text-2xl font-bold mb-6">Lost & Found Report</h2>

                <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-700" htmlFor="report-type">
                    Report Type
                    </label>

                    <div className="relative flex items-center gap-2">
                    <select
                        id="report-type"
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                        className={`
                                    appearance-none
                                    border border-gray-400 rounded-[5px] px-3 py-1 w-full
                                    focus:outline-none focus:ring-2 focus:ring-blue-400
                                    pr-8 
                                `}
                    >
                        <option value="Found">Found</option>
                        <option value="Lost">Lost</option>
                    </select>

                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 ">
                        <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                    </div>
                    </div>
                </div>

                <StringTextField
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    label="Item Name"
                    placeholder="e.g. Cellphone"
                    errorMessage="Item name minimum of 3 characters"
                    showError={formSubmitted && itemName.trim() === ""}
                />

                <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-700" htmlFor="content-field">
                    Description
                    </label>

                    <div className="flex items-center gap-2">
                    <textarea
                        id="content-field"
                        name="content-field"
                        rows={3}
                        className={`
                                    border border-gray-400 rounded-[5px] px-3 py-1 w-full
                                    focus:outline-none focus:ring-2 focus:ring-blue-400
                                    ${
                                    showContentError
                                        ? "border-red-500 focus:ring-red-400"
                                        : ""
                                    }
                                `}
                        placeholder="Enter Content"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    </div>

                    <p
                    className={`text-sm ${
                        showContentError ? "text-red-500" : "text-white"
                    }`}
                    >
                    Please fill the text field
                    </p>
                </div>

                {reportType === "Found" && (
                    <StringTextField
                    value={turnedOver}
                    onChange={(e) => setTurnedOver(e.target.value)}
                    label="Turned Over"
                    placeholder="e.g. Lost & Found center"
                    errorMessage="If you have the item just type N/A"
                    showError={formSubmitted && turnedOver.trim() === ""}
                    />
                )}

                <div className="flex flex-row gap-x-10 mt-2">
                    <Button
                    buttonContainerDesign="bg-white border border-[#3B82F6] p-[10px] w-full text-[#3B82F6] rounded-[6px] hover:bg-blue-50 transition-colors duration-200 hover:cursor-pointer"
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
                <h2 className="text-2xl font-bold mb-6">Item Details</h2>

                <StringTextField
                    value={contact}
                    onChange={handleContactChange}
                    maxLength={13}
                    label="Contact No."
                    placeholder="e.g 0909 440 5379"
                    errorMessage="Please enter a valid phone number"
                    showError={formSubmitted && !validContact}
                />

                <StringTextField
                    value={locationDetails}
                    onChange={(e) => setLocationDetails(e.target.value)}
                    label="Item location"
                    placeholder="e.g USTP Library"
                    errorMessage="Please fill the text field"
                    showError={formSubmitted && locationDetails.trim() === ""}
                />

                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Time details
                    </label>
                    <div className="relative flex items-center">
                    <Calendar className="absolute left-3 w-5 h-5 text-gray-400 pointer-events-none" />
                    <input
                        type="datetime-local"
                        value={timeDetails}
                        onChange={(e) => setTimeDetails(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    </div>
                    {formSubmitted &&
                    (timeDetails.trim() === "" || dateError === true) && (
                        <p className="text-red-500 text-sm mt-1">
                        Please select valid time
                        </p>
                    )}
                </div>

                <div className="flex flex-row gap-x-10 mt-2">
                    <Button
                    buttonContainerDesign="bg-white border border-[#3B82F6] p-[10px] w-full text-[#3B82F6] rounded-[6px] hover:bg-blue-50 transition-colors duration-200 hover:cursor-pointer"
                    type="button"
                    buttonText="Back"
                    onClick={() => setSteps(1)}
                    />

                    <Button
                    type="button"
                    buttonText="Continue"
                    onClick={handleSecondStep}
                    />
                </div>
                </>
            )}

            {step === 3 && (
                <>
                <h2 className="text-2xl font-bold mb-6">Item Image</h2>

                <UploadPicture image={image} setImage={setImage} />

                {formSubmitted && !image && (
                    <p className="text-red-500 text-sm mb-4 font-semibold">
                    Please upload an image
                    </p>
                )}

                <div className="flex flex-row gap-x-10 mt-2">
                    <Button
                    buttonContainerDesign="bg-white border border-[#3B82F6] p-[10px] w-full text-[#3B82F6] rounded-[6px] hover:bg-blue-50 transition-colors duration-200 hover:cursor-pointer"
                    type="button"
                    buttonText="Back"
                    onClick={() => setSteps(2)}
                    />

                    <Button 
                        type="submit" 
                        buttonText="Submit" 
                    />
                </div>
                </>
            )}
            </form>
        )}

        {cloudinaryError && (
          <Modal>
            <div className="text-center flex flex-col items-center justify-center p-4">
              <XCircleIcon className="w-12 h-12 text-red-500 mb-4" />
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Image Upload Failed
              </h2>
              <p className="text-gray-600 mb-6">{cloudinaryErrorMessage}</p>
              <Button type="button" buttonText="Close" onClick={onClose} />
            </div>
          </Modal>
        )}
      </Modal>

      {/* NEW: Loading Modal Overlay */}
      {isSubmitting && (
        <Modal
          cardContainerDesign="bg-white shadow-lg rounded-lg p-8 w-[300px] flex flex-col items-center justify-center"
        >
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
          <h3 className="text-lg font-semibold text-gray-800">Submitting...</h3>
          <p className="text-gray-500 text-sm mt-2">Please wait while we post your report.</p>
        </Modal>
      )}
    </>
  );
}