import type { ReactNode } from "react";

/**
 * Defines the properties for the SectionHeader component.
 *
 * @interface SectionHeaderProps
 * @property {string} [headerBarContainerDesign] - Custom styling for the main container div.
 * @property {string} [headerDesign] - Custom styling for the header (e.g., "Home", "Events").
 * @property {string} [profileButtonDesign] - Custom styling for the profile button/link.
 * @property {string} profileLink - The URL or path for the profile link.
 * @property {string} [searchBarDesign] - Custom styling for the wrapper around the search bar node.
 * @property {ReactNode} searchBar - The SearchBar component node to be rendered.
 * @property {string} [postButtonDesign] - Custom styling for the "Post" button.
 * @property {() => void} postButtonClick - Function to call when the "Post" button is clicked.
 */
export interface SectionHeaderProps {
    headerBarContainerDesign?: string;
    headerDesign?: string;
    profileButtonDesign?: string;
    profileLink: string;
    searchBarDesign?: string;
    searchBar: ReactNode;
    postButtonDesign?: string;
    postButtonClick: () => void;
}