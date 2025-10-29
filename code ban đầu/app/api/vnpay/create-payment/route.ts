import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, orderInfo, customerInfo, items } = body

    if (!amount || !orderInfo) {
      return NextResponse.json({ error: "Missing required fields: amount, orderInfo" }, { status: 400 })
    }

    // VNPay Configuration
    const vnpayUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"
    const vnpayTmnCode = process.env.VNPAY_TMN_CODE || "DEMO"
    const vnpayHashSecret = process.env.VNPAY_HASH_SECRET || "DEMOSECRET"
    const vnpayReturnUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/vnpay/return`

    console.log("[v0] VNPay config:", {
      tmnCode: vnpayTmnCode,
      returnUrl: vnpayReturnUrl,
      amount: amount,
    })

    // Create VNPay params
    const vnpParams: Record<string, string | number> = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: vnpayTmnCode,
      vnp_Locale: "vn",
      vnp_CurrCode: "VND",
      vnp_TxnRef: `${Date.now()}`,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: "other",
      vnp_Amount: amount * 100, // VNPay requires amount in cents
      vnp_ReturnUrl: vnpayReturnUrl,
      vnp_IpAddr: request.headers.get("x-forwarded-for") || "127.0.0.1",
      vnp_CreateDate: new Date()
        .toISOString()
        .replace(/[-T:.Z]/g, "")
        .slice(0, 14),
    }

    // Sort params and create signature
    const sortedParams = Object.keys(vnpParams)
      .sort()
      .reduce((acc: Record<string, string | number>, key) => {
        acc[key] = vnpParams[key]
        return acc
      }, {})

    const signData = Object.entries(sortedParams)
      .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
      .join("&")

    const hmac = crypto.createHmac("sha512", vnpayHashSecret)
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex")

    const paymentUrl = `${vnpayUrl}?${signData}&vnp_SecureHash=${signed}`

    console.log("[v0] Payment URL created successfully")
    return NextResponse.json({ success: true, paymentUrl })
  } catch (error) {
    console.error("[v0] VNPay error:", error instanceof Error ? error.message : String(error))
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Payment creation failed",
      },
      { status: 500 },
    )
  }
}
