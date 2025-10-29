"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"

export function useRealtimeProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    const fetchAndSubscribe = async () => {
      try {
        // Fetch initial data
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false })

        if (error) throw error
        setProducts(data || [])

        // Subscribe to real-time changes
        const subscription = supabase
          .channel("products-changes")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "products",
              filter: "is_active=eq.true",
            },
            (payload) => {
              console.log("[v0] Product change detected:", payload.eventType)

              if (payload.eventType === "INSERT") {
                setProducts((prev) => [payload.new, ...prev])
              } else if (payload.eventType === "UPDATE") {
                setProducts((prev) => prev.map((p) => (p.id === payload.new.id ? payload.new : p)))
              } else if (payload.eventType === "DELETE") {
                setProducts((prev) => prev.filter((p) => p.id !== payload.old.id))
              }
            },
          )
          .subscribe()

        return () => {
          subscription.unsubscribe()
        }
      } catch (error) {
        console.error("[v0] Failed to fetch/subscribe to products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    const unsubscribe = fetchAndSubscribe()
    return () => {
      unsubscribe?.then((fn) => fn?.())
    }
  }, [])

  return { products, isLoading }
}

export function useRealtimePosts() {
  const [posts, setPosts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    const fetchAndSubscribe = async () => {
      try {
        // Fetch initial data
        const { data, error } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("is_published", true)
          .order("created_at", { ascending: false })

        if (error) throw error
        setPosts(data || [])

        // Subscribe to real-time changes
        const subscription = supabase
          .channel("blog-posts-changes")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "blog_posts",
              filter: "is_published=eq.true",
            },
            (payload) => {
              console.log("[v0] Blog post change detected:", payload.eventType)

              if (payload.eventType === "INSERT") {
                setPosts((prev) => [payload.new, ...prev])
              } else if (payload.eventType === "UPDATE") {
                setPosts((prev) => prev.map((p) => (p.id === payload.new.id ? payload.new : p)))
              } else if (payload.eventType === "DELETE") {
                setPosts((prev) => prev.filter((p) => p.id !== payload.old.id))
              }
            },
          )
          .subscribe()

        return () => {
          subscription.unsubscribe()
        }
      } catch (error) {
        console.error("[v0] Failed to fetch/subscribe to posts:", error)
      } finally {
        setIsLoading(false)
      }
    }

    const unsubscribe = fetchAndSubscribe()
    return () => {
      unsubscribe?.then((fn) => fn?.())
    }
  }, [])

  return { posts, isLoading }
}

export function useRealtimeOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    const fetchAndSubscribe = async () => {
      try {
        // Fetch initial data
        const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false })

        if (error) throw error
        setOrders(data || [])

        // Subscribe to real-time changes
        const subscription = supabase
          .channel("orders-changes")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "orders",
            },
            (payload) => {
              console.log("[v0] Order change detected:", payload.eventType)

              if (payload.eventType === "INSERT") {
                setOrders((prev) => [payload.new, ...prev])
              } else if (payload.eventType === "UPDATE") {
                setOrders((prev) => prev.map((o) => (o.id === payload.new.id ? payload.new : o)))
              } else if (payload.eventType === "DELETE") {
                setOrders((prev) => prev.filter((o) => o.id !== payload.old.id))
              }
            },
          )
          .subscribe()

        return () => {
          subscription.unsubscribe()
        }
      } catch (error) {
        console.error("[v0] Failed to fetch/subscribe to orders:", error)
      } finally {
        setIsLoading(false)
      }
    }

    const unsubscribe = fetchAndSubscribe()
    return () => {
      unsubscribe?.then((fn) => fn?.())
    }
  }, [])

  return { orders, isLoading }
}
