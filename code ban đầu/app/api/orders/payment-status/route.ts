import { type NextRequest, NextResponse } from "next/server"
import { loadDataFromBlob, syncDataToBlob } from "@/lib/admin-storage"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get("orderId")
    const method = searchParams.get("method")

    if (!orderId || !method) {
      return NextResponse.json({ error: "Missing orderId or method" }, { status: 400 })
    }

    // Load orders from blob storage
    const ordersData = await loadDataFromBlob("ORDERS")
    const orders = ordersData?.success ? ordersData.data : []
    const order = orders?.find((o: any) => o.orderNumber === orderId || o.id === Number.parseInt(orderId))

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const paymentStatus = {
      orderId,
      method: order.paymentMethod,
      status: order.paymentStatus,
      message:
        order.paymentMethod === "bank_transfer"
          ? "Chờ xác nhận chuyển khoản"
          : order.paymentMethod === "cod"
            ? "Chờ giao hàng và thanh toán"
            : "Đã thanh toán qua VNPay",
    }

    return NextResponse.json({ success: true, paymentStatus })
  } catch (error) {
    console.error("[v0] Payment status error:", error)
    return NextResponse.json({ error: "Failed to fetch payment status" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, status, method } = body

    if (!orderId || !status || !method) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!["pending", "confirmed", "failed"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    // Load and update orders
    const ordersData = await loadDataFromBlob("ORDERS")
    const orders = ordersData?.success ? ordersData.data : []
    const orderIndex = orders?.findIndex((o: any) => o.orderNumber === orderId || o.id === Number.parseInt(orderId))

    if (orderIndex === -1 || orderIndex === undefined) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Update payment status
    orders[orderIndex].paymentStatus = status
    orders[orderIndex].updatedAt = new Date().toISOString()

    // Sync back to blob
    await syncDataToBlob("ORDERS", orders)

    const updatedPayment = {
      orderId,
      method,
      status,
      updatedAt: new Date().toISOString(),
    }

    console.log("[v0] Updated payment status:", updatedPayment)

    return NextResponse.json({ success: true, payment: updatedPayment })
  } catch (error) {
    console.error("[v0] Payment status update error:", error)
    return NextResponse.json({ error: "Failed to update payment status" }, { status: 500 })
  }
}
