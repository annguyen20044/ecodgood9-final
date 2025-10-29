"use client"

import { useEffect, useState } from "react"
import { createClient } from "./client"
import type { Product, Order } from "./types"

export function useSupabaseProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const supabase = createClient()
        const { data, error: fetchError } = await supabase
          .from("products")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false })

        if (fetchError) throw fetchError
        setProducts(data || [])
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch products")
        console.error("[v0] Products fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return { products, loading, error }
}

export function useSupabaseOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const supabase = createClient()
        const { data, error: fetchError } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false })

        if (fetchError) throw fetchError
        setOrders(data || [])
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch orders")
        console.error("[v0] Orders fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  return { orders, loading, error }
}
