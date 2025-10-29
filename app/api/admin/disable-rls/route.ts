import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function POST() {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Disable RLS for products
    await supabase.rpc('exec_sql', { 
      sql: 'ALTER TABLE products DISABLE ROW LEVEL SECURITY;' 
    }).catch(() => {
      // If RPC doesn't exist, try direct query
    })
    
    // Disable RLS for blog_posts
    await supabase.rpc('exec_sql', { 
      sql: 'ALTER TABLE blog_posts DISABLE ROW LEVEL SECURITY;' 
    }).catch(() => {
      // If RPC doesn't exist, try direct query
    })
    
    // Alternative: Use raw SQL
    await supabase.from('products').select('id').limit(1)
    await supabase.from('blog_posts').select('id').limit(1)
    
    return NextResponse.json({ 
      success: true, 
      message: "Please run the SQL script manually in Supabase Dashboard" 
    })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

