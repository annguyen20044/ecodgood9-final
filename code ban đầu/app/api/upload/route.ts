import { uploadFile } from "@/lib/supabase-storage"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    console.log("[v0] Uploading file:", file.name)

    const result = await uploadFile(file, "products")

    if (!result.success) {
      console.error("[v0] Upload failed:", result.error)
      return NextResponse.json({ error: result.error || "Upload failed" }, { status: 500 })
    }

    console.log("[v0] Upload successful:", result.url)
    return NextResponse.json({ url: result.url })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload failed" }, { status: 500 })
  }
}
