/**
 * @Defines the contract for the SideBar component, which operates as a
 * controlled component. Navigation state is "lifted" to and managed by
 * the parent layout.
 *
 * @param currentPage The string identifier for the currently active page,
 * used by the Sidebar to apply active styling.
 *
 * @param setCurrentPage A state-setting callback function, passed from
 * the parent, to be invoked when a user clicks a
 * navigation item.
*/


export interface SideBarProps{
    currentPage: string;
    setCurrentPage: (page: string) => void;
}