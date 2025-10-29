export function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
        
        {/* Text bên dưới */}
        <p className="text-green-600 font-medium animate-pulse whitespace-nowrap">
          Đang tải dữ liệu...
        </p>
      </div>
    </div>
  )
}
