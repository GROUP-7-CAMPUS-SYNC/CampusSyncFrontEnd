import { BrowserRouter, Routes, Route } from "react-router-dom"
import LandingPage from "./pages/landingPage"
import { ProtectedRoute } from "./hooks/userIsLogIn"
import Home from "./pages/index"

/**
 * PROTECTED ROUTE FUNCTIONS
 *  
 * This component acts as a "gate keeper" for protected pages.
 * It checks if the user is authenticated before allowing access.
 * 
 * HOW IT WORKS:
 * 1. Check if user is logged in (from localStorage) [temporary for testing]
 * 2. If logged in → Allow access to the page
 * 3. If NOT logged in → Redirect back to landing page
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        {/* <Route path="/home" element={<Home/>}/> */}
        <Route path="/home" element={<ProtectedRoute element={<Home/>}/>}/>
      </Routes>
    </BrowserRouter>
  )
}
