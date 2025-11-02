import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

// GET - Fetch all products
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching products:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Transform database fields to match frontend schema
    const products = data.map((p) => {
      // Hỗ trợ cả images (mảng JSON) và image_url (string) để tương thích ngược
      let images: string[] = []
      if (p.images && typeof p.images === 'string') {
        try {
          images = JSON.parse(p.images)
        } catch {
          images = []
        }
      } else if (Array.isArray(p.images)) {
        images = p.images
      }
      
      const image = p.image_url || ""
      return {
        id: p.id,
        name: p.name,
        description: p.description,
        price: parseFloat(p.price),
        category: p.category,
        image: images.length > 0 ? images[0] : image,
        images: images.length > 0 ? images : (image ? [image] : []),
        stock: p.stock,
        is_published: p.is_active, // Map is_active to is_published for frontend
        sku: p.sku,
      }
    })

    return NextResponse.json({ products })
  } catch (error) {
    console.error("Error in GET /api/admin/products:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create new product
export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const body = await request.json()

    // Generate SKU if not provided
    const sku = body.sku || `PRD-${Date.now()}`
    
    // Hỗ trợ cả images (mảng) và image (string)
    const images = body.images && Array.isArray(body.images) ? body.images : (body.image ? [body.image] : [])
    const imageUrl = images.length > 0 ? images[0] : (body.image || "")

    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          name: body.name,
          description: body.description,
          price: body.price,
          category: body.category,
          image_url: imageUrl,
          images: images.length > 0 ? JSON.stringify(images) : null, // Lưu dưới dạng JSON string
          stock: body.stock || 0,
          is_active: body.is_published !== undefined ? body.is_published : true,
          sku: sku,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error creating product:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Transform response
    let productImages: string[] = []
    if (data.images && typeof data.images === 'string') {
      try {
        productImages = JSON.parse(data.images)
      } catch {
        productImages = []
      }
    } else if (Array.isArray(data.images)) {
      productImages = data.images
    }
    
    const product = {
      id: data.id,
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      category: data.category,
      image: productImages.length > 0 ? productImages[0] : (data.image_url || ""),
      images: productImages.length > 0 ? productImages : (data.image_url ? [data.image_url] : []),
      stock: data.stock,
      is_published: data.is_active,
      sku: data.sku,
    }

    return NextResponse.json({ success: true, product })
  } catch (error) {
    console.error("Error in POST /api/admin/products:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

