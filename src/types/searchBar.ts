import type { ChangeEvent, FocusEvent } from "react"

export interface SearchBarProps {
  /**
   * Custom styling for the search bar's outer container.
   */
  searchBarContainerDesign?: string

  /**
   * The file path or URL for the icon inside the search bar (e.g., a magnifying glass).
   */
  searchBarLogo?: string

  /**
   * CSS classes to apply to the search bar icon/logo.
   */
  searchBarLogoDesign?: string

  /**
   * Current value of the search input (controlled component).
   */
  value: string

  /**
   * Function to call when the value changes.
   */
  onChange: (e: ChangeEvent<HTMLInputElement>) => void

  /**
   * Allows overriding the default search bar styles for a specific component.
   */
  searchBarDesign?: string

  /**
   * Placeholder text (e.g., "Search post, event, or item").
   */
  placeholder: string

  /**
   * If true, disables the input.
   */
  disable?: boolean

  /**
   * Triggered when the search bar gains focus (for showing dropdowns, etc.)
   */
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void

  /**
   * Triggered when the search bar loses focus.
   */
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void
}
