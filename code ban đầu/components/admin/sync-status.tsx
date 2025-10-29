"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { CheckCircle, AlertCircle } from "lucide-react"

interface SyncStatusProps {
  isVisible: boolean
}

export default function SyncStatus({ isVisible }: SyncStatusProps) {
  const [status, setStatus] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isVisible) return

    const checkSyncStatus = async () => {
      try {
        const response = await fetch("/api/admin/sync-data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "load" }),
        })

        const data = await response.json()
        setStatus(data)
      } catch (error) {
        console.error("[v0] Failed to check sync status:", error)
      }
    }

    checkSyncStatus()
  }, [isVisible])

  if (!isVisible || !status) return null

  return (
    <Card className="p-4 mb-4 bg-blue-50 border-blue-200">
      <div className="flex items-start gap-3">
        {status.success ? (
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
        )}
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">
            {status.success ? "Dữ liệu đã đồng bộ" : "Lỗi đồng bộ dữ liệu"}
          </h3>
          <p className="text-sm text-foreground/70 mt-1">
            {status.success
              ? `Đã tải ${status.data?.products?.length || 0} sản phẩm, ${status.data?.posts?.length || 0} bài viết`
              : status.error}
          </p>
        </div>
      </div>
    </Card>
  )
}
