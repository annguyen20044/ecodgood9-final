// Maintains same function signatures for backward compatibility

const STORAGE_KEYS = {
  PRODUCTS: "admin-data/products.json",
  POSTS: "admin-data/posts.json",
  CONTACTS: "admin-data/contacts.json",
  APPLICATIONS: "admin-data/applications.json",
  ORDERS: "admin-data/orders.json",
  CART_ORDERS: "admin-data/cart-orders.json",
  JOBS: "admin-data/jobs.json",
  MEDIA: "admin-data/media.json",
  ADMIN_SETTINGS: "admin-data/settings.json",
}

export async function saveToBlob(key: keyof typeof STORAGE_KEYS, data: any) {
  try {
    const blobKey = STORAGE_KEYS[key]
    const serialized = JSON.stringify(data)
    if (!serialized || serialized.length === 0) {
      throw new Error("Data serialization resulted in empty string")
    }

    // Save to localStorage (primary storage)
    try {
      localStorage.setItem(`ecogood_${key}`, serialized)
      console.log(`[v0] Successfully saved ${key} to localStorage`)
    } catch (storageError) {
      console.warn("[v0] localStorage save failed:", storageError)
    }

    return { success: true }
  } catch (error) {
    console.error(`[v0] Failed to save ${key}:`, error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

export async function loadFromBlob(key: keyof typeof STORAGE_KEYS) {
  try {
    const blobKey = STORAGE_KEYS[key]

    let lastError: Error | null = null
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        // Try localStorage first
        const localData = localStorage.getItem(`ecogood_${key}`)

        if (!localData) {
          console.log(`[v0] No data found for ${key} in localStorage`)
          return { success: false, data: null, error: "No data found" }
        }

        const text = localData
        if (!text || text.trim().length === 0) {
          console.warn(`[v0] Empty localStorage content for ${key}`)
          return { success: false, data: null, error: "Content is empty" }
        }

        let data: any
        try {
          data = JSON.parse(text)
        } catch (parseError) {
          console.error(`[v0] Failed to parse JSON for ${key}:`, parseError)
          throw parseError
        }

        if (!data || typeof data !== "object") {
          console.warn(`[v0] Invalid data structure for ${key}:`, typeof data)
          return { success: false, data: null, error: "Invalid data structure" }
        }

        console.log(`[v0] Successfully loaded ${key} from localStorage (attempt ${attempt})`)
        return { success: true, data }
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))
        if (attempt < 3) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
        }
      }
    }

    console.error(`[v0] Failed to load ${key} after 3 attempts:`, lastError)
    return { success: false, data: null, error: lastError?.message || "Failed to load data" }
  } catch (error) {
    console.error(`[v0] Unexpected error loading ${key}:`, error)
    return { success: false, data: null, error: error instanceof Error ? error.message : String(error) }
  }
}

export async function deleteFromBlob(key: keyof typeof STORAGE_KEYS) {
  try {
    // Remove from localStorage
    localStorage.removeItem(`ecogood_${key}`)
    console.log(`[v0] Successfully deleted ${key} from localStorage`)
    return { success: true }
  } catch (error) {
    console.error(`[v0] Failed to delete ${key}:`, error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}
