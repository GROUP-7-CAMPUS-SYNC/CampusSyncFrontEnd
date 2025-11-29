import type { SectionHeaderProps } from "../types/sectionHeader";

export default function sectionHeader2({
  headerBarContainerDesign = "flex justify-center sm:p-6 py-6 px-2 bg-[#fafafa]",
  headerDesign = "flex flex-row gap-4 rounded-lg sm:px-5 px-3 sm:py-5 py-3 sm:border border-gray-300 w-full max-w-4xl",
  profileLink,
  profileButtonDesign = "flex justify-center items-center bg-gray-600 rounded-full sm:w-14 sm:h-14 w-12 h-12 cursor-pointer overflow-hidden flex-shrink-0",
  searchBar,
  searchBarDesign = "flex flex-row justify-start items-center p-3 border border-gray-300 rounded-4xl w-full text-gray-500 hover:bg-gray-100 relative",
  postButtonDesign = "flex justify-center items-center text-white sm:text-lg font-medium bg-[#3B82F6] sm:px-14 px-5 shadow-md rounded-xl cursor-pointer flex-shrink-0",
  postButtonClick,
}: SectionHeaderProps) {
  return (
    <div className={headerBarContainerDesign}>
      <div className={headerDesign}>
        {/* PROFILE BTN */}
        <button className={profileButtonDesign}>
          <img
            src={profileLink}
            alt="profile"
            className="w-full h-full object-cover rounded-full"
          />
        </button>

        {/* SEARCH BAR WRAPPER */}
        <div className={searchBarDesign}>{searchBar}</div>

        {/* POST BUTTON */}
        <button className={postButtonDesign} onClick={postButtonClick}>
          Post
        </button>
      </div>
    </div>
  );
}
