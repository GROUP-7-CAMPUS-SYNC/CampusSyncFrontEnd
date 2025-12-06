import { useState } from "react";
import CardContainer from "../../components/cardContainer";
import Login from "../../pages/auth/login";
import Register from "../auth/register";
import WebsiteLogo from "../../assets/WebsiteLogo.png";
import backgroudImage from "../../assets/landing-page-img-1.png";
import backgroundImage2 from "../../assets/landing-page-img-2.png";

export default function landingPage() {
  const [userSignIn, setUserSignIn] = useState<boolean>(true);

  return (
    <div className="flex flex-row bg-[#1F1B4F] w-full h-full">
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
      <div className="hidden lg:flex w-1/2 relative bg-white">
        {/** Background Image */}
        <div className="h-full w-full">
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

        <div className="absolute inset-0 flex justify-center items-center">
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
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center h-full sm:p-5">
        {userSignIn ? (
          <>
            <div className="flex flex-col justify-around items-center gap-y-2 w-full h-full sm:h-[50%] ">
              <div className="h-full flex justify-center items-center">
                <h1 className="text-[#F9BF3B] text-5xl font-bold mb-0 sm:mb-5">
                  CampusSync
                </h1>
              </div>
              <div className="w-full h-full flex flex-col justify-between items-center">
                <CardContainer cardContainerDesign="bg-white sm:rounded-lg p-6 sm:w-[60%] w-full h-full rounded-t-2xl">
                  <Login />
                  <div className="text-center text-lg mt-12">
                    <h4
                      className="text-blue-800"
                      style={{ fontFamily: "Roboto, sans-serif" }}
                    >
                      Create an account?
                      <button
                        className="hover:text-[#F9BF3B] hover:underline cursor-pointer ml-1 text-[#af841e] font-semibold"
                        onClick={() => setUserSignIn(false)}
                      >
                        Sign Up
                      </button>
                    </h4>
                  </div>
                </CardContainer>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col justify-around items-center gap-y-2 w-full h-full sm:h-[70%] ">
              <div className="h-full flex justify-center items-center">
                <h1 className="text-[#F9BF3B] text-5xl font-bold mb-0 sm:mb-5">
                  CampusSync
                </h1>
              </div>
              <div className="w-full h-full flex flex-col justify-between items-center">
                <CardContainer cardContainerDesign="flex flex-col bg-white sm:rounded-lg p-6 sm:w-[60%] w-full h-full rounded-t-2xl">
                  <Register />
                  <div className="text-center text-lg mt-14 sm:mt-5">
                    <h4
                      className="text-blue-800 "
                      style={{ fontFamily: "Roboto, sans-serif" }}
                    >
                      Already have an account?
                      <button
                        className="hover:text-[#F9BF3B] hover:underline cursor-pointer ml-1 text-[#af841e] font-semibold"
                        onClick={() => setUserSignIn(true)}
                      >
                        Sign in
                      </button>
                    </h4>
                  </div>
                </CardContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
