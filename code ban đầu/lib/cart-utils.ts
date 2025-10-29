import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function markCartAsAbandoned(cartId: number) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    })

    const { error } = await supabase
      .from("shopping_carts")
      .update({
        status: "abandoned",
        abandoned_at: new Date().toISOString(),
      })
      .eq("id", cartId)

    if (error) throw error
    return true
  } catch (error) {
    console.error("[v0] Error marking cart as abandoned:", error)
    return false
  }
}

export async function reactivateCart(cartId: number) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    })

    const { error } = await supabase
      .from("shopping_carts")
      .update({
        status: "active",
        abandoned_at: null,
      })
      .eq("id", cartId)

    if (error) throw error
    return true
  } catch (error) {
    console.error("[v0] Error reactivating cart:", error)
    return false
  }
}

export async function getActiveCarts() {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    })

    const { data, error } = await supabase
      .from("shopping_carts")
      .select("*")
      .eq("status", "active")
      .is("abandoned_at", null)

    if (error) throw error
    return data
  } catch (error) {
    console.error("[v0] Error fetching active carts:", error)
    return []
  }
}

export async function getAbandonedCarts() {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    })

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const { data, error } = await supabase
      .from("shopping_carts")
      .select("*")
      .eq("status", "abandoned")
      .lt("abandoned_at", thirtyDaysAgo.toISOString())

    if (error) throw error
    return data
  } catch (error) {
    console.error("[v0] Error fetching abandoned carts:", error)
    return []
  }
}
