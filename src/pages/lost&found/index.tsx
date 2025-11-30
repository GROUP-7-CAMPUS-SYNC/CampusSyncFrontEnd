import SectionHeader from "../../components/sectionHeader"
import SearchBar from "../../components/sectionSearchBar"
import CreatePost from "./formPost/index"
import { useState } from "react";
import LostAndFountContent from "./lostandFoundContent";


export default function index() {


  const recentSearchesData: string[] = [
    "Student ID",
    "Laptop Acer",
    "Blue Waller",
    "Samsung Phone",
    "Blue Towel",
    "Yellow Handkerchief",
    "Black Eyeglasses"
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


      <LostAndFountContent/>
    </div>
  )
}
