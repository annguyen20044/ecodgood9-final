import { createServerSupabaseClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const paymentStatus = searchParams.get("paymentStatus")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    // Verify admin
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: userData } = await supabase.from("users").select("is_admin").eq("id", user.id).single()

    if (!userData?.is_admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    let query = supabase.from("orders").select("*")

    if (status && status !== "all") {
      query = query.eq("order_status", status)
    }

    if (paymentStatus && paymentStatus !== "all") {
      query = query.eq("payment_status", paymentStatus)
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data,
      total: count,
      limit,
      offset,
    })
  } catch (error) {
    console.error("[v0] Orders API error:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const body = await request.json()

    const { customerName, customerEmail, customerPhone, customerAddress, items, totalAmount, paymentMethod } = body

    // Generate order number
    const orderNumber = `ORD-${Date.now()}`

    // Create order
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          order_number: orderNumber,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          customer_address: customerAddress,
          total_amount: totalAmount,
          payment_method: paymentMethod,
          payment_status: "pending",
          order_status: "pending",
        },
      ])
      .select()

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 500 })
    }

    const orderId = orderData[0].id

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: orderId,
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity,
      price: item.price,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 500 })
    }

    // Reduce product stock
    for (const item of items) {
      await supabase.rpc("reduce_product_stock", {
        product_id: item.id,
        quantity: item.quantity,
      })
    }

    return NextResponse.json({
      success: true,
      order: orderData[0],
      orderNumber,
    })
  } catch (error) {
    console.error("[v0] Order creation error:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
