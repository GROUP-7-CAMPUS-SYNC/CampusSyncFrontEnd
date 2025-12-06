import { useState } from "react"
import { useScreenSize } from "../../hooks/useScreenSize"
import StringTextField from "../../components/stringTextField"
import Button from "../../components/button"
import { setLoginFlag } from "../../utils/setLogInFlag"
import "./register.css"
import { useNavigate } from "react-router-dom"
import api from "../../api/api" 
import Modal from "../../components/modal"

export default function Register() {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [course, setCourse] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigation = useNavigate();

  // 🔹 Track if form has been submitted
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false)
   
  // 🔹 Loading state
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // 🔹 Error Handling State
  const [errorMessage, setErrorMessage] = useState<React.ReactNode | null>(null)
  const [registrationError, setRegistrationError] = useState<boolean>(false)

  // Screen detection
  const [step, setStep] = useState<number>(1)
  const isSmallScreen = useScreenSize(640)

  const handleFirstStep = () => {
    setFormSubmitted(true)
    if(firstName.trim() === "" || lastName.trim() === "" || course.trim() === "") return
    setFormSubmitted(false)
    setStep(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);

    // Basic Frontend Validation
    if (
      firstName.trim() === "" ||
      lastName.trim() === "" ||
      course.trim() === "" ||
      email.trim() === "" ||
      password.trim() === "" ||
      !email.endsWith("@1.ustp.edu.ph")
    )
      return;

    setIsLoading(true);

    try {
      const payload = {
        firstname: firstName, 
        lastname: lastName,   
        course,
        email,
        password,
      };

      const response = await api.post("/auth/register", payload)

      console.log("✅ Registration successful:", response.data)
      
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("firstName", response.data.user.firstname);
      localStorage.setItem("lastName", response.data.user.lastname);
      localStorage.setItem("course", response.data.user.course);
      localStorage.setItem("email", response.data.user.email);
      localStorage.setItem("profileLink", response.data.user.profileLink);
      localStorage.setItem("role", response.data.user.role);
      
      setLoginFlag(); 
      navigation("/home");

    } catch (error: any) {
      console.error("❌ Registration failed:", error)
      
      const resData = error.response?.data
      setRegistrationError(true)

      // 🔹 Tailored Error Logic
      if (resData?.allowedCourses && Array.isArray(resData.allowedCourses)) {
        setErrorMessage(
            <div className="w-full">
                <p className="text-center font-semibold mb-2 text-red-600">
                    {resData.message || "Invalid Course Selected"}
                </p>
                <div className="bg-gray-100 p-3 rounded-md text-sm text-gray-700">
                    <p className="mb-1 font-bold text-gray-800">Please enter one of the following:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        {resData.allowedCourses.map((c: string) => (
                            <li key={c}>{c}</li>
                        ))}
                    </ul>
                </div>
            </div>
        )
      } else {
        setErrorMessage(resData?.message || "Something went wrong. Please try again.")
      }

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#1F1B4F]">
      
      {/* 🔹 Left Side: Image (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        {/* Using a placeholder image that matches the 'students working' vibe */}
        <img 
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" 
          alt="Students collaborating" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay to ensure logo text readability if you decide to put it here, 
            though your design puts the logo on the form side. */}
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* Optional: Central Logo Overlay on Image if needed (based on Image 1) */}
        <div className="absolute inset-0 flex items-center justify-center">
             {/* You can place your Logo Image component here if you have one */}
        </div>
      </div>

      {/* 🔹 Right Side: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12">
        
        {/* Branding Header */}
        <h1 className="text-4xl font-bold text-[#FFD700] mb-8 font-sans">
          CampusSync
        </h1>

        {/* White Card Container */}
        <div className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-xl">
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">

            {isSmallScreen ? (
              // 📱 Mobile View (Step Based)
              <>
                {step === 1 && (
                  <div className="flex flex-col gap-y-4">
                    <StringTextField
                        label="First Name"
                        placeholder="Lois"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        errorMessage="Please enter your first name"
                        showError={formSubmitted && firstName.trim() === ""}
                    />

                    <StringTextField
                        label="Last Name"
                        placeholder="Backet"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        errorMessage="Please enter your last name"
                        showError={formSubmitted && lastName.trim() === ""}
                    />

                    <StringTextField
                        label="Course/Program"
                        placeholder="BSIT"
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                        errorMessage="Please provide your course or program"
                        showError={formSubmitted && course.trim() === ""}
                    />
                    
                    <Button
                        type="button"
                        buttonText="Next"
                        onClick={handleFirstStep}
                        buttonContainerDesign="bg-[#1F1B4F] text-white p-3 rounded-lg w-full hover:bg-[#2D2866] transition-colors"
                    />
                  </div>
                )}

                {step === 2 && (
                  <div className="flex flex-col gap-y-4">
                    <StringTextField
                        label="University Email"
                        placeholder="example@1.ustp.edu.ph"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        errorMessage="Please use your USTP student email"
                        showError={formSubmitted && !email.endsWith("@1.ustp.edu.ph")}
                    />

                    <StringTextField
                        type="password"
                        label="Password"
                        placeholder="******"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        errorMessage="Please create a password"
                        showError={formSubmitted && password.trim() === ""}
                    />

                    <div className="flex justify-between gap-x-3 mt-2">
                        <Button
                            type="button"
                            buttonText="Back"
                            onClick={() => setStep(1)}
                            buttonContainerDesign="bg-gray-200 text-gray-700 p-3 rounded-lg w-1/3 hover:bg-gray-300 transition-colors"
                        />
                        <Button
                            type="submit"
                            buttonText={isLoading ? "Signing Up..." : "Sign Up"} 
                            buttonContainerDesign="bg-[#1F1B4F] text-white p-3 rounded-lg w-full hover:bg-[#2D2866] transition-colors"
                        />
                    </div>
                  </div>
                )}
              </>
            ) : (
              // 💻 Desktop View (Full Form)
              <>
                  <div className="flex flex-row gap-x-4">
                      <div className="w-1/2">
                          <StringTextField
                              label="First Name"
                              placeholder="Lois"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              errorMessage="Please enter your first name"
                              showError={formSubmitted && firstName.trim() === ""}
                          />
                      </div>
                      <div className="w-1/2">
                          <StringTextField
                              label="Last Name"
                              placeholder="Backet"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              errorMessage="Please enter your last name"
                              showError={formSubmitted && lastName.trim() === ""}
                          />
                      </div>
                  </div>

                  <StringTextField
                    label="Course/Program"
                    placeholder="BSIT"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    errorMessage="Please provide your course or program"
                    showError={formSubmitted && course.trim() === ""}
                  />

                  <StringTextField
                    label="University Email"
                    placeholder="example@1.ustp.edu.ph"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    errorMessage="Please enter a valid university email"
                    showError={formSubmitted && !email.endsWith("@1.ustp.edu.ph")}
                  />

                  <StringTextField
                    type="password"
                    label="Password"
                    placeholder="******"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    errorMessage="Please create a password"
                    showError={formSubmitted && password.trim() === ""}
                  />

                  <div className="mt-4">
                    <Button 
                      type="submit"
                      buttonText={isLoading ? "Signing Up..." : "Sign Up"}
                      buttonContainerDesign="bg-[#1F1B4F] p-3 w-full text-white font-semibold rounded-lg hover:bg-[#2D2866] transition-colors duration-200 hover:cursor-pointer"
                    />  
                  </div>
              </>
            )}

          </form>
        </div>

        {/* Footer Link */}
        <div className="mt-6 text-white text-sm">
            Already have an account?{" "}
            <span 
                className="text-[#FFD700] font-semibold cursor-pointer hover:underline"
                onClick={() => navigation("/login")} // Adjust path as needed
            >
                Sign in
            </span>
        </div>

      </div>

      {/* 🔹 Modal Implementation */}
      {registrationError && (
        <Modal>
            <div className="flex justify-center items-center flex-col gap-4 p-2 w-full">
                {errorMessage}
                
                <Button 
                    type="button" 
                    buttonText="Close" 
                    onClick={() => setRegistrationError(false)}
                    buttonContainerDesign="bg-gray-200 p-2 rounded w-full hover:bg-gray-300 transition-colors"
                />
            </div>
        </Modal>
      )}
    </div>
  )
}