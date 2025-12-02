import type { ChangeEvent, FocusEvent } from "react"

/**
 * Defines the properties for the SearchBar component.
 *
 * @interface SearchBarProps
 * @property {string} [searchBarContainerDesign] - Custom styling for the search bar's outer container.
 * @property {string} [searchBarLogo] - The file path or URL for the icon inside the search bar.
 * @property {string} [searchBarLogoDesign] - CSS classes to apply to the search bar icon/logo.
 * @property {string} value - Current value of the search input (controlled component).
 * @property {(e: ChangeEvent<HTMLInputElement>) => void} onChange - Function to call when the value changes.
 * @property {string} [searchBarDesign] - Allows overriding the default search bar styles.
 * @property {string} placeholder - Placeholder text (e.g., "Search post, event, or item").
 * @property {boolean} [disable] - If true, disables the input.
 * @property {(e: FocusEvent<HTMLInputElement>) => void} [onFocus] - Triggered when the search bar gains focus.
 * @property {(e: FocusEvent<HTMLInputElement>) => void} [onBlur] - Triggered when the search bar loses focus.
 * @property {string} [searchResultHeight] - Custom height for the search result dropdown.
 * @property {string[]} recentSearch - An array of strings to display as recent searches.
 */

export interface SearchBarProps {
  searchBarContainerDesign?: string
  searchBarLogo?: string
  searchBarLogoDesign?: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  onSearch?: (searchTerm: string) => void
  searchBarDesign?: string
  placeholder: string
  disable?: boolean
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void
  searchResultHeight?: string
  recentSearch: string[]
}