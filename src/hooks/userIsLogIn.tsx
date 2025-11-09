import { Navigate } from "react-router-dom"
import type { ReactElement } from "react"

/**
 * ProtectedRoute Component
 * 
 * This component acts as a guard for routes that require authentication.
 * It ensures that only logged-in users can access specific pages (e.g., dashboard, profile, etc.).
 * 
 * @param {object} props - The input properties passed to this component.
 * @param {ReactElement} props.element -
 * A valid React component (for example, <Dashboard /> or <Profile />) 
 * that should only appear when the user is already logged in.
 * 
 * This element represents a **"protected page"** in your app.
 * 
 * 🧩 What is a "Protected Page"?
 * 
 * Imagine your app is like a big school building.
 * - The **landing page** is like the front gate — everyone can see it.
 * - The **protected pages** (like Dashboard or Profile) are like classrooms — 
 *   only students with an ID (logged-in users) can go inside.
 * 
 * So, this component acts like a **security guard** 👮‍♂️.
 * It checks if the user has their "ID" (which is the `isLoggedIn` key stored in localStorage).
 * - If the ID is found (meaning the user is logged in) → ✅ they can enter the protected page.
 * - If not → 🚫 they are sent back to the landing page (login area).
 * 
 * localStorage - A built-in browser storage that keeps simple data 
 * (like small notes or flags) inside your browser, even when you refresh the page.
 * In this case, we use it to remember if the user is logged in 
 * by storing something like this:
 *   localStorage.setItem("isLoggedIn", "true")
 * 
 * @returns {ReactElement} - 
 * If logged in → shows the protected page (e.g., Dashboard).  
 * If not logged in → redirects back to the landing page.
 *  
 * -----------------------------------------------------------------------------------
 * @Core_Logic
 * 1. Retrieve login status from browser storage:
 *    - `localStorage.getItem("isLoggedIn")` fetches the user’s login state.
 *    - It checks if the stored value equals `"true"`.
 *    - This value is typically set during login or signup.
 * 
 * 2. Conditional Rendering:
 *    - If `isLoggedIn` is `true` → The user is authorized, so we render the requested `element`.
 *    - If `isLoggedIn` is `false` → The user is not authorized, so we redirect them using `<Navigate />`.
 * 
 * 3. Redirect Mechanism:
 *    - `<Navigate to="/" replace />` is a React Router DOM component that automatically redirects users
 *      to a specific route—in this case, the **landing page (`/`)**.
 *    - `replace` ensures the redirected page doesn’t get stored in the browser’s history,
 *      preventing the user from navigating “back” to the restricted page.
 * 
 * -----------------------------------------------------------------------------------
 * @Example_Usage
 * ```tsx
 * import { ProtectedRoute } from "../hooks/userIsLogIn"
 * import Dashboard from "../pages/Dashboard"
 * 
 * // Inside your App.tsx or Router configuration:
 * <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
 * ```
 * 
 * In the example above:
 * - If the user is logged in → The `<Dashboard />` component is rendered.
 * - If not → The user is redirected to `/`.
 * 
 * -----------------------------------------------------------------------------------
 * @Summary
 * - **Purpose:** Restrict unauthorized users from accessing private routes.
 * - **Storage Mechanism:** Uses `localStorage` flag `"isLoggedIn"`.
 * - **Returns:** Either the requested protected page or a redirect to the landing page.
 * - **Ideal Use Case:** Wrap any page that should only be visible after successful login.
 */

export function ProtectedRoute({ element }: { element: ReactElement }): ReactElement {
  // Step 1: Check if user is logged in by looking in localStorage
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"

  // Step 2: If user is logged in, show the requested page
  if (isLoggedIn) {
    return element
  }

  // Step 3: If user is NOT logged in, redirect to the landing page
  return <Navigate to="/" replace />
}
