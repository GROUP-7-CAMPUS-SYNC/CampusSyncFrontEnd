import SectionHeader from "../../components/sectionHeader"
import SearchBar from "../../components/sectionSearchBar"
import CreatePost from "./formPost/index"
import Modal from "../../components/modal";
import { useState } from "react";
import Button from "../../components/button";
import api from "../../api/api"
import EventContent from "./eventContent" // New component to display posts
import { Loader2 } from "lucide-react";

export default function Index() {

  const recentSearchData: string[] = [
    "CITC Days",
    "ROTC Event",
    "Week of Welcome",
    "MASTS",
  ];
  const [searchBarValue, setSearchBarValue] = useState<string>("");
  const [isPostClicked, setIsPostClicked] = useState(false);
  const [isUserIsHead, setIsUserIsHead] = useState<boolean>(false);
  const [isValidationLoading, setIsValidationLoading] = useState<boolean>(false);
 
  // State to hold the organization name for the error modal
  const [managedOrgName, setManagedOrgName] = useState<string | null>(null);

  const validateUserIsAdmin = async () => {

    setIsValidationLoading(true);
  
    try
    {
      // Target the correct event endpoint for managed organizations
      const response = await api.get("/events/get_managed_organization");


      if(response.data.isHead)
      {
        setIsUserIsHead(true);
        setIsPostClicked(true);
        // Store organization name if successful (optional, but good for context)
        setManagedOrgName(response.data.organization[0]?.organizationName || "Your Organization");
        console.log(managedOrgName)
      }
      else
      {
        setIsUserIsHead(false);
        setIsPostClicked(true); // Open modal to show "No organization"
        setManagedOrgName(null);
      }
    }
    catch(error)
    {
      console.error("Error validating admin status:", error);
      setIsUserIsHead(false);
      setIsPostClicked(true); // Open modal on API failure too
      setManagedOrgName(null);
    }
    finally {
      setIsValidationLoading(false);
    }
  }
 
  return (
    <div>
      <SectionHeader
        profileLink={`${localStorage.getItem("profileLink")}`}
        searchBar={
          <SearchBar
            value={searchBarValue}
            onChange={(e) => setSearchBarValue(e.target.value)}
            placeholder="Search Events"
            recentSearch={recentSearchData}
          />
        }
        // Triggers the validation check
        postButtonClick={validateUserIsAdmin}
      />


      {isValidationLoading && (
        <Modal cardContainerDesign="bg-white shadow-lg rounded-lg p-6 w-96 flex flex-col items-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600 font-semibold">Checking access...</p>
        </Modal>
      )}


      {
        isPostClicked && !isValidationLoading && (isUserIsHead ?
        // User is head, show the event creation form
        <CreatePost
          onClose={() => setIsPostClicked(false)}
        />
        :
        // User is not head, show the access denial modal
        <Modal cardContainerDesign="bg-white shadow-lg rounded-lg p-6 w-96 text-center">
          <h1 className="text-xl font-bold mb-3 text-red-700">Access Denied</h1>
          <p className="mb-4 text-gray-700">You must be the head of an organization to post an event.</p>
          <Button
            type="button"
            buttonText="Close"
            onClick={() => setIsPostClicked(false)}
          />
        </Modal>
      )}

      {/* Display the list of events */}
            <div className="flex flex-col items-center">
        <EventContent />
      </div>
    </div>
  )
}

