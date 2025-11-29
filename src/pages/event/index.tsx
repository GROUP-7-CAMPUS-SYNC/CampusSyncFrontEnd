import SectionHeader from "../../components/sectionHeader";
import SearchBar from "../../components/sectionSearchBar";
import { useState } from "react";
import CreatePost from "./formPost/index";
import EventContent from "./eventContent";

export default function index() {
  const recentSearchData: string[] = [
    "CITC Days",
    "ROTC Event",
    "Week of Welcome",
    "MASTS",
  ];
  const [searchBarValue, setSearchBarValue] = useState<string>("");
  const [isPostClicked, setIsPostClicked] = useState(false);

  return (
    <div className="bg-[#fafafa] ">
      <SectionHeader
        profileLink="https://res.cloudinary.com/dzbzkil3e/image/upload/v1762858878/Rectangle_4_zgkeds.png"
        searchBar={
          <SearchBar
            value={searchBarValue}
            onChange={(e) => setSearchBarValue(e.target.value)}
            placeholder="Search"
            recentSearch={recentSearchData}
          />
        }
        postButtonClick={() => setIsPostClicked(true)}
      />
      <div className="flex flex-col items-center">
        <EventContent />
      </div>
      {isPostClicked && <CreatePost onClose={() => setIsPostClicked(false)} />}
    </div>
  );
}
