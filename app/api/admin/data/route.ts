import { type NextRequest, NextResponse } from "next/server"
import { saveToBlob, loadFromBlob } from "@/lib/blob-storage"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, key, data } = body

    if (!action || !key) {
      return NextResponse.json({ success: false, error: "Missing action or key" }, { status: 400 })
    }

    if (action === "save") {
      if (!data) {
        return NextResponse.json({ success: false, error: "No data provided for save" }, { status: 400 })
      }

      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Blob save timeout")), 5000))

      try {
        const result = await Promise.race([saveToBlob(key as any, data), timeoutPromise])
        return NextResponse.json(result)
      } catch (timeoutError) {
        console.error("[v0] Blob operation timeout:", timeoutError)
        return NextResponse.json({ success: false, error: "Operation timeout" }, { status: 504 })
      }
    }

    if (action === "load") {
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Blob load timeout")), 5000))

      try {
        const result = await Promise.race([loadFromBlob(key as any), timeoutPromise])
        return NextResponse.json(result)
      } catch (timeoutError) {
        console.error("[v0] Blob operation timeout:", timeoutError)
        return NextResponse.json({ success: false, error: "Operation timeout" }, { status: 504 })
      }
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
