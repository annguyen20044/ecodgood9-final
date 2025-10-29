import { createServerSupabaseClient } from "./server"

export async function reduceProductStock(productId: number, quantity: number): Promise<boolean> {
  try {
    const supabase = await createServerSupabaseClient()

    const { error } = await supabase.rpc("reduce_product_stock", {
      product_id: productId,
      quantity,
    })

    if (error) {
      console.error("[v0] Failed to reduce stock:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("[v0] Stock reduction error:", error)
    return false
  }
}

export async function getProductsByCategory(category: string) {
  try {
    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase.from("products").select("*").eq("category", category).eq("is_active", true)

    if (error) {
      console.error("[v0] Failed to fetch products:", error)
      return []
    }

    return data
  } catch (error) {
    console.error("[v0] Product fetch error:", error)
    return []
  }
}

export async function getOrderWithItems(orderId: number) {
  try {
    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (*)
      `,
      )
      .eq("id", orderId)
      .single()

    if (error) {
      console.error("[v0] Failed to fetch order:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("[v0] Order fetch error:", error)
    return null
  }
}
