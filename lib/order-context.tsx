"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Order } from "./schemas"

interface OrderContextType {
  orders: Order[]
  addOrder: (order: Order) => void
  getOrder: (id: string) => Order | undefined
  updateOrderStatus: (id: string, status: Order["orderStatus"]) => void
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    try {
      const savedOrders = localStorage.getItem("orders")
      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders)
        if (Array.isArray(parsedOrders)) {
          const validOrders = parsedOrders.filter((order: any) => order && typeof order === "object" && order.id)
          if (validOrders.length > 0) {
            console.log("[v0] Loaded", validOrders.length, "orders from localStorage")
            setOrders(validOrders)
          }
        }
      }
    } catch (error) {
      console.error("[v0] Failed to load orders from localStorage:", error)
      localStorage.removeItem("orders")
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem("orders", JSON.stringify(orders))
      } catch (error) {
        console.error("[v0] Failed to save orders to localStorage:", error)
      }
    }
  }, [orders, mounted])

  const addOrder = (order: Order) => {
    if (!order || typeof order !== "object" || !order.id) {
      console.error("[v0] Invalid order data:", order)
      return
    }
    console.log("[v0] Adding order:", order.id)
    setOrders((prevOrders) => [...prevOrders, order])
  }

  const getOrder = (id: string) => {
    return orders.find((order) => order.id.toString() === id)
  }

  const updateOrderStatus = (id: string, status: Order["orderStatus"]) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => (order.id.toString() === id ? { ...order, orderStatus: status } : order)),
    )
  }

  return (
    <OrderContext.Provider value={{ orders, addOrder, getOrder, updateOrderStatus }}>{children}</OrderContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error("useOrders must be used within OrderProvider")
  }
  return context
}
