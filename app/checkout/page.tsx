"use client"

import type React from "react"

import { useState } from "react"
import { useCart } from "@/lib/cart-context"
import { useOrders } from "@/lib/order-context"
import { useAdmin } from "@/lib/admin-context"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CreditCard, Banknote, Truck } from "lucide-react"

const formatPrice = (price: number) => {
  return (price / 1000).toLocaleString() + ".000 đ"
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const { addOrder } = useOrders()
  const { reduceProductStock } = useAdmin()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"vnpay" | "bank_transfer" | "cod">("vnpay")
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    district: "",
  })

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-primary mb-4">Thanh toán</h1>
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let allStockAvailable = true
      for (const item of items) {
        if (!reduceProductStock(item.id, item.quantity)) {
          allStockAvailable = false
          alert(`Sản phẩm "${item.name}" không đủ hàng. Vui lòng kiểm tra lại số lượng.`)
          break
        }
      }

      if (!allStockAvailable) {
        setLoading(false)
        return
      }

      const orderResponse = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerInfo: formData,
          items: items,
          total: total,
          paymentMethod: paymentMethod,
        }),
      })

      if (!orderResponse.ok) {
        const errorText = await orderResponse.text()
        console.error("[v0] Order creation failed:", orderResponse.status, errorText)
        alert(`Lỗi tạo đơn hàng: ${orderResponse.status}`)
        setLoading(false)
        return
      }

      let orderData
      try {
        orderData = await orderResponse.json()
      } catch (parseError) {
        console.error("[v0] Failed to parse order response:", parseError)
        alert("Lỗi: Phản hồi từ máy chủ không hợp lệ")
        setLoading(false)
        return
      }

      if (orderData.order) {
        addOrder(orderData.order)
      }

      if (paymentMethod === "vnpay") {
        const response = await fetch("/api/vnpay/create-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: total,
            orderInfo: `Đơn hàng từ ${formData.fullName}`,
            customerInfo: formData,
            items: items,
            orderId: orderData.order?.id,
          }),
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error("[v0] VNPay payment creation failed:", response.status, errorText)
          alert(`Lỗi tạo thanh toán VNPay: ${response.status}`)
          setLoading(false)
          return
        }

        let data
        try {
          data = await response.json()
        } catch (parseError) {
          console.error("[v0] Failed to parse VNPay response:", parseError, "Response status:", response.status)
          alert("Lỗi: Phản hồi từ máy chủ thanh toán không hợp lệ")
          setLoading(false)
          return
        }

        if (data.paymentUrl) {
          clearCart()
          window.location.href = data.paymentUrl
        } else {
          console.error("[v0] No payment URL returned:", data)
          alert("Lỗi: Không nhận được URL thanh toán")
          setLoading(false)
        }
      } else if (paymentMethod === "bank_transfer") {
        clearCart()
        router.push(`/payment-confirmation?orderId=${orderData.order?.id}&method=bank_transfer`)
      } else if (paymentMethod === "cod") {
        clearCart()
        router.push(`/payment-confirmation?orderId=${orderData.order?.id}&method=cod`)
      }
    } catch (error) {
      console.error("[v0] Payment error:", error)
      alert(`Lỗi khi tạo thanh toán: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-primary mb-8">Thanh toán</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handlePayment} className="bg-white border border-secondary/20 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-primary mb-6">Thông tin giao hàng</h2>

                <div className="space-y-4 mb-8">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Họ và tên</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-secondary/20 rounded-lg focus:outline-none focus:border-primary"
                      placeholder="Nhập họ và tên"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-secondary/20 rounded-lg focus:outline-none focus:border-primary"
                        placeholder="Nhập email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">Số điện thoại</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-secondary/20 rounded-lg focus:outline-none focus:border-primary"
                        placeholder="Nhập số điện thoại"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Địa chỉ</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-secondary/20 rounded-lg focus:outline-none focus:border-primary"
                      placeholder="Nhập địa chỉ"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">Thành phố</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-secondary/20 rounded-lg focus:outline-none focus:border-primary"
                        placeholder="Nhập thành phố"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">Quận/Huyện</label>
                      <input
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-secondary/20 rounded-lg focus:outline-none focus:border-primary"
                        placeholder="Nhập quận/huyện"
                      />
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-primary mb-6">Phương thức thanh toán</h2>
                <div className="space-y-3 mb-8">
                  {/* VNPay Option */}
                  <label
                    className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition"
                    style={{
                      borderColor: paymentMethod === "vnpay" ? "var(--color-primary)" : "var(--color-secondary)",
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="vnpay"
                      checked={paymentMethod === "vnpay"}
                      onChange={(e) => setPaymentMethod(e.target.value as "vnpay" | "bank_transfer" | "cod")}
                      className="w-4 h-4"
                    />
                    <CreditCard className="ml-3 mr-3" size={20} />
                    <div>
                      <p className="font-semibold text-foreground">Thanh toán qua VNPay</p>
                      <p className="text-sm text-foreground/70">Thẻ tín dụng, thẻ ghi nợ, ví điện tử</p>
                    </div>
                  </label>

                  {/* Bank Transfer Option */}
                  <label
                    className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition"
                    style={{
                      borderColor:
                        paymentMethod === "bank_transfer" ? "var(--color-primary)" : "var(--color-secondary)",
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={paymentMethod === "bank_transfer"}
                      onChange={(e) => setPaymentMethod(e.target.value as "vnpay" | "bank_transfer" | "cod")}
                      className="w-4 h-4"
                    />
                    <Banknote className="ml-3 mr-3" size={20} />
                    <div>
                      <p className="font-semibold text-foreground">Chuyển khoản ngân hàng</p>
                      <p className="text-sm text-foreground/70">Chuyển tiền trực tiếp vào tài khoản ngân hàng</p>
                    </div>
                  </label>

                  {/* Cash on Delivery Option */}
                  <label
                    className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition"
                    style={{ borderColor: paymentMethod === "cod" ? "var(--color-primary)" : "var(--color-secondary)" }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value as "vnpay" | "bank_transfer" | "cod")}
                      className="w-4 h-4"
                    />
                    <Truck className="ml-3 mr-3" size={20} />
                    <div>
                      <p className="font-semibold text-foreground">Thanh toán khi nhận hàng</p>
                      <p className="text-sm text-foreground/70">Thanh toán tiền mặt khi nhận hàng</p>
                    </div>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition font-semibold disabled:opacity-50"
                >
                  {loading
                    ? "Đang xử lý..."
                    : `Tiếp tục với ${paymentMethod === "vnpay" ? "VNPay" : paymentMethod === "bank_transfer" ? "Chuyển khoản" : "Thanh toán khi nhận hàng"}`}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-secondary/20 rounded-lg p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-primary mb-6">Tóm tắt đơn hàng</h2>

                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-foreground/70">
                        {item.name} x{item.quantity}
                      </span>
                      <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-secondary/20 pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Tổng tiền:</span>
                    <span className="font-semibold">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Phí vận chuyển:</span>
                    <span className="font-semibold">Miễn phí</span>
                  </div>
                  <div className="border-t border-secondary/20 pt-2 flex justify-between">
                    <span className="font-bold text-primary">Tổng cộng:</span>
                    <span className="font-bold text-primary text-lg">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
