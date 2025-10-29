import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const html = `
      <div class="ecogood-featured" style="padding: 2rem 0;">
        <h2 style="font-size: 2rem; font-weight: 700; margin-bottom: 2rem; text-align: center;">Featured Products</h2>
        <div class="ecogood-products-grid">
          <div class="ecogood-product-card">
            <img src="/featured-product-1.jpg" alt="Featured Product 1" style="width: 100%; height: 200px; object-fit: cover; border-radius: 0.5rem; margin-bottom: 1rem;" />
            <h3 style="font-weight: 600; margin-bottom: 0.5rem;">Premium Eco Product</h3>
            <p style="color: var(--ecogood-primary); font-weight: 700; margin-bottom: 1rem;">$24.99</p>
            <button class="ecogood-btn">Add to Cart</button>
          </div>
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
    return NextResponse.json({ error: "Failed to fetch featured products" }, { status: 500 })
  }
}
