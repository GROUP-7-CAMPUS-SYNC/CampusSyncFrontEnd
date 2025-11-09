import { useEffect, useState } from "react";

/**
 *  Custom hook to detect if the screen width is below a certain breakpoint
 * @param maxWidth - The pixel width to check (default: 640)
 * @return {boolean} True if screen width is less than or equal to maxWidth
 */

export function useScreenSize(maxWidth: number = 640) {
    
    /**
     * @State : isSmallScreen
     * 
     * This state keeps track of weather the current screen width
     * is smaller that (or equal to) to given maxWidth
     * 
     * It initializes by checking the current `window.innerWidth` value.
     * `window.innerWidth` means getting the current total width of 
     * the screen of website.
     * 
     * `typeof window !== "undefined"` -  checking if the code is running 
     * in a browser (where window exists) before trying to use it(using this function).
     * 
     * `window` - refers to the browser window object (only available in browsers).
     * `innerWidth` - gives the current width (in pixels) of the visible area of 
     * the browser window.
     * 
     * `window.innerWidth` - Current browser window width in pixels
     * 
     * `window.innerWidth <= maxWidth`
     *- This condition checks whether the current browser window width
     *   (in pixels) is less than or equal to the given `maxWidth` value.
     * - If true → it means the screen is 'small' (e.g., mobile view).
     * - If false → it means the screen is 'larger' (e.g., tablet or desktop view).
     * 
     * Example:
     *   - window.innerWidth = 500, maxWidth = 640 → ✅ true (small screen)
     *   - window.innerWidth = 1024, maxWidth = 640 → ❌ false (large screen)
    */
    const [isSmallScreen, setSmallScreen] = useState(
        typeof window !== undefined && window.innerWidth <= maxWidth
    )

    /**
     * @Effect : useEffect (screen resize listener)
     * 
     * This effect makes sure that the `isSmallScreen` state
     * automatically updates whenever the browser window is resized.
     * 
     * Explanation:
     * 
     * - `useEffect(() => { ... }, [maxWidth])`
     *   → Runs this effect whenever `maxWidth` changes or when the component first loads.
     * 
     * Inside the effect:
     * 
     * 1. `const handleResize = () => setSmallScreen(window.innerWidth <= maxWidth)`
     *    - Creates a function called `handleResize` that checks the current
     *      window width (`window.innerWidth`) every time the browser is resized.
     *    - If the width is smaller than or equal to `maxWidth`, it sets 
     *      `isSmallScreen` to `true`. Otherwise, it sets it to `false`.
     * 
     * 2. `window.addEventListener("resize", handleResize)`
     *    - Attaches an event listener to the browser window.
     *    - The event listener triggers `handleResize` every time the user
     *      resizes the window.
     * 
     * 3. `return () => window.removeEventListener("resize", handleResize)`
     *    - This is a **cleanup function** that runs when the component unmounts
     *      (or before running the effect again).
     *    - It removes the event listener to prevent memory leaks or multiple
     *      duplicate listeners from being attached.
     * 
     * Summary:
     * - Keeps the `isSmallScreen` value always in sync with the current screen size.
     * - Ensures performance and avoids memory leaks by cleaning up the listener.
     * 
     * Example:
     *   - When you shrink the window below 640px → `isSmallScreen = true`
     *   - When you expand above 640px → `isSmallScreen = false`
    */
    useEffect(() => {
        const handleResize = () => setSmallScreen(window.innerWidth <= maxWidth)
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [maxWidth])

    return isSmallScreen
}