import { type NextRequest, NextResponse } from "next/server"
import { initializeWebsiteBuilder, buildWebsitePages, syncAdminDataToSupabase } from "@/lib/website-builder"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body

    if (action === "initialize") {
      const result = await initializeWebsiteBuilder()
      return NextResponse.json(result)
    }

    if (action === "build") {
      const result = await buildWebsitePages()
      return NextResponse.json(result)
    }

    if (action === "sync") {
      const result = await syncAdminDataToSupabase(data)
      return NextResponse.json(result)
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("[v0] Build website error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Build failed" }, { status: 500 })
  }
}
