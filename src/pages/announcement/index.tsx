import SectionHeader from "../../components/sectionHeader"
import SearchBar from "../../components/searchBar"
import Button from "../../components/button"
import { useState } from "react"


export default function index() {
  const [searchBarValue, setSearchBarValue] = useState<string>("")

  const recentSearchesData: string[] = [
    "Campus Clean-Up Drive this Saturday",
    "USTP Green Advocates",
    "Green Advocates",
    "USTP Green Advocates",
    "Campus Clean-Up Drive this Saturday",
    "Campus Clean-Up Drive this Saturday",
  ];
  return (
    <div
      className="flex justify-center items-center"
    >
      <SectionHeader
        profileLink="https://res.cloudinary.com/dzbzkil3e/image/upload/v1762858878/Rectangle_4_zgkeds.png"

        searchBar={
          <SearchBar
            searchBarContainerDesign="relative bg-[#EEEEEE] flex items-center gap-3 p-3 h-[5vh]  w-full"
            value={searchBarValue}
            onChange={(e) => setSearchBarValue(e.target.value)}
            placeholder="Search annoucements"
            recentSearch={recentSearchesData}
          />
        }

        postButton={
          <Button
            buttonContainerDesign="bg-[#3B82F6] px-[10px] py-[5px] w-full text-white rounded-[6px] hover:bg-[#2563EB] transition-colors duration-200 hover:cursor-pointer"
            type="submit"
            buttonText="Post" 
          />
      }
      />
    </div>
  )
}
