import WebsiteLogo from "../../assets/WebsiteLogo.png"

interface WebsiteLogoProps {
    profileDesign? : string
    imageDesign? : string
}

export default function websiteLogo({
    profileDesign,
    imageDesign = "h-full"
} : WebsiteLogoProps) {
  return (
    <div
        className={profileDesign}
    >
        <img 
            src={WebsiteLogo} 
            className={imageDesign}
            alt="WebsiteLogo Logo" 
        />
    </div>
  )
}
