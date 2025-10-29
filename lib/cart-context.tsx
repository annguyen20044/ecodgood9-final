"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { toast } from "sonner"

export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

interface CartContextType {
  items: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        if (Array.isArray(parsedCart) && parsedCart.length > 0) {
          // Validate each item has required fields
          const validItems = parsedCart.filter(
            (item: any) => item && typeof item === "object" && item.id && item.name && item.price !== undefined,
          )
          if (validItems.length > 0) {
            console.log("[v0] Loaded cart with", validItems.length, "items")
            setItems(validItems)
          }
        }
      }
    } catch (error) {
      console.error("[v0] Error loading cart from localStorage:", error)
      localStorage.removeItem("cart")
    }
    setMounted(true)
  }, [])

  // Save cart to localStorage and sync to Supabase whenever it changes
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem("cart", JSON.stringify(items))

        syncCartToSupabase(items)
      } catch (error) {
        console.error("[v0] Error saving cart to localStorage:", error)
      }
    }
  }, [items, mounted])

  const syncCartToSupabase = async (cartItems: CartItem[]) => {
    try {
      await fetch("/api/cart/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_cart_order",
          cartData: {
            items: cartItems,
            total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
          },
        }),
      })
    } catch (error) {
      console.warn("[v0] Failed to sync cart to Supabase:", error)
      // Don't block user experience if sync fails
    }
  }

  const addToCart = (item: CartItem) => {
    if (!item || typeof item !== "object") {
      console.error("[v0] Invalid item data:", item)
      toast.error("Không thể thêm sản phẩm vào giỏ hàng", {
        position: "bottom-right",
        duration: 2000,
      })
      return
    }

    if (!item.id || !item.name || item.price === undefined || item.quantity === undefined) {
      console.error("[v0] Missing required item fields:", item)
      toast.error("Dữ liệu sản phẩm không hợp lệ", {
        position: "bottom-right",
        duration: 2000,
      })
      return
    }

    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id)
      if (existingItem) {
        toast.success(`Đã thêm ${item.name} vào giỏ hàng`, {
          position: "bottom-right",
          duration: 2000,
        })
        return prevItems.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i))
      }
      toast.success(`Đã thêm ${item.name} vào giỏ hàng`, {
        position: "bottom-right",
        duration: 2000,
      })
      return [...prevItems, item]
    })
  }

  const removeFromCart = (id: number) => {
    setItems((prevItems) => prevItems.filter((i) => i.id !== id))
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
    } else {
      setItems((prevItems) => prevItems.map((i) => (i.id === id ? { ...i, quantity } : i)))
    }
  }

  const clearCart = () => {
    setItems([])
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within CartProvider")
  }
  return context
}
