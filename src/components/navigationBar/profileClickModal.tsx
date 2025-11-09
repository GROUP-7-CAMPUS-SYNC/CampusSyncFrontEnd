import { useNavigate } from "react-router-dom"
import LogOutLogo from "../../assets/log-out-logo.svg"
import { clearLogInFlag } from "../../utils/clearLogInFlag"

export default function profileClickModal() {
  
    const navigation = useNavigate()

    const handleLogOut = () => {
        clearLogInFlag()
        navigation("/")
    }

  return (
    <div
        className="
        fixed right-4 top-[11%]
        bg-white shadow-lg rounded-xl border border-gray-200
        p-4 z-[9999]
        w-[90vw] sm:w-[200px] md:w-[250px] lg:w-[350px]
        cursor-pointer hover:bg-gray-100 transition-all duration-200
      "
    >
        <button
            className="flex gap-x-2 font-semibold"
            onClick={handleLogOut}
        >
            <img src={LogOutLogo} alt="Log Out" />
            <h1>Log Out</h1>
        </button>
    </div>
  )
}
