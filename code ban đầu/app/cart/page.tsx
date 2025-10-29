"use client"

import { useCart } from "@/lib/cart-context"
import { useAdmin } from "@/lib/admin-context"
import { useEffect } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { Trash2, Plus, Minus } from "lucide-react"

const formatPrice = (price: number) => {
  return (price / 1000).toLocaleString() + ".000 đ"
}

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, total, clearCart } = useCart()
  const { addCartOrder } = useAdmin()

  useEffect(() => {
    if (items.length > 0) {
      const cartData = {
        customerName: "Khách hàng",
        customerEmail: "unknown@example.com",
        customerPhone: "N/A",
        items: items,
        totalAmount: total,
        date: new Date().toLocaleDateString("vi-VN"),
        status: "active" as const,
      }
      addCartOrder(cartData)
    }
  }, [])

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-primary mb-4">Giỏ hàng của bạn</h1>
            <p className="text-foreground/70 mb-8">Giỏ hàng của bạn đang trống</p>
            <Link href="/products">
              <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 transition">
                Tiếp tục mua sắm
              </button>
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-primary mb-8">Giỏ hàng của bạn</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="bg-white border border-secondary/20 rounded-lg p-6 flex gap-4">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-primary mb-2">{item.name}</h3>
                      <p className="text-foreground/70 mb-4">{formatPrice(item.price)}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 border border-secondary/20 rounded">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-secondary/10 transition"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-4">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-secondary/10 transition"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-secondary/20 rounded-lg p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-primary mb-6">Tóm tắt đơn hàng</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Tổng tiền hàng:</span>
                    <span className="font-semibold">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Phí vận chuyển:</span>
                    <span className="font-semibold">Miễn phí</span>
                  </div>
                  <div className="border-t border-secondary/20 pt-4 flex justify-between">
                    <span className="font-bold text-primary">Tổng cộng:</span>
                    <span className="font-bold text-primary text-lg">{formatPrice(total)}</span>
                  </div>
                </div>
                <Link href="/checkout">
                  <button className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition font-semibold mb-3">
                    Tiến hành thanh toán
                  </button>
                </Link>
                <button
                  onClick={clearCart}
                  className="w-full border border-primary text-primary py-3 rounded-lg hover:bg-primary/10 transition font-semibold"
                >
                  Xóa giỏ hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
