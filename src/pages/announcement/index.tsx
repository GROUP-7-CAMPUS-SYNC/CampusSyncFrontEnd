import SectionHeader from "../../components/sectionHeader";
import SearchBar from "../../components/sectionSearchBar";
import CreatePost from "./formPost/index";
import Modal from "../../components/modal";
import { useEffect, useState } from "react";
import Button from "../../components/button";
import api from "../../api/api";
import AcademicContent from "./academicContent"; // Corrected import name

export default function Index() {
  const [recentSearchData, setRecentSearchData] = useState<string[]>([]);
  const [searchBarValue, setSearchBarValue] = useState<string>("");
  const [submittedQuery, setSubmittedQuery] = useState<string>(""); // ✅ Added for search submission
  const [isPostClicked, setIsPostClicked] = useState(false);
  const [isUserIsHead, setIsUserIsHead] = useState<boolean>(false);

  // 1. Fetch Recent Searches (Filtered for "academic" context)
  const getRecentSearch = async () => {
    try {
      const response = await api.get("/recentSearch/recent?context=academic");
      
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
          searchContext: "academic" // ✅ Specific context
        };
        await api.post("/recentSearch/log", payload);
        getRecentSearch(); // Refresh list immediately
      } catch (error) {
        console.error("Failed to log search", error);
      }
    }
  };

  const validateUserIsAdmin = async () => {
    try {
      const response = await api.get("/academic/get_managed_organization");

      if (response.data.isHead) {
        setIsUserIsHead(true);
        setIsPostClicked(true);
      } else {
        setIsUserIsHead(false);
        setIsPostClicked(true);
      }
    } catch (error) {
      console.log(error);
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
            placeholder="Search Academic"
            recentSearch={recentSearchData}
          />
        }
        postButtonClick={() => validateUserIsAdmin()}
      />

      {isPostClicked && (isUserIsHead ? (
        // User is head, show the form
        <CreatePost onClose={() => window.location.reload()} />
      ) : (
        // User is not head, show denial
        <Modal cardContainerDesign="bg-white shadow-lg rounded-lg p-6 w-96 text-center">
          <h1 className="text-xl font-bold mb-3 text-red-700">Access Denied</h1>
          <p className="mb-4 text-gray-700">You must be the head of an organization to post academic content.</p>
          <Button
            type="button"
            buttonText="Close"
            onClick={() => setIsPostClicked(false)}
          />
        </Modal>
      ))}

      {/* ✅ Pass the submitted query to content */}
      <AcademicContent searchQuery={submittedQuery} />
    </div>
  );
}