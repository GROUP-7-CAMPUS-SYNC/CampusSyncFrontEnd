import type { SectionHeaderProps } from "../types/sectionHeader"

export default function SectionHeader({
  headerBarContainerDesign = "flex mt-5 flex-row rounded-2xl items-center gap-2 md:gap-4 w-full max-w-[600px] bg-white border-b border-gray-200 px-3 md:px-6 py-3 md:py-4 shadow-sm min-w-[250px] mx-4",
  profileLink,
  profileDesign = "w-[40px] h-[40px] md:w-[48px] md:h-[48px] rounded-full",
  searchBar,
  searchBarDesign = "flex-1 min-w-0 w-full md:w-auto",
  postButton,
  postButtonDesign
} : SectionHeaderProps) {
  return (
    <div className={headerBarContainerDesign}>
      {/* Profile Avatar */}
      <img
        src={profileLink}
        className={profileDesign}
        alt="Profile"
      />

      {/* Search Bar - Takes up remaining space */}
      <div className={searchBarDesign}>
        {searchBar}
      </div>

      {/* Post Button */}
      <div className={postButtonDesign}>
        {postButton}
      </div>
    </div>
  )
}