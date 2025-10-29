import { createServerSupabaseClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { action, cartData, customerInfo } = await request.json()

    if (action === "update_cart_order") {
      // Update or create cart order record for admin dashboard
      const { data, error } = await supabase.from("cart_items").select("cart_id").limit(1)

      if (error && error.code !== "PGRST116") {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      // Store cart metadata for admin tracking
      const cartMetadata = {
        customerName: customerInfo?.fullName || "Khách hàng",
        customerEmail: customerInfo?.email || "unknown@example.com",
        customerPhone: customerInfo?.phone || "N/A",
        customerAddress: customerInfo?.address || "",
        totalAmount: cartData.total,
        itemCount: cartData.items?.length || 0,
        lastUpdated: new Date().toISOString(),
        status: "active",
      }

      // Store in a metadata table or use JSON column
      // For now, we'll store it in localStorage on client and sync via this endpoint
      return NextResponse.json({ success: true, metadata: cartMetadata })
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("[v0] Cart sync error:", error)
    return NextResponse.json({ error: "Failed to sync cart" }, { status: 500 })
  }
}
