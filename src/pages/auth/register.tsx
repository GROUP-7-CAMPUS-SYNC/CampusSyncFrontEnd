import { useState } from "react"
import { useScreenSize } from "../../hooks/useScreenSize"
import StringTextField from "../../components/stringTextField"
import Button from "../../components/button"
import { setLoginFlag } from "../../utils/setLogInFlag"
import "./register.css"
import { useNavigate } from "react-router-dom"


export default function Register() {
  const [firstName, setFirstName] = useState<string>("")
  const [lastName, setLastName] = useState<string>("")
  const [course, setCourse] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const navigation = useNavigate()


  // 🔹 Track if form has been submitted
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false)

  // use screen dectection
  const [step, setStep] = useState<number>(1)
  const isSmallScreen = useScreenSize(640)

  const handleFirstStep = () => {
    setFormSubmitted(true)

    if(firstName.trim() == "" || lastName.trim() == "" || course.trim() == "") return
    setFormSubmitted(false)
    setStep(2)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)

    if(firstName.trim() === "" || 
        lastName.trim() === "" || 
        course.trim() === "" || 
        email.trim() === "" ||
        password.trim() === ""
      ) return
    setLoginFlag()

    // 🔹 If all fields are filled, log the data
    console.log("✅ Form submitted successfully:")
    console.log({
      firstName,
      lastName,
      course,
      email,
      password
    })

    navigation("/home")
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-2  max-w-md mx-auto">

      {isSmallScreen ? (
        <>
          {step === 1 && (
            <div
              className="flex flex-col gap-y-2"
            >
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
                errorMessage="Please enter a valid university email"
                showError={formSubmitted && email.trim() === ""}
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

              <div
                className="flex justify-between gap-x-2"
              >
                <Button
                  type="button"
                  buttonText="Back"
                  onClick={() => setStep(1)}
                />

                <Button
                  type="submit"
                  buttonText="Sign Up"
                />
              </div>              
            </>
          )}

        </>
      ) : 
      (
      <>
          <div
              className="flex flex-col custom-break gap-x-4 gap-y-2"
          >
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
          showError={formSubmitted && email.trim() === ""}
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
          buttonText = "Sign Up"
        />  
        
      </>
    )}
    </form>
  )
}
