import NotificationPersonLogo from "../../assets/notification-initial-logo.svg"

export default function NotificationClickModal() {
  const notifications = [
    {
      name: "Ana",
      message: "A new lost item was reported: ‘Black Wallet’ near the Library.",
      time: "1 day",
    },
    {
      name: "Office of Student Affair",
      message: "Class Suspension Tomorrow.",
      time: "4 days",
    },
    {
      name: "Juan Dela Cruz",
      message: "Someone replied to your post on ‘Lost Phone – CICS Building’.",
      time: "1 day",
    },
    {
      name: "Office of Student Affair",
      message: "Submission of clearance ends this Friday.",
      time: "4 days",
    },
  ]

  return (
    <div
      className="
        fixed right-4 top-[11%]
        bg-white shadow-lg rounded-xl border border-gray-200
        p-4 z-[9999]
        w-[90vw] sm:w-[350px] md:w-[400px] lg:w-[450px]
      "
    >
      <h3 className="font-semibold text-lg md:text-xl mb-3 text-gray-900">
        Notifications
      </h3>

      <ul className="divide-y divide-gray-200">
        {notifications.map((notif, index) => (
          <li
            key={index}
            className="flex justify-between items-start gap-3 py-3 hover:bg-gray-50 cursor-pointer rounded-md px-2 transition-all"
          >
            {/* Avatar */}
            <img
              src={NotificationPersonLogo}
              alt="User Icon"
              className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0"
            />

            {/* Content */}
            <div className="flex-1">
              <p className="font-medium text-gray-900 text-sm md:text-base">
                {notif.name}
              </p>
              <p className="text-gray-600 text-xs md:text-sm">
                {notif.message}
              </p>
            </div>

            {/* Time */}
            <span className="text-gray-400 text-xs md:text-sm whitespace-nowrap">
              {notif.time}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
