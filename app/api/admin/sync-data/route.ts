import { type NextRequest, NextResponse } from "next/server"
import { syncAllDataToSupabase, loadDataFromSupabase } from "@/lib/data-sync"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body

    if (action === "sync") {
      const result = await syncAllDataToSupabase(data)
      return NextResponse.json(result)
    }

    if (action === "load") {
      const result = await loadDataFromSupabase()
      return NextResponse.json(result)
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("[v0] Sync data error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Sync failed" }, { status: 500 })
  }
}
