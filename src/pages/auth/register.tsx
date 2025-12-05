import { useState } from "react";
import { useScreenSize } from "../../hooks/useScreenSize";
import StringTextField from "../../components/stringTextField";
import Button from "../../components/button";
import { setLoginFlag } from "../../utils/setLogInFlag";
import "./register.css";
import { useNavigate } from "react-router-dom";
import api from "../../api/api"; // Ensure this path matches your structure

export default function Register() {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [course, setCourse] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigation = useNavigate();

  // 🔹 Track if form has been submitted
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  // 🔹 Loading state to prevent double submissions
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // use screen dectection
  const [step, setStep] = useState<number>(1);
  const isSmallScreen = useScreenSize(640);

  const handleFirstStep = () => {
    setFormSubmitted(true);

    if (firstName.trim() == "" || lastName.trim() == "" || course.trim() == "")
      return;
    setFormSubmitted(false);
    setStep(2);
  };

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
      // 1. Prepare Payload (Map frontend camelCase to backend lowercase)
      const payload = {
        firstname: firstName, // Backend expects 'firstname'
        lastname: lastName, // Backend expects 'lastname'
        course,
        email,
        password,
      };

      // 2. API Call
      // NOTE: Verify your backend route. I am assuming '/auth/register'.
      // If your backend route is just '/register', change this line.
      const response = await api.post("/auth/register", payload);

      // 3. Success Handling
      console.log("✅ Registration successful:", response.data);

      // Store the token for future authenticated requests
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("firstName", response.data.user.firstname);
      localStorage.setItem("lastName", response.data.user.lastname);
      localStorage.setItem("course", response.data.user.course);
      localStorage.setItem("email", response.data.user.email);
      localStorage.setItem("profileLink", response.data.user.profileLink);
      localStorage.setItem("role", response.data.user.role);

      setLoginFlag(); // Keep your existing flag logic if needed
      navigation("/home");
    } catch (error: any) {
      // 4. Error Handling
      console.error("❌ Registration failed:", error);

      // Extract error message from backend response
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      alert(errorMessage); // Professional Tip: Replace with a toast notification later
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-xl font-semibold text-center mb-0 sm:mb-4">
        Sign Up
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full justify-evenly sm:justify-center h-[70%] sm:h-full max-w-md mx-auto"
      >
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
                    buttonText={isLoading ? "Signing Up..." : "Sign Up"} // UI Feedback
                    // Optional: Disable button while loading
                    // disabled={isLoading}
                  />
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div className="flex flex-col custom-break gap-x-4">
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
              buttonText={isLoading ? "Signing Up..." : "Sign Up"} // UI Feedback
              buttonContainerDesign="bg-[#1F1B4F] py-3 px-5 w-full text-white rounded-[6px] hover:bg-[#241F5B] transition-colors duration-200 hover:cursor-pointer"
            />
          </>
        )}
      </form>
    </>
  );
}
