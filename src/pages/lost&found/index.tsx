import SectionHeader from "../../components/sectionHeader";
import SearchBar from "../../components/sectionSearchBar";
import CreatePost from "./formPost/index";
import { useEffect, useState } from "react";
import LostAndFoundContent from "./lostandFoundContent";
import api from "../../api/api";

export default function Index() {
  const [recentSearchData, setRecentSearchData] = useState<string[]>([]);
  const [searchBarValue, setSearchBarValue] = useState<string>("");
  const [submittedQuery, setSubmittedQuery] = useState<string>("");
  const [isPostClicked, setIsPostClicked] = useState(false);

  // 1. Fetch Recent Searches (Filtered for "lostfound" context)
  const getRecentSearch = async () => {
    try {
      const response = await api.get("/recentSearch/recent?context=lostfound");
      
      const searchStrings = response.data
        .map((item: any) => item.queryText)
        .filter((text: string) => text);

      const uniqueSearches = [...new Set(searchStrings)] as string[];
      setRecentSearchData(uniqueSearches);
    } catch (error) {
      console.error("Failed to fetch recent searches:", error);
    }
  };

  useEffect(() => {
    getRecentSearch();
  }, []);

  // 2. Handle Search Submission (Enter key)
  const handleSearchSubmit = async (term: string) => {
    setSubmittedQuery(term);

    if (term.trim() !== "") {
      try {
        const payload = {
          queryText: term,
          searchContext: "lostfound" // ✅ Specific context for this section
        };
        await api.post("/recentSearch/log", payload);
        getRecentSearch(); // Refresh list immediately
      } catch (error) {
        console.error("Failed to log search", error);
      }
    }
  };

  return (
    <div>
      <SectionHeader
        profileLink={`${localStorage.getItem("profileLink")}`}
        searchBar={
          <SearchBar
            value={searchBarValue}
            onChange={(e) => setSearchBarValue(e.target.value)}
            onSearch={handleSearchSubmit} // ✅ Connect submit handler
            placeholder="Search Lost & Found"
            recentSearch={recentSearchData}
          />
        }
        postButtonClick={() => setIsPostClicked(true)}
      />

      {isPostClicked && (
        <CreatePost onClose={() => window.location.reload()} />
      )}

      {/* ✅ Pass the submitted query to content */}
      <LostAndFoundContent searchQuery={submittedQuery} />
    </div>
  );
}