import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

// PUT - Update product
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createServerSupabaseClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from("products")
      .update({
        name: body.name,
        description: body.description,
        price: body.price,
        category: body.category,
        image_url: body.image || "",
        stock: body.stock || 0,
        is_active: body.is_published !== undefined ? body.is_published : true,
        sku: body.sku,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating product:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Transform response
    const product = {
      id: data.id,
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      category: data.category,
      image: data.image_url || "",
      stock: data.stock,
      is_published: data.is_active,
      sku: data.sku,
    }

    return NextResponse.json({ success: true, product })
  } catch (error) {
    console.error("Error in PUT /api/admin/products:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Delete product
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createServerSupabaseClient()

    // Check if product exists in orders/cart first
    const { data: orderItems } = await supabase
      .from("order_items")
      .select("id")
      .eq("product_id", id)
      .limit(1)

    if (orderItems && orderItems.length > 0) {
      return NextResponse.json({ 
        error: "Không thể xóa sản phẩm này vì đã có trong đơn hàng. Vui lòng ẩn sản phẩm thay vì xóa." 
      }, { status: 400 })
    }

    const { error } = await supabase.from("products").delete().eq("id", id)

    if (error) {
      console.error("Error deleting product:", error)
      // Return more specific error message
      return NextResponse.json({ 
        error: error.message || "Không thể xóa sản phẩm"
      }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error in DELETE /api/admin/products:", error)
    return NextResponse.json({ 
      error: error.message || "Internal server error" 
    }, { status: 500 })
  }
}

