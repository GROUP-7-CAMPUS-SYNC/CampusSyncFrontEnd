import Modal from "../../../components/modal";
import Button from "../../../components/button";
import StringTextField from "../../../components/stringTextField";
import UploadPicture from "../../../components/uploadPicture";
import { useEffect, useState } from "react";
import api from "../../../api/api";


interface Organization {
  _id: string;
  organizationName: string;
}


interface CreatePostProps {
  onClose: () => void;
}


export default function Index({
  onClose,
}: CreatePostProps) {


  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [step, setSteps] = useState<number>(1);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [successfullySubmitted, setSuccessfullySubmitted] = useState<boolean>(false);
 
  const [managedOrgs, setManagedOrgs] = useState<Organization[]>([]);
  const [organizationId, setOrganizationId] = useState<string>("");


  useEffect(() => {
      const getAllOrganizationAssigned = async () => {
        try
        {
          const response = await api.get("/academic/get_managed_organization");
         
          // FIX 1: Access response.data.organization directly (which is the array)
          // Do not look for .organizationName on the array itself
          const orgData = response.data.organization;


          if (Array.isArray(orgData)) {
            const formattedData: Organization[] = orgData.map((org: any) => ({
                _id: org._id,
                organizationName: org.organizationName,
            }));
           
            setManagedOrgs(formattedData);
           
            // Auto-select the first organization
            if (formattedData.length > 0) {
                setOrganizationId(formattedData[0]._id);
            }
          }
        }
        catch(error)
        {
          console.log("Error fetching organizations:", error);
        }
      }


      getAllOrganizationAssigned();


  }, []);




  const handleFirstStep = () => {
    setFormSubmitted(true);
    // FIX 2: Check if organizationId is selected
    if(title.trim() == "" || content.trim() == "" || organizationId == "") return;
    setFormSubmitted(false);
    setSteps(2);
  };




  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    if(!image) return;


    // TODO: Perform your API call here using 'organizationId'
    // Example: await api.post('/academic/create', { title, content, organizationId, ... })


    try
    {
      const payload = {
            title,
            content,
            image: "https://res.cloudinary.com/dzbzkil3e/image/upload/v1762858878/Rectangle_4_zgkeds.png",
            organizationId
        };
      await api.post('/academic/create_post', payload)
      setSuccessfullySubmitted(true);
    }
    catch(error)
    {
      console.error("Failed to create post:", error);
    }    
  };
 
  const showContentError = formSubmitted && content.trim() === "";


  return (
    <Modal
      cardContainerDesign="bg-white shadow-lg rounded-lg p-6 w-[500px]"
    >
      {!successfullySubmitted ? (
        <form onSubmit={handleSubmit}>


          {step == 1 && (
            <>
              <h2 className="text-2xl font-bold mb-6">Academic Details</h2>


              {/* === ORGANIZATION DROPDOWN === */}
              <div className="flex flex-col gap-1 mb-4">
                <label className="text-sm text-gray-700 font-semibold" htmlFor="org-select">
                  Post As:
                </label>


                <div className="relative">
                  <select
                    id="org-select"
                    value={organizationId}
                    onChange={(e) => setOrganizationId(e.target.value)}
                    className="
                      appearance-none
                      border border-gray-400 rounded-[5px] px-3 py-2 w-full
                      focus:outline-none focus:ring-2 focus:ring-blue-400
                      bg-white cursor-pointer
                      text-gray-900
                    "
                  >
                      {/* FIX 3: Map directly over managedOrgs state */}
                      {managedOrgs.length > 0 ? (
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
              {/* === END DROPDOWN === */}


              <StringTextField
                label="Title"
                placeholder="Enter Title"
                value={title}
                onChange={(e: any) => setTitle(e.target.value)}
                errorMessage="Title minimum of 3 characters"
                showError={formSubmitted && title.trim() === ""}
              />


              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-700" htmlFor="content-field">
                  Content
                </label>
               
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
               
                <p className={`text-sm ${showContentError ? "text-red-500" : "text-white"}`}>
                  Please fill the text field
                </p>
              </div>


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
              <h2 className="text-2xl font-bold mb-6">Upload Academic Image</h2>


              <div className="mb-4 text-sm text-gray-600 bg-gray-50 p-2 rounded border border-gray-200">
                  Posting to: <strong>{managedOrgs.find(o => o._id === organizationId)?.organizationName}</strong>
              </div>


              <UploadPicture
                image={image}
                setImage={setImage}
              />


              {formSubmitted && !image && (
                <p className="text-red-500 text-sm mb-4 font-semibold">Please upload an image</p>
              )}


              <div className="flex flex-row gap-x-10 mt-2">
                <Button
                  buttonContainerDesign="bg-white border border-[#3B82F6] p-[10px] w-full text-[#3B82F6] rounded-[6px] hover:bg-blue-50 transition-colors duration-200 hover:cursor-pointer"
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
      ) : (
        <Modal>
          <div className="text-center">
            <p className="mb-4 font-semibold text-green-600">Successfully Submitted</p>
            <Button
              type="button"
              buttonText="Close"
              onClick={onClose}
            />
          </div>
        </Modal>
      )}
    </Modal>
  )
}

