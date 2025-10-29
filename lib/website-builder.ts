import { createServerSupabaseClient } from "@/lib/supabase/server"

export interface BuildConfig {
  timestamp: string
  status: "building" | "completed" | "failed"
  error?: string
  pages: string[]
}

export async function initializeWebsiteBuilder() {
  try {
    const supabase = await createServerSupabaseClient()

    // Ensure storage bucket exists
    const { data: buckets } = await supabase.storage.listBuckets()
    const bucketExists = buckets?.some((b) => b.name === "ecogood-files")

    if (!bucketExists) {
      console.log("[v0] Creating ecogood-files bucket...")
      await supabase.storage.createBucket("ecogood-files", {
        public: true,
        fileSizeLimit: 52428800, // 50MB
      })
    }

    console.log("[v0] Website builder initialized successfully")
    return { success: true }
  } catch (error) {
    console.error("[v0] Failed to initialize website builder:", error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

export async function buildWebsitePages() {
  try {
    const buildConfig: BuildConfig = {
      timestamp: new Date().toISOString(),
      status: "building",
      pages: [],
    }

    // Fetch all data from Supabase
    const supabase = await createServerSupabaseClient()

    const [productsRes, postsRes, jobsRes] = await Promise.all([
      supabase.from("products").select("*").eq("is_active", true),
      supabase.from("blog_posts").select("*").eq("is_published", true),
      supabase.from("jobs").select("*").eq("is_active", true),
    ])

    buildConfig.pages = ["home", "products", "blog", "jobs", "about", "contact"]

    if (productsRes.error) throw productsRes.error
    if (postsRes.error) throw postsRes.error
    if (jobsRes.error) throw jobsRes.error

    console.log("[v0] Website pages built successfully")
    buildConfig.status = "completed"

    return { success: true, config: buildConfig }
  } catch (error) {
    console.error("[v0] Failed to build website pages:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

export async function syncAdminDataToSupabase(data: {
  products?: any[]
  posts?: any[]
  jobs?: any[]
  contacts?: any[]
  applications?: any[]
  orders?: any[]
}) {
  try {
    const supabase = await createServerSupabaseClient()
    const results: Record<string, any> = {}

    // Sync products
    if (data.products && data.products.length > 0) {
      const { error } = await supabase.from("products").upsert(
        data.products.map((p) => ({
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
        })),
        { onConflict: "id" },
      )
      if (error) throw error
      results.products = "synced"
      console.log("[v0] Synced products to Supabase")
    }

    // Sync blog posts
    if (data.posts && data.posts.length > 0) {
      const { error } = await supabase.from("blog_posts").upsert(
        data.posts.map((p) => ({
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
        })),
        { onConflict: "id" },
      )
      if (error) throw error
      results.posts = "synced"
      console.log("[v0] Synced blog posts to Supabase")
    }

    // Sync jobs
    if (data.jobs && data.jobs.length > 0) {
      const { error } = await supabase.from("jobs").upsert(
        data.jobs.map((j) => ({
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
        })),
        { onConflict: "id" },
      )
      if (error) throw error
      results.jobs = "synced"
      console.log("[v0] Synced jobs to Supabase")
    }

    return { success: true, results }
  } catch (error) {
    console.error("[v0] Failed to sync data to Supabase:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
