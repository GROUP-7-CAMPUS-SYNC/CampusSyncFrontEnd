import { useState } from "react"
import CardContainer from "../../components/cardContainer"
import Login from "../../pages/auth/login"
import Register from "../auth/register"
import WebsiteLogo from "../../assets/WebsiteLogo.png"
import backgroudImage from '../../assets/landing-page-img-1.png'
import backgroundImage2 from '../../assets/landing-page-img-2.png'

export default function landingPage() {

  const [userSignIn, setUserSignIn] = useState<boolean>(true)

  return (
    <div
      className="flex flex-row bg-[#1F1B4F] w-full h-full"
    >
      {/* Left side - 50%*/}
      {/* 
        LEFT SIDE - LOGO AND BACKGROUND IMAGES
        
        RESPONSIVE BEHAVIOR:
        - hidden: This class is applied by DEFAULT to ALL screen sizes.
                  It hides the element on mobile, tablet, and any small screens.
        
        - lg:flex: The "lg:" prefix means "Large screens and above (1024px+)".
                   At 1024px and larger, this OVERRIDES the "hidden" class.
                   Instead of being hidden, the element now displays as "flex".
        
        SUMMARY:
        Mobile/Tablet (under 1024px) → HIDDEN (not visible)
        Large Screens (1024px+) → VISIBLE as flexbox (50% width)
        
        WIDTH:
        - w-1/2: Takes up 50% of the parent container width
                 (only applies when the element is visible on lg screens)
      */}
      <div
        className="hidden lg:flex w-1/2 relative bg-white"
      >
        {/** Background Image */}
        <div
          className="h-full w-full"
        >            
          <img
            className="h-1/2 w-full" 
            src={backgroudImage}
            alt="backgroud image 1" 
          />
          <img 
            className="h-1/2 w-full"
            src={backgroundImage2}
            alt="backgroud image 2" 
          />
        </div>

        <div
          className="absolute inset-0 flex justify-center items-center"
        >
          <img 
            className="w-[30%] h-[30%]"
            src={WebsiteLogo}
            alt="WebsiteLogo" 
          />
        </div>
      </div>

      {/** Right Side - 50% */}
      {/* 
        RIGHT SIDE - SIGN IN / SIGN UP FORM
        
        RESPONSIVE BEHAVIOR:
        - w-full: By DEFAULT (on all small screens), the form takes up the FULL width
                  of the parent container. This ensures the form spans the entire screen
                  on mobile and tablet devices.
        
        - lg:w-1/2: The "lg:" prefix means "Large screens and above (1024px+)".
                    At 1024px and larger, this OVERRIDES "w-full".
                    The form now takes up only 50% of the parent width,
                    making room for the left side to appear.
        
        SUMMARY:
        Mobile/Tablet (under 1024px) → Takes 100% width (entire screen)
        Large Screens (1024px+) → Takes 50% width (shares space with left side)
        
        OTHER CLASSES:
        - flex: Makes this a flexbox container
        - justify-center: Centers content horizontally
        - items-center: Centers content vertically
        - h-full: Takes 100% of parent height
      */}
      <div
          className="w-full lg:w-1/2 flex justify-center items-center h-full"
      >   
        {userSignIn ? (
          <>
            <div
              className="flex flex-col justify-center items-center gap-y-2"
            >
              <h1 className="text-[#F9BF3B] sm:text-[45px] text-[35px] font-bold">CampusSync</h1>
              <h3 className="sm:text-[32] text-[22px] font-bold text-white">Sign In</h3>
              <CardContainer
                cardContainerDesign="bg-white shadow-lg rounded-lg p-4 w-[300px] sm:w-[380px] md:w-[462px] lg:w-[500px]"
              >
                <Login/>
              </CardContainer>
              <h4 
                className="text-white"
                style={{fontFamily: 'Roboto, sans-serif'}}
              >
                Create an account?
                <button 
                  className="hover:text-[#F9BF3B] hover:underline cursor-pointer ml-1"
                  onClick={() => setUserSignIn(false)}
                >
                  Sign Up
                </button>
              </h4>
            </div>
          </>
        ) : (
          <>
            <div
              className="flex flex-col justify-center items-center gap-y-2"
            >
              <h1 className="text-[#F9BF3B] sm:text-[45px] text-[35px] font-bold">CampusSync</h1>
              <h3 className="sm:text-[32] text-[22px] font-bold text-white">Sign Up</h3>
              <CardContainer
                  cardContainerDesign="bg-white shadow-lg rounded-lg p-4 min-w-[300px] sm:w-[380px] md:w-[462px] lg:w-[500px]"
              >
                  <Register/>
              </CardContainer>
              <h3 
                className="text-white"
                style={{fontFamily: 'Roboto, sans-serif'}}
              >
                Already have an account?
                <button 
                  className="hover:text-[#F9BF3B] hover:underline cursor-pointer ml-1"
                  onClick={() => setUserSignIn(true)}
                >
                  Sign in
                </button>
              </h3>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
