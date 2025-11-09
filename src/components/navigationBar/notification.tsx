import NotificationLogo from "../../assets/notification-logo.svg"

interface NotificationProps {
  notificationDesign?: string
  imageDesign?: string
  badgeCount: number
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export default function Notification({
  notificationDesign = "relative inline-block",
  imageDesign = "lg:h-[4vh] w-[30px] h-[30px] hover:brightness-50 hover:cursor-pointer transition-all duration-200",
  badgeCount,
  onClick,
}: NotificationProps) {
  return (
    <div className={notificationDesign}>
      <button onClick={onClick} className="relative">
        <img
          src={NotificationLogo}
          className={imageDesign}
          alt="notification logo"
        />

        {/* Badge */}
        {badgeCount > 0 && (
          <span
            className="
              absolute -top-1 -right-1
              bg-[#1F1B4F] text-white text-[0.65rem] font-bold
              h-4 w-4 flex items-center justify-center
              rounded-full shadow-sm border
            "
          >
            {badgeCount > 9 ? "9+" : badgeCount}
          </span>
        )}
      </button>
    </div>
  )
}
