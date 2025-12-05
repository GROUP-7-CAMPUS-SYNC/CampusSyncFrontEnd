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
  const [firstName, setFirstName] = useState<string>("")
  const [lastName, setLastName] = useState<string>("")
  const [course, setCourse] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const navigation = useNavigate()

  // 🔹 Track if form has been submitted
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false)
   
  // 🔹 Loading state
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // 🔹 Error Handling State
  // Changed type to React.ReactNode to allow rendering JSX (lists) inside the modal
  const [errorMessage, setErrorMessage] = useState<React.ReactNode | null>(null)
  const [registrationError, setRegistrationError] = useState<boolean>(false)

  // Screen detection
  const [step, setStep] = useState<number>(1)
  const isSmallScreen = useScreenSize(640)

  const handleFirstStep = () => {
    setFormSubmitted(true)
    if(firstName.trim() == "" || lastName.trim() == "" || course.trim() == "") return
    setFormSubmitted(false)
    setStep(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)

    // Basic Frontend Validation
    if(firstName.trim() === "" || 
        lastName.trim() === "" || 
        course.trim() === "" || 
        email.trim() === "" ||
        password.trim() === "" ||
        !email.endsWith("@1.ustp.edu.ph")
      ) return

    setIsLoading(true)

    try {
      const payload = {
        firstname: firstName, 
        lastname: lastName,   
        course,
        email,
        password
      }

      const response = await api.post("/auth/register", payload)

      console.log("✅ Registration successful:", response.data)
      
      localStorage.setItem("authToken", response.data.token)
      localStorage.setItem("firstName", response.data.user.firstname)
      localStorage.setItem("lastName", response.data.user.lastname)
      localStorage.setItem("course", response.data.user.course)
      localStorage.setItem("email", response.data.user.email)
      localStorage.setItem("profileLink", response.data.user.profileLink)
      localStorage.setItem("role", response.data.user.role)
      
      setLoginFlag() 
      navigation("/home")

    } catch (error: any) {
      console.error("❌ Registration failed:", error)
      
      const resData = error.response?.data
      setRegistrationError(true)

      // 🔹 Tailored Error Logic
      // Check if the backend sent a list of allowed courses
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
        // Default generic error
        setErrorMessage(resData?.message || "Something went wrong. Please try again.")
      }

    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-2  max-w-md mx-auto">

      {isSmallScreen ? (
        <>
          {step === 1 && (
            <div className="flex flex-col gap-y-2">
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
              />
            </div>
          )}

          {step === 2 && (
            <>
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

              <div className="flex justify-between gap-x-2">
                <Button
                  type="button"
                  buttonText="Back"
                  onClick={() => setStep(1)}
                />

                <Button
                  type="submit"
                  buttonText={isLoading ? "Signing Up..." : "Sign Up"} 
                />
              </div>              
            </>
          )}
        </>
      ) : (
        <>
            <div className="flex flex-col custom-break gap-x-4 gap-y-2">
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

          <Button 
            type="submit"
            buttonText={isLoading ? "Signing Up..." : "Sign Up"}
            buttonContainerDesign="bg-[#1F1B4F] p-[10px] w-full text-white rounded-[6px] hover:bg-[#241F5B] transition-colors duration-200 hover:cursor-pointer"
          />  
        </>
      )}

      {/* 🔹 Modal Implementation */}
      {registrationError && (
        <Modal>
            <div className="flex justify-center items-center flex-col gap-4 p-2 w-full">
                {/* Error message is now dynamic (can be text or a complex list) */}
                {errorMessage}
                
                <Button 
                    type="button" 
                    buttonText="Close" 
                    onClick={() => setRegistrationError(false)}
                />
            </div>
        </Modal>
      )}
    </form>
  )
}