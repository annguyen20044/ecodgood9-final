import { createServerSupabaseClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    const { data: orders, error } = await supabase
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
        payment_status,
        order_status,
        created_at,
        order_items (
          id,
          product_name,
          quantity,
          price
        )
      `,
      )
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Failed to fetch cart orders:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Transform data to match admin dashboard format
    const cartOrders = orders.map((order: any) => ({
      id: order.id,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      customerPhone: order.customer_phone,
      items: order.order_items.map((item: any) => ({
        id: item.id,
        name: item.product_name,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: order.total_amount,
      date: new Date(order.created_at).toLocaleDateString("vi-VN"),
      status: order.order_status === "pending" ? "active" : "abandoned",
    }))

    return NextResponse.json({ success: true, cartOrders })
  } catch (error) {
    console.error("[v0] Cart orders fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch cart orders" }, { status: 500 })
  }
}
