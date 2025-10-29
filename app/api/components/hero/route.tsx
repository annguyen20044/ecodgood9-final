import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const html = `
      <div class="ecogood-hero" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 4rem 2rem; text-align: center; border-radius: 0.5rem;">
        <h1 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem;">Welcome to EcoGood</h1>
        <p style="font-size: 1.125rem; margin-bottom: 2rem; max-width: 600px; margin-left: auto; margin-right: auto;">Sustainable products for a better tomorrow</p>
        <button class="ecogood-btn" style="background-color: white; color: #10b981; font-weight: 600;">Shop Now</button>
      </div>
    `

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch hero" }, { status: 500 })
  }
}
