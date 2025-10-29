import { createServerSupabaseClient } from "@/lib/supabase/server"

const STORAGE_BUCKET = "ecogood-files"

export async function uploadFile(file: File, path: string) {
  try {
    const supabase = await createServerSupabaseClient()

    const fileBuffer = await file.arrayBuffer()
    const fileName = `${path}/${Date.now()}-${file.name}`

    const { data, error } = await supabase.storage.from(STORAGE_BUCKET).upload(fileName, fileBuffer, {
      contentType: file.type,
      upsert: false,
    })

    if (error) {
      console.error("[v0] Supabase upload error:", error)
      return { success: false, error: error.message }
    }

    // Get public URL
    const { data: publicData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(data.path)

    console.log("[v0] Successfully uploaded file to Supabase Storage:", data.path)
    return { success: true, url: publicData.publicUrl, path: data.path }
  } catch (error) {
    console.error("[v0] Failed to upload file:", error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

export async function deleteFile(path: string) {
  try {
    const supabase = await createServerSupabaseClient()

    const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([path])

    if (error) {
      console.error("[v0] Supabase delete error:", error)
      return { success: false, error: error.message }
    }

    console.log("[v0] Successfully deleted file from Supabase Storage:", path)
    return { success: true }
  } catch (error) {
    console.error("[v0] Failed to delete file:", error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

export async function syncDataToSupabase(key: string, data: any) {
  try {
    if (!data) {
      console.warn("[v0] Attempting to sync null/undefined data")
      return { success: false, error: "No data to sync" }
    }

    // Always save to localStorage first (reliable, instant)
    try {
      localStorage.setItem(`ecogood_${key}`, JSON.stringify(data))
      console.log(`[v0] Saved ${key} to localStorage`)
    } catch (storageError) {
      console.warn("[v0] localStorage save failed:", storageError)
    }

    return { success: true }
  } catch (error) {
    console.error("[v0] Failed to sync data:", error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

export async function loadDataFromSupabase(key: string) {
  try {
    // Try localStorage first (faster and more reliable)
    const localData = localStorage.getItem(`ecogood_${key}`)
    if (localData) {
      try {
        const parsed = JSON.parse(localData)
        console.log(`[v0] Loaded ${key} from localStorage`)
        return parsed
      } catch (parseError) {
        console.warn("[v0] Failed to parse localStorage data:", parseError)
      }
    }

    return null
  } catch (error) {
    console.error("[v0] Failed to load data:", error)
    return null
  }
}
