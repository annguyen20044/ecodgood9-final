import { createServerSupabaseClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get or create cart
    let { data: cart, error: cartError } = await supabase
      .from("shopping_carts")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (cartError && cartError.code === "PGRST116") {
      // Cart doesn't exist, create it
      const { data: newCart, error: createError } = await supabase
        .from("shopping_carts")
        .insert([{ user_id: user.id }])
        .select()

      if (createError) {
        return NextResponse.json({ error: createError.message }, { status: 500 })
      }

      cart = newCart[0]
    } else if (cartError) {
      return NextResponse.json({ error: cartError.message }, { status: 500 })
    }

    // Get cart items with product details
    const { data: items, error: itemsError } = await supabase
      .from("cart_items")
      .select(
        `
        *,
        products (id, name, price, image_url, stock)
      `,
      )
      .eq("cart_id", cart.id)

    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      cart: { ...cart, items },
    })
  } catch (error) {
    console.error("[v0] Cart fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 })
  }
}
