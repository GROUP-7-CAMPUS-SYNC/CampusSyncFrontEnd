import ProfileLogo from "../../assets/profile-logo.svg"

interface ProfileProps {
    profileDesign? : string
    imageDesign? : string
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export default function profile({
    profileDesign,
    imageDesign = "lg:h-[4vh] w-[30px] h-[30px] hover:brightness-50 hover:cursor-pointer transition-all duration-200",
    onClick
} : ProfileProps) {
  return (
    <div
        className={profileDesign}
    >
        <button
            onClick={onClick}
        >
            <img 
                src={ProfileLogo} 
                className={imageDesign}
                alt="Profile Logo" 
            />
        </button>
    </div>
  )
}
