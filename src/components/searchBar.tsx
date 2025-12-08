import { useState } from "react";
import type { SearchBarProps } from "../types/searchBar";
import { Search } from "lucide-react";

interface ExtendedSearchBarProps extends SearchBarProps {
  onSearch?: (term: string) => void;
}

export default function SearchBar({
  searchBarContainerDesign = "relative bg-[#EEEEEE] flex items-center gap-3 p-3 h-[6vh] w-[40vw] md:[30vw] lg:w-[20vw] rounded-full ",
  value,
  onChange,
  onSearch,
  searchBarDesign = "bg-transparent focus:outline-none w-full placeholder:text-gray-600 ",
  placeholder,
  disable,
  searchResultHeight = "max-h-60",
  recentSearch = [], // Default to empty array
}: ExtendedSearchBarProps) {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  // ❌ REMOVED: const [recentSearches] = useState<string[]>(recentSearch);
  // Reason: useState only runs once. We need to filter the 'recentSearch' prop directly
  // so that when the API loads, this list updates automatically.

  const handleRecentSearchClick = (term: string) => {
    const syntheticEvent = {
      target: { value: term },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
    setIsFocused(false);

    if (onSearch) onSearch(term);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(value);
      setIsFocused(false);
    }
  };

  // ✅ FIX: Filter the 'recentSearch' PROP directly
  const filteredSearches = recentSearch.filter((s) =>
    s.toLowerCase().includes(value ? value.toLowerCase() : "")
  );

  return (
    <div className={searchBarContainerDesign}>
      <Search className="h-5 w-5 text-gray-500 shrink-0" />
      <input
        className={searchBarDesign}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disable}
        type="text"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
      />

      {/* --- Recent Searches Dropdown --- */}
      {isFocused && filteredSearches.length > 0 && !disable && (
        <div
          className={`absolute top-full mt-1 overflow-y-auto left-0 w-full bg-white shadow-lg rounded-b-[5px]  border-gray-200 z-50 no-scrollbar ${searchResultHeight}`}
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
