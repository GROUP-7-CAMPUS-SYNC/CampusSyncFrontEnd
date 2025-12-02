import { useState } from "react";
import type { SearchBarProps } from "../types/searchBar";
import { Search } from "lucide-react";

export default function SearchBar({
  searchBarContainerDesign = "relative  flex items-center gap-3 w-full",
  value,
  onChange,
  onSearch,
  searchBarDesign = "bg-transparent focus:outline-none w-full placeholder:text-gray-600",
  placeholder,
  disable,
  searchResultHeight = "max-h-60",
  recentSearch,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState<boolean>(false);


  // Handle "Enter" key press (works on the Mobile "Go" button too)
  const handleKeyDown = (e : React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === "Enter" && onSearch) {
      onSearch(value)
      setIsFocused(false)

      // Optional: Remove focus from input to hide mobile keyboard
      e.currentTarget.blur()
    }
  }

  const handleRecentSearchClick = (term: string) => {
    const syntheticEvent = {
      target: { value: term },
    } as React.ChangeEvent<HTMLInputElement>;

    onChange(syntheticEvent);

    // Trigger search immediately if clicked
    if(onSearch){
      onSearch(term)
    }
    setIsFocused(false);
  };

  const filteredSearches = recentSearch.filter((s) =>
    s.toLowerCase().includes(value ? value.toLowerCase() : "")
  );

  return (
    <div
      className={`${searchBarContainerDesign} ${
        isFocused ? "rounded-t-[5px]" : "rounded-[5px]"
      }`}
    >
      <Search className=" text-gray-500 shrink-0" />
      <input
        className={searchBarDesign}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
        disabled={disable}
        type="text"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
      />

      {/* --- Recent Searches Dropdown --- */}
      {isFocused && filteredSearches.length > 0 && !disable && (
        // MODIFIED: Replaced rounded-b-md with rounded-b-[5px] for pixel alignment
        <div
          className={`absolute top-full overflow-y-auto left-0 mt-3.5 w-full bg-white shadow-lg rounded-b-[5px] border border-gray-200 z-20 no-scrollbar ${searchResultHeight}`}
        >
          <ul className="py-1">
            <li className="px-4 py-2 text-xs text-gray-500 font-semibold sticky top-0 mb-1 bg-white">
              Recent Searches
            </li>
            {filteredSearches.map((term, index) => (
              <li
                key={`${term}-${index}`}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-800"
                onMouseDown={() => handleRecentSearchClick(term)}
              >
                <Search className="h-4 w-4 text-gray-400 shrink-0" />
                <span>{term}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
