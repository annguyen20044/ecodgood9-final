import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const html = `
      <div class="ecogood-cart" style="padding: 2rem; background: #f9fafb; border-radius: 0.5rem;">
        <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem;">Shopping Cart</h2>
        <div id="cart-items" style="margin-bottom: 2rem;">
          <p style="color: #6b7280; text-align: center;">Your cart is empty</p>
        </div>
        <div style="border-top: 1px solid var(--ecogood-border); padding-top: 1rem;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; font-weight: 600;">
            <span>Total:</span>
            <span>$0.00</span>
          </div>
          <button class="ecogood-btn" style="width: 100%;">Proceed to Checkout</button>
        </div>
      </div>
    `

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 })
  }
}
