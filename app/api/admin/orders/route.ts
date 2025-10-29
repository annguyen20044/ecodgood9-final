import { createServerSupabaseClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const paymentStatus = searchParams.get("paymentStatus")
    const search = searchParams.get("search")

    const supabase = await createServerSupabaseClient()

    let query = supabase
      .from("orders")
      .select(
        `
        id,
        order_number,
        customer_name,
        customer_email,
        customer_phone,
        customer_address,
        total_amount,
        payment_method,
        payment_status,
        order_status,
        created_at,
        updated_at,
        notes,
        order_items (
          id,
          product_id,
          product_name,
          quantity,
          price
        )
      `,
      )
      .order("created_at", { ascending: false })

    if (status && status !== "all") {
      query = query.eq("order_status", status)
    }

    if (paymentStatus && paymentStatus !== "all") {
      query = query.eq("payment_status", paymentStatus)
    }

    const { data: orders, error } = await query

    if (error) {
      console.error("[v0] Failed to fetch orders from Supabase:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    let filteredOrders = orders || []

    if (search) {
      const searchLower = search.toLowerCase()
      filteredOrders = filteredOrders.filter(
        (order: any) =>
          order.customer_name.toLowerCase().includes(searchLower) ||
          order.customer_email.toLowerCase().includes(searchLower) ||
          order.customer_phone.includes(search) ||
          order.order_number.toLowerCase().includes(searchLower),
      )
    }

    // Transform data to match expected format
    const transformedOrders = filteredOrders.map((order: any) => ({
      id: order.id,
      orderNumber: order.order_number,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      customerPhone: order.customer_phone,
      customerAddress: order.customer_address,
      totalAmount: order.total_amount,
      paymentMethod: order.payment_method,
      paymentStatus: order.payment_status,
      orderStatus: order.order_status,
      date: new Date(order.created_at).toLocaleDateString("vi-VN"),
      items: order.order_items || [],
      notes: order.notes,
    }))

    return NextResponse.json({ success: true, data: transformedOrders })
  } catch (error) {
    console.error("[v0] Failed to fetch orders:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to fetch orders" },
      { status: 500 },
    )
  }
}
