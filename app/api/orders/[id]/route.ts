import { createServerSupabaseClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createServerSupabaseClient()
    const orderId = Number.parseInt(params.id)

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
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Transform response to match frontend format
    const order = {
      id: data.id,
      order_number: data.order_number,
      customer_name: data.customer_name,
      customer_email: data.customer_email,
      customer_phone: data.customer_phone,
      customer_address: data.customer_address,
      totalAmount: parseFloat(data.total_amount || 0),
      payment_method: data.payment_method,
      payment_status: data.payment_status,
      order_status: data.order_status,
      notes: data.notes,
      created_at: data.created_at,
      items: data.order_items || [],
    }

    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error("[v0] Order fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createServerSupabaseClient()
    const orderId = Number.parseInt(params.id)
    const { orderStatus, paymentStatus } = await request.json()

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

    const updateData: any = { updated_at: new Date().toISOString() }
    if (orderStatus) updateData.order_status = orderStatus
    if (paymentStatus) updateData.payment_status = paymentStatus

    const { data, error } = await supabase.from("orders").update(updateData).eq("id", orderId).select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: data[0] })
  } catch (error) {
    console.error("[v0] Order update error:", error)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}
