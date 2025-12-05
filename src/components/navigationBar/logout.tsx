import { useNavigate } from "react-router-dom";
import LogOutLogo from "../../assets/log-out-logo.svg";
import { clearLogInFlag } from "../../utils/clearLogInFlag";
import { forwardRef, useState } from "react";

// Use forwardRef to accept a ref from the parent
const LogoutModal = forwardRef<HTMLDivElement>((_props, ref) => {
  const [clickProfile, setClickProfile] = useState(false);
  const navigation = useNavigate();

  const handleLogOut = () => {
    clearLogInFlag();
    navigation("/");
  };

  const handleProfileClick = () => {
    navigation("/profile");
    setClickProfile(!clickProfile);
  };

  return (
    <div
      ref={ref} // Attach the forwarded ref here
      className="
                fixed right-4 top-19
                bg-white shadow-lg rounded-xl border border-gray-200
                z-50 w-[90vw] sm:w-[200px] md:w-[250px] lg:w-[350px]
                cursor-pointe transition-all duration-200 
            "
    >
      <button
        className="flex gap-x-2  rounded-t-xl w-full font-semibold p-4 cursor-pointer hover:bg-gray-100"
        onClick={handleProfileClick}
      >
        See Profile
      </button>
      <hr className="border-gray-300 w-[95%] mx-auto"></hr>
      <button
        className="flex gap-x-2 rounded-b-xl w-full font-semibold p-4 cursor-pointer hover:bg-gray-100"
        onClick={handleLogOut}
      >
        <img src={LogOutLogo} alt="Log Out" />
        <h1>Log Out</h1>
      </button>
    </div>
  );
});

export default LogoutModal;
