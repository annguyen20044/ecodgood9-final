import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { syncDataToBlob, loadDataFromBlob } from "@/lib/admin-storage"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const vnpayHashSecret = process.env.VNPAY_HASH_SECRET || "DEMOSECRET"

    // Get all params from VNPay response
    const vnpParams: Record<string, string> = {}
    searchParams.forEach((value, key) => {
      vnpParams[key] = value
    })

    // Extract and remove secure hash
    const secureHash = vnpParams["vnp_SecureHash"]
    delete vnpParams["vnp_SecureHash"]
    delete vnpParams["vnp_SecureHashType"]

    // Sort and create signature
    const sortedParams = Object.keys(vnpParams)
      .sort()
      .reduce((acc: Record<string, string>, key) => {
        acc[key] = vnpParams[key]
        return acc
      }, {})

    const signData = Object.entries(sortedParams)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&")

    const hmac = crypto.createHmac("sha512", vnpayHashSecret)
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex")

    // Verify signature
    if (signed !== secureHash) {
      return NextResponse.redirect(new URL("/payment-failed", request.url))
    }

    // Check transaction status
    const responseCode = vnpParams["vnp_ResponseCode"]
    if (responseCode === "00") {
      try {
        const orderId = vnpParams["vnp_OrderInfo"] || vnpParams["vnp_TxnRef"]
        const ordersResult = await loadDataFromBlob("ORDERS")
        const orders = ordersResult?.success ? ordersResult.data : []

        if (orders && Array.isArray(orders)) {
          const updatedOrders = orders.map((order: any) => {
            if (order.orderNumber === orderId || order.id.toString() === orderId) {
              return {
                ...order,
                paymentStatus: "confirmed",
                paymentMethod: "vnpay",
                orderStatus: "processing",
                updatedAt: new Date().toISOString(),
              }
            }
            return order
          })

          await syncDataToBlob("ORDERS", updatedOrders)
          console.log("[v0] Order auto-confirmed after VNPay payment:", orderId)
        }
      } catch (error) {
        console.error("[v0] Failed to update order after VNPay payment:", error)
      }

      return NextResponse.redirect(new URL("/payment-success?method=vnpay", request.url))
    } else {
      return NextResponse.redirect(new URL("/payment-failed", request.url))
    }
  } catch (error) {
    console.error("VNPay return error:", error)
    return NextResponse.redirect(new URL("/payment-failed", request.url))
  }
}
