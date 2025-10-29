"use client"

export function ZaloChat() {
  const handleZaloClick = () => {
    window.open("https://zalo.me/0826071111", "_blank")
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <button
        onClick={handleZaloClick}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-[#176C37] hover:bg-[#0d4620] text-white shadow-lg transition-all duration-300 hover:scale-110 group relative"
        title="Chat với Zalo"
        aria-label="Chat với Zalo"
      >
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 0C5.37 0 0 4.48 0 10c0 3.45 1.89 6.45 4.82 8.31L3.5 23l5.5-3.08c1.52.41 3.13.63 4.82.63 6.63 0 12-4.48 12-10S18.63 0 12 0zm0 18.5c-1.41 0-2.78-.25-4.08-.7l-.29-.1-3.04 1.71.9-3.2-.21-.33C2.5 14.46 1.5 12.4 1.5 10c0-4.41 4.04-8 9-8s9 3.59 9 8-4.04 8-9 8z"
            fill="white"
          />
        </svg>
      </button>

      <div className="absolute bottom-20 right-0 bg-gray-800 text-white text-xs px-3 py-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        0826 071 111
      </div>
    </div>
  )
}
