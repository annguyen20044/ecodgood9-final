import { createServerSupabaseClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { orderStatus, paymentStatus } = await request.json()
    const orderId = Number.parseInt(params.id)

    if (!orderId) {
      return NextResponse.json({ success: false, error: "Invalid order ID" }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()

    const updateData: any = {}
    if (orderStatus) updateData.order_status = orderStatus
    if (paymentStatus) updateData.payment_status = paymentStatus

    const { data: updatedOrder, error } = await supabase.from("orders").update(updateData).eq("id", orderId).select()

    if (error) {
      console.error("[v0] Failed to update order in Supabase:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    if (!updatedOrder || updatedOrder.length === 0) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    console.log("[v0] Order updated in Supabase:", orderId)

    return NextResponse.json({ success: true, data: updatedOrder[0] })
  } catch (error) {
    console.error("[v0] Failed to update order:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to update order" },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = Number.parseInt(params.id)

    if (!orderId) {
      return NextResponse.json({ success: false, error: "Invalid order ID" }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()

    const { error } = await supabase.from("orders").delete().eq("id", orderId)

    if (error) {
      console.error("[v0] Failed to delete order from Supabase:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    console.log("[v0] Order deleted from Supabase:", orderId)

    return NextResponse.json({ success: true, message: "Order deleted successfully" })
  } catch (error) {
    console.error("[v0] Failed to delete order:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to delete order" },
      { status: 500 },
    )
  }
}
