import { createServerSupabaseClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { productId, quantity } = await request.json()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get or create cart
    let { data: cart } = await supabase.from("shopping_carts").select("*").eq("user_id", user.id).single()

    if (!cart) {
      const { data: newCart } = await supabase
        .from("shopping_carts")
        .insert([{ user_id: user.id }])
        .select()
      cart = newCart[0]
    }

    // Get product price
    const { data: product } = await supabase.from("products").select("price").eq("id", productId).single()

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Check if item already in cart
    const { data: existingItem } = await supabase
      .from("cart_items")
      .select("*")
      .eq("cart_id", cart.id)
      .eq("product_id", productId)
      .single()

    if (existingItem) {
      // Update quantity
      const { data, error } = await supabase
        .from("cart_items")
        .update({
          quantity: existingItem.quantity + quantity,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingItem.id)
        .select()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ success: true, item: data[0] })
    } else {
      // Add new item
      const { data, error } = await supabase
        .from("cart_items")
        .insert([
          {
            cart_id: cart.id,
            product_id: productId,
            quantity,
            price_at_time: product.price,
          },
        ])
        .select()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ success: true, item: data[0] })
    }
  } catch (error) {
    console.error("[v0] Add to cart error:", error)
    return NextResponse.json({ error: "Failed to add item to cart" }, { status: 500 })
  }
}
