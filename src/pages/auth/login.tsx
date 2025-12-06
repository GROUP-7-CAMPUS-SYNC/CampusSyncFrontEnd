import { useEffect, useState } from "react"
import StringTextField from "../../components/stringTextField"
import Button from "../../components/button"
import { setLoginFlag } from "../../utils/setLogInFlag"
import { useNavigate } from "react-router-dom"
import api from "../../api/api" 
import Modal from "../../components/modal"

export default function login() {

    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const navigation = useNavigate()

    // 🔹 Track if form has been submitted
    const [formSubmitted, setFormSubmitted] = useState<boolean>(false)

    // Error State
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [authenticationError, setAuthenticationError] = useState<boolean>(false)


    useEffect(() => {
        const checkAuth  = async () => {
            const token = localStorage.getItem("authToken")
            if(!token){
                setIsLoading(false)
                return
            } 

            try
            {
                const response = await api.get('/auth/verify')

                if(response.status === 200)
                {
                    setLoginFlag()
                    localStorage.setItem("firstName", response.data.user.firstname)
                    localStorage.setItem("lastName", response.data.user.lastname)
                    localStorage.setItem("course", response.data.user.course)
                    localStorage.setItem("email", response.data.user.email)
                    localStorage.setItem("profileLink", response.data.user.profileLink)
                    localStorage.setItem("role", response.data.user.role)

                    if(response.data.user.role === "moderator")
                    {   
                        navigation("/moderator")
                    }
                    else
                    {
                        navigation("/home")
                    }
                }
            }catch(error : any)
            {
                localStorage.clear()
            }
        }

        checkAuth()
    }, [])

    const handleSubmit = async (e : React.FormEvent) => {
        e.preventDefault()
        setFormSubmitted(true)

        if(email.trim() === "" || password.trim() === "" ||   !email.endsWith("@1.ustp.edu.ph")) return
        setLoginFlag()

        setIsLoading(true)
        try
        {
            const payload = {
                email,
                password
            }

            const response = await api.post("/auth/login", payload)
            console.log("✅ Login successful:", response.data)
            localStorage.setItem("authToken", response.data.token)
            localStorage.setItem("firstName", response.data.user.firstname)
            localStorage.setItem("lastName", response.data.user.lastname)
            localStorage.setItem("course", response.data.user.course)
            localStorage.setItem("email", response.data.user.email)
            localStorage.setItem("profileLink", response.data.user.profileLink)
            localStorage.setItem("role", response.data.user.role)

            if(response.data.user.role === "moderator")
            {   
                navigation("/moderator")
            }
            else
            {
                navigation("/home")
            }

        }catch(error : any)
        {
            setAuthenticationError(true)
            setErrorMessage(error.response?.data?.message || "Something went wrong. Please try again.")
        }finally{
            setIsLoading(false)
        }
    }

  return (
   <form  onSubmit={handleSubmit} action="" className="flex flex-col gap-y-2  max-w-md mx-auto">

    <StringTextField
        label="University Email"
        placeholder="example@1.ustp.edu.ph"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        errorMessage="Please use your USTP student email"
        showError={formSubmitted && !email.endsWith("@1.ustp.edu.ph")}
    />

    <StringTextField 
        label="password"
        type="password"
        placeholder="******"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        errorMessage="Please create a password"
        showError={formSubmitted && password.trim() === ""}
    />

    <Button 
        type="submit"
        buttonText={`${isLoading ? "Logging In..." : "Log In"}`}
        buttonContainerDesign="bg-[#1F1B4F] p-[10px] w-full text-white rounded-[6px] hover:bg-[#241F5B] transition-colors duration-200 hover:cursor-pointer"
    />

    {authenticationError && 
    (
        <Modal>
            <div
                className="flex justify-center items-center flex-col gap-2"
            >
                {errorMessage}

                <Button
                    type="button"
                    buttonText="Close"
                    onClick={() => setAuthenticationError(false)}
                />
            </div>
        </Modal>
    )}
   </form>
  )
}