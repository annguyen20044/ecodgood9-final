import { createServerSupabaseClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error("[v0] Invalid JSON in request body:", parseError)
      return NextResponse.json({ error: "Invalid request body - must be valid JSON" }, { status: 400 })
    }

    const { customerInfo, items, total, paymentMethod = "vnpay" } = body

    // Validate required fields
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in order" }, { status: 400 })
    }

    if (!customerInfo) {
      return NextResponse.json({ error: "Missing customer info" }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()

    const order = {
      order_number: `ORD-${Date.now()}`,
      customer_name: customerInfo.fullName || "",
      customer_email: customerInfo.email || "",
      customer_phone: customerInfo.phone || "",
      customer_address: `${customerInfo.address}, ${customerInfo.district}, ${customerInfo.city}`,
      total_amount: total,
      payment_status: "pending",
      payment_method: paymentMethod,
      order_status: "pending",
      notes: "",
    }

    const { data: createdOrder, error: orderError } = await supabase.from("orders").insert([order]).select()

    if (orderError) {
      console.error("[v0] Failed to create order in Supabase:", orderError)
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }

    const orderId = createdOrder[0].id

    const orderItems = items.map((item: any) => ({
      order_id: orderId,
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity,
      price: item.price,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      console.error("[v0] Failed to create order items in Supabase:", itemsError)
      return NextResponse.json({ error: "Failed to create order items" }, { status: 500 })
    }

    console.log("[v0] Order created in Supabase:", createdOrder[0].order_number)

    return NextResponse.json({ success: true, order: createdOrder[0] }, { status: 200 })
  } catch (error) {
    console.error("[v0] Order creation error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Order creation failed",
      },
      { status: 500 },
    )
  }
}
