import { BrowserRouter, Routes, Route } from "react-router-dom"
import LandingPage from "./pages/landingPage"
import { ProtectedRoute } from "./hooks/userIsLogIn"
import Moderator from "./pages/moderator"
import Profile from "./pages/profile/renderSection"
import Home from "./pages/home/renderSection"
import LostAndFound from "./pages/lost&found/renderSection"
import Event from "./pages/event/renderSection"
import Academic from "./pages/announcement/renderSection"
import Save from "./pages/save/renderSection"

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
        <Route path="/moderator" element={<ProtectedRoute element={<Moderator/>}/>}/>
        <Route path="/profile" element={<ProtectedRoute element={<Profile/>}/>}/>
        <Route path="/home" element={<ProtectedRoute element={<Home/>}/>}/>
        <Route path="/lost&found" element={<ProtectedRoute element={<LostAndFound/>}/>}/>
        <Route path="/event" element={<ProtectedRoute element={<Event/>}/>}/>
        <Route path="/academic" element={<ProtectedRoute element={<Academic/>}/>}/>
        <Route path="/save" element={<ProtectedRoute element={<Save/>}/>}/>

      </Routes>
    </BrowserRouter>
  )
}
