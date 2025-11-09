export default function RecentSearch() {
  const recent = ["Hackathon 2025", "Tech Event", "Lost Item", "Campus News"]

  return (
    <div className="bg-white shadow-md rounded-md border border-gray-200 overflow-hidden">
      <p className="text-sm text-gray-500 px-4 py-2 border-b">Recent Searches</p>
      {recent.map((item, index) => (
        <button
          key={index}
          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
        >
          {item}
        </button>
      ))}
    </div>
  )
}
