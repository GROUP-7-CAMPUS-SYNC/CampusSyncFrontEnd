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
        placeholder="example@1.ustp.edu.ph"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        errorMessage="Please enter a valid university email"
        showError={formSubmitted && email.trim() === ""}
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
    />
   </form>
  )
}
