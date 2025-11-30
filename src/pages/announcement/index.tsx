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
        setIsPostClicked(false)
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
        profileLink="https://res.cloudinary.com/dzbzkil3e/image/upload/v1762858878/Rectangle_4_zgkeds.png"
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
        isPostClicked === true && (isUserIsHead ?
        <CreatePost
          onClose={() => setIsPostClicked(false)}
        />
        :
        <Modal>
          <h1>No Organizaton Under you named </h1>
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



