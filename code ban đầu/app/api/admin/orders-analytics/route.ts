import { createServerSupabaseClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()

    // Fetch all orders with their items
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select(
        `
        id,
        order_number,
        customer_name,
        customer_email,
        customer_phone,
        total_amount,
        payment_status,
        order_status,
        payment_method,
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

    if (ordersError) {
      console.error("[v0] Failed to fetch orders:", ordersError)
      return NextResponse.json({ error: ordersError.message }, { status: 500 })
    }

    // Fetch shopping carts to count as pending orders
    const { data: carts, error: cartsError } = await supabase.from("shopping_carts").select("id")

    if (cartsError) {
      console.error("[v0] Failed to fetch carts:", cartsError)
    }

    // Calculate analytics
    const totalOrders = (orders?.length || 0) + (carts?.length || 0)

    // Revenue should ONLY include paid or confirmed orders
    const totalRevenue =
      orders?.reduce((sum: number, order: any) => {
        if (order.payment_status === "paid" || order.payment_status === "confirmed") {
          return sum + (order.total_amount || 0)
        }
        return sum
      }, 0) || 0

    const paidOrders =
      orders?.filter((o: any) => o.payment_status === "paid" || o.payment_status === "confirmed").length || 0
    const pendingOrders = orders?.filter((o: any) => o.payment_status === "pending").length || 0

    // Payment method breakdown - only count paid orders
    const paidOrdersOnly =
      orders?.filter((o: any) => o.payment_status === "paid" || o.payment_status === "confirmed") || []
    const paymentMethodBreakdown = {
      vnpay: paidOrdersOnly.filter((o: any) => o.payment_method === "vnpay").length || 0,
      bank_transfer: paidOrdersOnly.filter((o: any) => o.payment_method === "bank_transfer").length || 0,
      cod: paidOrdersOnly.filter((o: any) => o.payment_method === "cod").length || 0,
    }

    // Order status breakdown
    const orderStatusBreakdown = {
      pending: orders?.filter((o: any) => o.order_status === "pending").length || 0,
      processing: orders?.filter((o: any) => o.order_status === "processing").length || 0,
      shipped: orders?.filter((o: any) => o.order_status === "shipped").length || 0,
      delivered: orders?.filter((o: any) => o.order_status === "delivered").length || 0,
      cancelled: orders?.filter((o: any) => o.order_status === "cancelled").length || 0,
    }

    console.log(
      "[v0] Analytics calculated - Total Orders:",
      totalOrders,
      "Total Revenue:",
      totalRevenue,
      "Paid Orders:",
      paidOrders,
    )

    return NextResponse.json({
      success: true,
      analytics: {
        totalOrders,
        totalRevenue,
        paidOrders,
        pendingOrders,
        paymentMethodBreakdown,
        orderStatusBreakdown,
      },
    })
  } catch (error) {
    console.error("[v0] Analytics fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
