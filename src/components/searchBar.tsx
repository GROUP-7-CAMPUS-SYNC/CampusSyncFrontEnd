import type { SearchBarProps } from "../types/searchBar"
import SearchBarLogo from "../assets/search-bar-logo.svg"

export default function searchBar({
    searchBarContainerDesign = "flex items-center gap-2 bg-white p-4 h-[6vh] rounded-[5px] w-[30vw]",
    searchBarLogo = SearchBarLogo,
    searchBarLogoDesign = "h-[3.5vh]",
    value,
    onChange,
    searchBarDesign = "bg-white h-[6vh] rounded-[5px] focus:outline-none py-1 w-full",
    placeholder,
    disable
}: SearchBarProps) {
  return (
    <div
        className={searchBarContainerDesign}
    >
        <img src={searchBarLogo}  className={searchBarLogoDesign} alt="Search Bar Logo" />
        <input
            className={searchBarDesign}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disable} 
            type="text" 
        />
    </div>
  )
}
