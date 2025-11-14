import { useState } from "react"
import StringTextField from "../../components/stringTextField"
import Button from "../../components/button"
import { setLoginFlag } from "../../utils/setLogInFlag"
import { useNavigate } from "react-router-dom"

export default function login() {

    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const navigation = useNavigate()

    // 🔹 Track if form has been submitted
    const [formSubmitted, setFormSubmitted] = useState<boolean>(false)

    const handleSubmit = (e : React.FormEvent) => {
        e.preventDefault()
        setFormSubmitted(true)

        if(email.trim() === "" || password.trim() === "") return
        setLoginFlag()

        navigation("/home")
    }

  return (
   <form  onSubmit={handleSubmit} action="" className="flex flex-col gap-y-2  max-w-md mx-auto">

    <StringTextField
        label="University Email"
        placeholder="example@ustp.edu.ph"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        errorMessage="Please use your USTP student email"
        showError={formSubmitted && !email.endsWith("@ustp.edu.ph")}
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
        buttonText="Sign In"
        buttonContainerDesign="bg-[#1F1B4F] p-[10px] w-full text-white rounded-[6px] hover:bg-[#241F5B] transition-colors duration-200 hover:cursor-pointer"    />
   </form>
  )
}
