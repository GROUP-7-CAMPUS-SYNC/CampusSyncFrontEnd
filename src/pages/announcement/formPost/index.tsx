import Modal from "../../../components/modal";
import Button from "../../../components/button";
import StringTextField from "../../../components/stringTextField";
import UploadPicture from "../../../components/uploadPicture";
import { useEffect, useState } from "react";
import api from "../../../api/api";
import { CheckCircle, AlertCircle, XCircleIcon, Loader2 } from "lucide-react";

// 1. Define Interface for Edit Data
interface AcademicData {
  _id?: string;
  title: string;
  content: string;
  image: string;
  organizationId?: string;
}

interface Organization {
  _id: string;
  organizationName: string;
}

interface CreatePostProps {
  onClose: () => void;
  initialData?: AcademicData; // 2. Add optional initialData prop
}

export default function Index({
  onClose,
  initialData // 3. Destructure it
}: CreatePostProps) {

  // Initialize State (Use initialData if available, else defaults)
  const [title, setTitle] = useState<string>(initialData?.title || "");
  const [content, setContent] = useState<string>(initialData?.content || "");

  // Image handling for Edit Mode
  const [image, setImage] = useState<File | null>(null);
  const [existingImageUrl] = useState<string | null>(initialData?.image || null);

  const [step, setSteps] = useState<number>(1);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [successfullySubmitted, setSuccessfullySubmitted] = useState<boolean>(false);

  const [managedOrgs, setManagedOrgs] = useState<Organization[]>([]);
  const [organizationId, setOrganizationId] = useState<string>(initialData?.organizationId || "");

  const [requestError, setRequestError] = useState<boolean>(false);
  const [cloudinaryError, setCloudinaryError] = useState<boolean>(false)
  const [cloudinaryErrorMessage, setCloudinaryErrorMessage] = useState<string>("")

  // Loading State
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const getAllOrganizationAssigned = async () => {
      try {
        const response = await api.get("/academic/get_managed_organization");
        const orgData = response.data.organization;

        if (Array.isArray(orgData) && orgData.length > 0) {
          const formattedData: Organization[] = orgData.map((org: any) => ({
            _id: org._id,
            organizationName: org.organizationName,
          }));

          setManagedOrgs(formattedData);

          // Only auto-select if NOT in edit mode
          if (!initialData && formattedData.length > 0) {
            setOrganizationId(formattedData[0]._id);
          }
        }
      } catch (error) {
        console.log("Error fetching organizations:", error);
      }
    }

    getAllOrganizationAssigned();
  }, [initialData]);

  /* 
    Updated Validation Constants 
  */
  const MIN_CHAR = 3;
  const MAX_CHAR_TITLE = 100;
  const MAX_CHAR_CONTENT = 400;

  const handleFirstStep = () => {
    setFormSubmitted(true);

    // Validation Logic
    const isTitleValid = title.trim().length >= MIN_CHAR && title.trim().length <= MAX_CHAR_TITLE;
    const isContentValid = content.trim().length >= MIN_CHAR && content.trim().length <= MAX_CHAR_CONTENT;

    if (!isTitleValid || !isContentValid) return;

    // Org validation only needed for Create Mode
    if (!isEditMode && organizationId === "") return;

    setFormSubmitted(false);
    setSteps(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return; // Prevent double submit

    setFormSubmitted(true);

    // Validation: Must have new file OR existing URL
    if (!image && !existingImageUrl) return;

    setRequestError(false);
    setIsLoading(true);

    try {
      let finalImageUrl = existingImageUrl || "";

      // 1. Upload new image if selected
      if (image) {
        const signatureResponse = await api.get("/upload/generate_signature")
        const { timestamp, signature, folder, apiKey, cloudName } = signatureResponse.data

        const formData = new FormData()
        formData.append("file", image)
        formData.append("api_key", apiKey);
        formData.append("timestamp", timestamp.toString());
        formData.append("signature", signature);
        formData.append("folder", folder);

        const uploadResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: "POST", body: formData }
        )

        const uploadData = await uploadResponse.json()

        if (!uploadResponse.ok) {
          setCloudinaryError(true)
          setCloudinaryErrorMessage(uploadData.error.message || "Upload failed")
          setIsLoading(false);
          return;
        }
        finalImageUrl = uploadData.secure_url;
      }

      // 2. Prepare Payload
      const payload = {
        title,
        content,
        image: finalImageUrl,
        organizationId // Only used for Create
      };

      let response;
      if (isEditMode && initialData?._id) {
        // UPDATE REQUEST
        response = await api.put(`/academic/update/${initialData._id}`, payload);
      } else {
        // CREATE REQUEST
        response = await api.post('/academic/create_post', payload);
      }

      if (response.status === 201 || response.status === 200) {
        setSuccessfullySubmitted(true);
        setIsLoading(false);
        // Auto Close / Refresh
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setIsLoading(false);
      }

    } catch (error) {
      console.error(error);
      setRequestError(true);
      setIsLoading(false);
    }
  };

  const showContentError = formSubmitted && (content.trim().length < MIN_CHAR || content.trim().length > MAX_CHAR_CONTENT);
  const isEditMode = !!initialData;
  const isOrgLoading = managedOrgs.length === 0 && organizationId === "";

  return (
    <>
      <Modal cardContainerDesign="bg-white shadow-lg rounded-lg p-6 w-[500px]">
        {successfullySubmitted ? (
          <div className="text-center flex flex-col items-center justify-center p-4">
            <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {isEditMode ? "Post Updated!" : "Post Created!"}
            </h2>
            <p className="text-gray-600 mb-6">
              Your academic post has been successfully {isEditMode ? "updated" : "published"}.
            </p>
            <p className="text-xs text-gray-400">Closing automatically...</p>
            <Button type="button" buttonText="Close" onClick={onClose} />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>

            {requestError && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4 flex items-center gap-2">
                <AlertCircle size={18} />
                <span className="text-sm font-medium">Failed to process post. Please try again.</span>
              </div>
            )}

            {step === 1 && (
              <>
                <h2 className="text-2xl font-bold mb-6">
                  {isEditMode ? "Edit Academic Details" : "Academic Details"}
                </h2>

                <div className="flex flex-col gap-1 mb-4">
                  <label className="text-sm text-gray-700 font-semibold" htmlFor="org-select">
                    Post As:
                  </label>

                  <div className="relative">
                    <select
                      id="org-select"
                      value={organizationId}
                      onChange={(e) => setOrganizationId(e.target.value)}
                      className="appearance-none border border-gray-400 rounded-[5px] px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white cursor-pointer text-gray-900 disabled:bg-gray-100"
                      disabled={isEditMode || isOrgLoading || managedOrgs.length === 0}
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
                        <option disabled>Loading organizations...</option>
                      )}
                    </select>

                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                  {formSubmitted && !isEditMode && organizationId === "" && (
                    <p className="text-red-500 text-sm mt-1">Please select an organization</p>
                  )}
                </div>

                <StringTextField
                  label="Title"
                  placeholder="Enter Title"
                  value={title}
                  onChange={(e: any) => setTitle(e.target.value)}
                  errorMessage="Must be between 3 and 100 characters"
                  showError={formSubmitted && (title.trim().length < MIN_CHAR || title.trim().length > MAX_CHAR_TITLE)}
                />

                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-700" htmlFor="content-field">Content</label>
                  <div className="flex items-center gap-2">
                    <textarea
                      id="content-field"
                      name="content-field"
                      rows={5}
                      className={`border border-gray-400 rounded-[5px] px-3 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 ${showContentError ? "border-red-500 focus:ring-red-400" : ""}`}
                      placeholder="Enter Content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </div>
                  <p className={`text-sm ${showContentError ? "text-red-500" : "text-transparent"}`}>
                    Must be between 3 and 400 characters
                  </p>
                </div>

                <div className="flex flex-row gap-x-10 mt-2">
                  <Button buttonContainerDesign="bg-white border border-[#3B82F6] p-[10px] w-full text-[#3B82F6] rounded-[6px] hover:bg-blue-50 transition-colors duration-200 hover:cursor-pointer" type="button" buttonText="Close" onClick={onClose} />
                  <Button type="button" buttonText="Continue" onClick={handleFirstStep} />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-2xl font-bold mb-6">Upload Academic Image</h2>

                <div className="mb-4 text-sm text-gray-600 bg-gray-50 p-2 rounded border border-gray-200">
                  Posting to: <strong>{managedOrgs.find(o => o._id === organizationId)?.organizationName || (isEditMode ? "Current Organization" : "N/A")}</strong>
                </div>

                {/* EXISTING IMAGE PREVIEW FOR EDIT MODE */}
                {existingImageUrl && !image && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Current Image:</p>
                    <img src={existingImageUrl} alt="Current" className="h-32 w-auto object-cover rounded-md border" />
                  </div>
                )}

                <UploadPicture image={image} setImage={setImage} />

                {formSubmitted && !image && !existingImageUrl && (
                  <p className="text-red-500 text-sm mb-4 font-semibold">Please upload an image</p>
                )}

                <div className="flex flex-row gap-x-10 mt-2">
                  <Button buttonContainerDesign="bg-white border border-[#3B82F6] p-[10px] w-full text-[#3B82F6] rounded-[6px] hover:bg-blue-50 transition-colors duration-200 hover:cursor-pointer" type="button" buttonText="Back" onClick={() => setSteps(1)} />
                  <Button
                    type="submit"
                    buttonText={isLoading ? (isEditMode ? "Updating..." : "Submitting...") : (isEditMode ? "Update" : "Submit")}
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
              <h2 className="text-xl font-bold text-gray-800 mb-2">Image Upload Failed</h2>
              <p className="text-gray-600 mb-6">{cloudinaryErrorMessage}</p>
              <Button type="button" buttonText="Close" onClick={onClose} />
            </div>
          </Modal>
        )}
      </Modal>

      {/* NEW: Loading Modal Overlay */}
      {isLoading && (
        <Modal cardContainerDesign="bg-white shadow-lg rounded-lg p-8 w-[300px] flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
          <h3 className="text-lg font-semibold text-gray-800">
            {isEditMode ? "Updating..." : "Submitting..."}
          </h3>
          <p className="text-gray-500 text-sm mt-2">Please wait...</p>
        </Modal>
      )}
    </>
  )
}