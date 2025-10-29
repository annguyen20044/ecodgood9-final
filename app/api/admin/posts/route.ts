import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

// GET - Fetch all blog posts
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching blog posts:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Transform database fields to match frontend schema
    const posts = data.map((p) => ({
      id: p.id,
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      image: p.image_url || "",
      category: p.category || "Chung",
      date: new Date(p.created_at).toLocaleDateString("vi-VN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      is_published: p.is_published,
    }))

    return NextResponse.json({ posts })
  } catch (error) {
    console.error("Error in GET /api/admin/posts:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create new blog post
export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const body = await request.json()

    // Generate slug from title
    const slug = body.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      + `-${Date.now()}`

    const { data, error } = await supabase
      .from("blog_posts")
      .insert([
        {
          title: body.title,
          slug: slug,
          excerpt: body.excerpt,
          content: body.content,
          image_url: body.image || "",
          category: body.category || "Chung",
          is_published: body.is_published !== undefined ? body.is_published : true,
          published_at: body.is_published ? new Date().toISOString() : null,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error creating blog post:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Transform response
    const post = {
      id: data.id,
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      image: data.image_url || "",
      category: data.category || "Chung",
      date: new Date(data.created_at).toLocaleDateString("vi-VN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      is_published: data.is_published,
    }

    return NextResponse.json({ success: true, post })
  } catch (error) {
    console.error("Error in POST /api/admin/posts:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

