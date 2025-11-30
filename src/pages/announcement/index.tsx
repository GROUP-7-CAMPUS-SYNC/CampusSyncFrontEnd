import SectionHeader from "../../components/sectionHeader"
import SearchBar from "../../components/sectionSearchBar"
import CreatePost from "./formPost/index"
import Modal from "../../components/modal";
import { useState } from "react";
import Button from "../../components/button";
import api from "../../api/api"
import AcademicContext from "./academicContent"


export default function index() {


  const recentSearchesData: string[] = [
    "Campus Clean-Up Drive this Saturday",
    "USTP Green Advocates",
    "Green Advocates",
    "USTP Green Advocates",
    "Campus Clean-Up Drive this Saturday",
    "Campus Clean-Up Drive this Saturday",
  ];
  const [searchBarValue, setSearchBarValue] = useState<string>("");
  const [isPostClicked, setIsPostClicked] = useState(false);
  const [isUserIsHead, setIsUserIsHead] = useState<boolean>(false);




  const validateUserIsAdmin = async () => {


    try
    {
      const respose = await api.get("/academic/get_managed_organization")


      if(respose.data.isHead)
      {
        setIsUserIsHead(true)
        setIsPostClicked(true)
      }
      else
      {
        setIsUserIsHead(false)
        setIsPostClicked(true)
      }
    }
    catch(error)
    {
      console.log(error)
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
            placeholder="Search"
            recentSearch={recentSearchesData}
          />
        }
       
        postButtonClick={() => validateUserIsAdmin()}
      />


      {
        isPostClicked && (isUserIsHead ?
        // User is head, show the event creation form
        <CreatePost
          onClose={() => setIsPostClicked(false)}
        />
        :
        // User is not head, show the access denial modal
        <Modal cardContainerDesign="bg-white shadow-lg rounded-lg p-6 w-96 text-center">
          <h1 className="text-xl font-bold mb-3 text-red-700">Access Denied</h1>
          <p className="mb-4 text-gray-700">You must be the head of an organization to post academic post</p>
          <Button
            type="button"
            buttonText="Close"
            onClick={() => setIsPostClicked(false)}
          />
        </Modal>
      )}


      <AcademicContext/>
    </div>
  )
}



