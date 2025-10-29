/**
 * Upload ảnh lên imgbb và trả về URL
 */
export async function uploadToImgbb(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const formData = new FormData()
    formData.append("image", file)
    formData.append("key", "ae21ac039240a7d40788bcda9a822d8e")

    const response = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: formData,
    })

    const data = await response.json()

    if (data.success && data.data?.url) {
      return { success: true, url: data.data.url }
    } else {
      return { success: false, error: data.error?.message || "Upload thất bại" }
    }
  } catch (error) {
    console.error("imgbb upload error:", error)
    return { success: false, error: "Lỗi kết nối với imgbb" }
  }
}

/**
 * Upload ảnh từ URL/base64
 */
export async function uploadToImgbbFromBase64(
  base64: string,
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // Remove data:image/... prefix if exists
    const base64Clean = base64.replace(/^data:image\/\w+;base64,/, "")

    const formData = new FormData()
    formData.append("image", base64Clean)
    formData.append("key", "ae21ac039240a7d40788bcda9a822d8e")

    const response = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: formData,
    })

    const data = await response.json()

    if (data.success && data.data?.url) {
      return { success: true, url: data.data.url }
    } else {
      return { success: false, error: data.error?.message || "Upload thất bại" }
    }
  } catch (error) {
    console.error("imgbb upload error:", error)
    return { success: false, error: "Lỗi kết nối với imgbb" }
  }
}

