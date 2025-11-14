import SectionHeader from "../../components/sectionHeader2"
import SearchBar from "../../components/sectionSearchBar"
import CreatePost from "./formPost/index"
import { useState } from "react";

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
        
        postButtonClick={() => setIsPostClicked(true)}
      />

      {isPostClicked && (
        <CreatePost onClose={() => setIsPostClicked(false)} />
      )}
    </div>
  )
}
