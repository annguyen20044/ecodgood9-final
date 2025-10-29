export async function syncDataToBlob(key: string, data: any) {
  try {
    if (!data) {
      console.warn("[v0] Attempting to sync null/undefined data")
      return { success: false, error: "No data to sync" }
    }

    // Save to localStorage (reliable, instant)
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

export async function loadDataFromBlob(key: string) {
  try {
    // Load from localStorage
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
