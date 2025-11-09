/**
 * Sets a "login flag" in the browser's localStorage to indicate that
 * the user has successfully logged in.
 * 
 * 🧠 Explanation:
 * - `localStorage` is a built-in browser storage that keeps small pieces
 *   of data (key–value pairs) even after the page is refreshed or closed.
 * - The method `localStorage.setItem("isLoggedIn", "true")` saves a simple
 *   text value under the key name `"isLoggedIn"`.
 * - This stored value can later be checked anywhere in the app
 *   (for example, in a ProtectedRoute component) to verify whether
 *   the user is logged in or not.
 * 
 * 🪄 Example:
 * ```js
 * setLoginFlag()
 * // After calling this, you can open DevTools → Application → Local Storage
 * // and see: isLoggedIn = "true"
 * ```
 * 
 * Use Case:
 * - Typically called after a successful login or signup process.
 */
export const setLoginFlag = () => {
  localStorage.setItem("isLoggedIn", "true")
}
