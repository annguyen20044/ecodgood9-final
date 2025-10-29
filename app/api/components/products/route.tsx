import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = searchParams.get("limit") || "12"
    const category = searchParams.get("category") || ""

    // Mock data - replace with actual database query
    const products = [
      {
        id: 1,
        name: "Eco Coffee",
        price: 15.99,
        image: "/eco-coffee.jpg",
        category: "coffee",
      },
      {
        id: 2,
        name: "Green Tea",
        price: 12.99,
        image: "/green-tea.jpg",
        category: "tea",
      },
    ]

    const html = `
      <div class="ecogood-products-grid">
        ${products
          .slice(0, Number.parseInt(limit))
          .map(
            (product) => `
          <div class="ecogood-product-card">
            <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 0.5rem; margin-bottom: 1rem;" />
            <h3 style="font-weight: 600; margin-bottom: 0.5rem;">${product.name}</h3>
            <p style="color: var(--ecogood-primary); font-weight: 700; margin-bottom: 1rem;">$${product.price}</p>
            <button class="ecogood-btn">Add to Cart</button>
          </div>
        `,
          )
          .join("")}
      </div>
    `

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
