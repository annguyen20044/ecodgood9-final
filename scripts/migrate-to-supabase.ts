import { createServerSupabaseClient } from "@/lib/supabase/server"
import { loadDataFromBlob } from "@/lib/admin-storage"

/**
 * Migration script to transfer data from Blob Storage to Supabase
 * Run this script once to migrate all existing data
 */

async function migrateProducts() {
  console.log("[v0] Starting products migration...")
  try {
    const supabase = await createServerSupabaseClient()
    const blobProducts = await loadDataFromBlob("PRODUCTS")

    if (!blobProducts || !Array.isArray(blobProducts)) {
      console.log("[v0] No products found in Blob storage")
      return
    }

    // Transform blob products to Supabase format
    const productsToInsert = blobProducts.map((product: any) => ({
      name: product.name,
      description: product.description,
      price: product.price,
      sku: product.sku,
      category: product.category,
      image_url: product.image,
      stock: product.stock,
      is_active: true,
    }))

    const { data, error } = await supabase.from("products").insert(productsToInsert).select()

    if (error) {
      console.error("[v0] Products migration error:", error)
      return
    }

    console.log(`[v0] Successfully migrated ${data.length} products`)
  } catch (error) {
    console.error("[v0] Products migration failed:", error)
  }
}

async function migrateOrders() {
  console.log("[v0] Starting orders migration...")
  try {
    const supabase = await createServerSupabaseClient()
    const blobOrders = await loadDataFromBlob("ORDERS")

    if (!blobOrders || !Array.isArray(blobOrders)) {
      console.log("[v0] No orders found in Blob storage")
      return
    }

    // Transform blob orders to Supabase format
    const ordersToInsert = blobOrders.map((order: any) => ({
      order_number: order.orderNumber,
      customer_name: order.customerName,
      customer_email: order.customerEmail,
      customer_phone: order.customerPhone,
      customer_address: order.customerAddress,
      total_amount: order.totalAmount,
      payment_method: order.paymentMethod,
      payment_status: order.paymentStatus,
      order_status: order.orderStatus,
      notes: order.notes || null,
      created_at: order.date,
      updated_at: order.date,
    }))

    const { data: insertedOrders, error: ordersError } = await supabase.from("orders").insert(ordersToInsert).select()

    if (ordersError) {
      console.error("[v0] Orders migration error:", ordersError)
      return
    }

    console.log(`[v0] Successfully migrated ${insertedOrders.length} orders`)

    // Migrate order items
    const orderItemsToInsert: any[] = []
    blobOrders.forEach((order: any, index: number) => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item: any) => {
          orderItemsToInsert.push({
            order_id: insertedOrders[index].id,
            product_id: item.productId,
            product_name: item.productName,
            quantity: item.quantity,
            price: item.price,
          })
        })
      }
    })

    if (orderItemsToInsert.length > 0) {
      const { data: items, error: itemsError } = await supabase.from("order_items").insert(orderItemsToInsert).select()

      if (itemsError) {
        console.error("[v0] Order items migration error:", itemsError)
        return
      }

      console.log(`[v0] Successfully migrated ${items.length} order items`)
    }
  } catch (error) {
    console.error("[v0] Orders migration failed:", error)
  }
}

async function migratePosts() {
  console.log("[v0] Starting blog posts migration...")
  try {
    const supabase = await createServerSupabaseClient()
    const blobPosts = await loadDataFromBlob("POSTS")

    if (!blobPosts || !Array.isArray(blobPosts)) {
      console.log("[v0] No posts found in Blob storage")
      return
    }

    // Transform blob posts to Supabase format
    const postsToInsert = blobPosts.map((post: any) => ({
      title: post.title,
      slug: post.title.toLowerCase().replace(/\s+/g, "-"),
      excerpt: post.excerpt,
      content: post.content,
      image_url: post.image,
      category: post.category,
      is_published: true,
      published_at: new Date().toISOString(),
    }))

    const { data, error } = await supabase.from("blog_posts").insert(postsToInsert).select()

    if (error) {
      console.error("[v0] Posts migration error:", error)
      return
    }

    console.log(`[v0] Successfully migrated ${data.length} blog posts`)
  } catch (error) {
    console.error("[v0] Posts migration failed:", error)
  }
}

async function migrateContacts() {
  console.log("[v0] Starting contacts migration...")
  try {
    const supabase = await createServerSupabaseClient()
    const blobContacts = await loadDataFromBlob("CONTACTS")

    if (!blobContacts || !Array.isArray(blobContacts)) {
      console.log("[v0] No contacts found in Blob storage")
      return
    }

    // Transform blob contacts to Supabase format
    const contactsToInsert = blobContacts.map((contact: any) => ({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      subject: contact.subject,
      message: contact.message,
      status: contact.status,
    }))

    const { data, error } = await supabase.from("contacts").insert(contactsToInsert).select()

    if (error) {
      console.error("[v0] Contacts migration error:", error)
      return
    }

    console.log(`[v0] Successfully migrated ${data.length} contacts`)
  } catch (error) {
    console.error("[v0] Contacts migration failed:", error)
  }
}

async function migrateApplications() {
  console.log("[v0] Starting job applications migration...")
  try {
    const supabase = await createServerSupabaseClient()
    const blobApplications = await loadDataFromBlob("APPLICATIONS")

    if (!blobApplications || !Array.isArray(blobApplications)) {
      console.log("[v0] No applications found in Blob storage")
      return
    }

    // Transform blob applications to Supabase format
    const applicationsToInsert = blobApplications.map((app: any) => ({
      name: app.name,
      email: app.email,
      phone: app.phone,
      position: app.position,
      experience: app.experience,
      message: app.message,
      status: app.status,
    }))

    const { data, error } = await supabase.from("job_applications").insert(applicationsToInsert).select()

    if (error) {
      console.error("[v0] Applications migration error:", error)
      return
    }

    console.log(`[v0] Successfully migrated ${data.length} job applications`)
  } catch (error) {
    console.error("[v0] Applications migration failed:", error)
  }
}

async function migrateJobs() {
  console.log("[v0] Starting jobs migration...")
  try {
    const supabase = await createServerSupabaseClient()
    const blobJobs = await loadDataFromBlob("JOBS")

    if (!blobJobs || !Array.isArray(blobJobs)) {
      console.log("[v0] No jobs found in Blob storage")
      return
    }

    // Transform blob jobs to Supabase format
    const jobsToInsert = blobJobs.map((job: any) => ({
      title: job.title,
      department: job.department,
      location: job.location,
      job_type: job.type,
      salary: job.salary,
      description: job.description,
      requirements: job.requirements.join("\n"),
      is_active: true,
    }))

    const { data, error } = await supabase.from("jobs").insert(jobsToInsert).select()

    if (error) {
      console.error("[v0] Jobs migration error:", error)
      return
    }

    console.log(`[v0] Successfully migrated ${data.length} jobs`)
  } catch (error) {
    console.error("[v0] Jobs migration failed:", error)
  }
}

async function runMigration() {
  console.log("[v0] ========================================")
  console.log("[v0] Starting Blob to Supabase Migration")
  console.log("[v0] ========================================")

  await migrateProducts()
  await migrateOrders()
  await migratePosts()
  await migrateContacts()
  await migrateApplications()
  await migrateJobs()

  console.log("[v0] ========================================")
  console.log("[v0] Migration completed!")
  console.log("[v0] ========================================")
}

// Run migration
runMigration().catch(console.error)
