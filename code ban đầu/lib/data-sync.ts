import { createServerSupabaseClient } from "@/lib/supabase/server"

export interface SyncStatus {
  timestamp: string
  synced: boolean
  tables: Record<string, { status: "synced" | "failed"; count?: number; error?: string }>
}

export async function syncAllDataToSupabase(adminData: {
  products: any[]
  posts: any[]
  jobs: any[]
  contacts: any[]
  applications: any[]
  orders: any[]
  cartOrders: any[]
}) {
  const syncStatus: SyncStatus = {
    timestamp: new Date().toISOString(),
    synced: true,
    tables: {},
  }

  try {
    const supabase = await createServerSupabaseClient()

    // Sync products
    try {
      const productsData = adminData.products.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image_url: p.image,
        description: p.description,
        category: p.category,
        sku: p.sku,
        stock: p.stock,
        is_active: true,
        updated_at: new Date().toISOString(),
      }))

      const { error, data } = await supabase.from("products").upsert(productsData, { onConflict: "id" })

      if (error) throw error
      syncStatus.tables.products = { status: "synced", count: productsData.length }
      console.log("[v0] Synced products:", productsData.length)
    } catch (error) {
      syncStatus.tables.products = {
        status: "failed",
        error: error instanceof Error ? error.message : String(error),
      }
      syncStatus.synced = false
      console.error("[v0] Failed to sync products:", error)
    }

    // Sync blog posts
    try {
      const postsData = adminData.posts.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.title.toLowerCase().replace(/\s+/g, "-"),
        excerpt: p.excerpt,
        content: p.content,
        image_url: p.image,
        category: p.category,
        is_published: true,
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }))

      const { error } = await supabase.from("blog_posts").upsert(postsData, { onConflict: "id" })

      if (error) throw error
      syncStatus.tables.blog_posts = { status: "synced", count: postsData.length }
      console.log("[v0] Synced blog posts:", postsData.length)
    } catch (error) {
      syncStatus.tables.blog_posts = {
        status: "failed",
        error: error instanceof Error ? error.message : String(error),
      }
      syncStatus.synced = false
      console.error("[v0] Failed to sync blog posts:", error)
    }

    // Sync jobs
    try {
      const jobsData = adminData.jobs.map((j) => ({
        id: j.id,
        title: j.title,
        department: j.department,
        location: j.location,
        job_type: j.type,
        salary: j.salary,
        description: j.description,
        requirements: Array.isArray(j.requirements) ? j.requirements.join("\n") : j.requirements,
        is_active: true,
        updated_at: new Date().toISOString(),
      }))

      const { error } = await supabase.from("jobs").upsert(jobsData, { onConflict: "id" })

      if (error) throw error
      syncStatus.tables.jobs = { status: "synced", count: jobsData.length }
      console.log("[v0] Synced jobs:", jobsData.length)
    } catch (error) {
      syncStatus.tables.jobs = {
        status: "failed",
        error: error instanceof Error ? error.message : String(error),
      }
      syncStatus.synced = false
      console.error("[v0] Failed to sync jobs:", error)
    }

    // Sync contacts
    try {
      const contactsData = adminData.contacts.map((c) => ({
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        subject: c.subject,
        message: c.message,
        status: c.status,
        updated_at: new Date().toISOString(),
      }))

      if (contactsData.length > 0) {
        const { error } = await supabase.from("contacts").upsert(contactsData, { onConflict: "id" })
        if (error) throw error
      }

      syncStatus.tables.contacts = { status: "synced", count: contactsData.length }
      console.log("[v0] Synced contacts:", contactsData.length)
    } catch (error) {
      syncStatus.tables.contacts = {
        status: "failed",
        error: error instanceof Error ? error.message : String(error),
      }
      syncStatus.synced = false
      console.error("[v0] Failed to sync contacts:", error)
    }

    // Sync job applications
    try {
      const applicationsData = adminData.applications.map((a) => ({
        id: a.id,
        name: a.name,
        email: a.email,
        phone: a.phone,
        position: a.position,
        experience: a.experience,
        message: a.message,
        status: a.status,
        updated_at: new Date().toISOString(),
      }))

      if (applicationsData.length > 0) {
        const { error } = await supabase.from("job_applications").upsert(applicationsData, { onConflict: "id" })
        if (error) throw error
      }

      syncStatus.tables.job_applications = { status: "synced", count: applicationsData.length }
      console.log("[v0] Synced job applications:", applicationsData.length)
    } catch (error) {
      syncStatus.tables.job_applications = {
        status: "failed",
        error: error instanceof Error ? error.message : String(error),
      }
      syncStatus.synced = false
      console.error("[v0] Failed to sync job applications:", error)
    }

    // Sync orders
    try {
      const ordersData = adminData.orders.map((o) => ({
        id: o.id,
        order_number: `ORD-${o.id}`,
        customer_name: o.customerName,
        customer_email: o.customerEmail,
        customer_phone: o.customerPhone,
        customer_address: o.customerAddress || "",
        total_amount: o.totalAmount,
        order_status: o.orderStatus,
        payment_status: o.paymentStatus,
        payment_method: o.paymentMethod || "bank_transfer",
        notes: o.notes || "",
        updated_at: new Date().toISOString(),
      }))

      if (ordersData.length > 0) {
        const { error } = await supabase.from("orders").upsert(ordersData, { onConflict: "id" })
        if (error) throw error
      }

      syncStatus.tables.orders = { status: "synced", count: ordersData.length }
      console.log("[v0] Synced orders:", ordersData.length)
    } catch (error) {
      syncStatus.tables.orders = {
        status: "failed",
        error: error instanceof Error ? error.message : String(error),
      }
      syncStatus.synced = false
      console.error("[v0] Failed to sync orders:", error)
    }

    return { success: true, syncStatus }
  } catch (error) {
    console.error("[v0] Critical sync error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      syncStatus,
    }
  }
}

export async function loadDataFromSupabase() {
  try {
    const supabase = await createServerSupabaseClient()

    const [products, posts, jobs, contacts, applications, orders] = await Promise.all([
      supabase.from("products").select("*").eq("is_active", true),
      supabase.from("blog_posts").select("*").eq("is_published", true),
      supabase.from("jobs").select("*").eq("is_active", true),
      supabase.from("contacts").select("*"),
      supabase.from("job_applications").select("*"),
      supabase.from("orders").select("*"),
    ])

    return {
      success: true,
      data: {
        products: products.data || [],
        posts: posts.data || [],
        jobs: jobs.data || [],
        contacts: contacts.data || [],
        applications: applications.data || [],
        orders: orders.data || [],
      },
    }
  } catch (error) {
    console.error("[v0] Failed to load data from Supabase:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
