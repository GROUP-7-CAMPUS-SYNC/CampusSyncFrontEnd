/**
 * Clears the "login flag" from the browser's localStorage to indicate that
 * the user has logged out or their session has ended.
 * 
 * 🧠 Explanation:
 * - `localStorage.removeItem("isLoggedIn")` deletes the stored login flag.
 * - This ensures the app no longer recognizes the user as logged in.
 * - Commonly used during a logout process or when resetting authentication state.
 * 
 * 🪄 Example:
 * ```js
 * clearLogInFlag()
 * // After calling this, open DevTools → Application → Local Storage
 * // and you'll see that "isLoggedIn" is no longer present.
 * ```
 * 
 * Use Case:
 * - Typically called when a user logs out or when you want to reset
 *   all authentication-related data.
 */
export const clearLogInFlag = () => {
  localStorage.removeItem("isLoggedIn")
}
