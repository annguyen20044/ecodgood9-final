import { type NextRequest, NextResponse } from "next/server"
import { loadDataFromBlob, syncDataToBlob } from "@/lib/admin-storage"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, paymentMethod, status } = body

    if (!orderId || !paymentMethod || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!["bank_transfer", "cod"].includes(paymentMethod)) {
      return NextResponse.json({ error: "Invalid payment method" }, { status: 400 })
    }

    if (!["pending", "confirmed", "failed"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    // Load orders from blob storage
    const ordersResult = await loadDataFromBlob("ORDERS")
    const orders = ordersResult?.success ? ordersResult.data : []

    const orderIndex = orders?.findIndex((o: any) => o.orderNumber === orderId || o.id.toString() === orderId)

    if (orderIndex === -1 || orderIndex === undefined) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Update order payment status
    const order = orders[orderIndex]
    orders[orderIndex] = {
      ...order,
      paymentStatus: status,
      paymentMethod: paymentMethod,
      orderStatus: status === "confirmed" ? "processing" : "pending",
      updatedAt: new Date().toISOString(),
    }

    // Sync back to blob storage
    await syncDataToBlob("ORDERS", orders)

    console.log(`[v0] Payment confirmed for order ${orderId}: ${paymentMethod} - ${status}`)

    return NextResponse.json({
      success: true,
      order: orders[orderIndex],
    })
  } catch (error) {
    console.error("[v0] Payment confirmation error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to confirm payment" },
      { status: 500 },
    )
  }
}
