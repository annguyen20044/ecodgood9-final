"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { useOrders } from "@/lib/order-context"
import { Package } from "lucide-react"

export default function OrdersPage() {
  const { orders } = useOrders()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý"
      case "processing":
        return "Đang xử lý"
      case "shipped":
        return "Đã gửi"
      case "delivered":
        return "Đã giao"
      case "cancelled":
        return "Đã hủy"
      default:
        return status
    }
  }

  if (orders.length === 0) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Package size={80} className="text-primary/30 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-primary mb-4">Lịch sử đơn hàng</h1>
            <p className="text-foreground/70 mb-8">Bạn chưa có đơn hàng nào</p>
            <Link href="/products">
              <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 transition">
                Bắt đầu mua sắm
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
          <h1 className="text-4xl font-bold text-primary mb-8">Lịch sử đơn hàng</h1>

          <div className="space-y-4">
            {orders.map((order) => {
              const customerName =
                (order as any).customerInfo?.fullName ||
                (order as any).customerName ||
                (order as any).customer_name ||
                "Khách hàng"

              return (
                <Link key={order.id} href={`/orders/${order.id}`}>
                  <div className="bg-white border border-secondary/20 rounded-lg p-6 hover:shadow-lg transition cursor-pointer">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-primary mb-2">{order.id}</h3>
                        <p className="text-foreground/70 text-sm">{new Date(order.date).toLocaleDateString("vi-VN")}</p>
                      </div>
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.orderStatus || (order as any).order_status)}`}
                      >
                        {getStatusLabel(order.orderStatus || (order as any).order_status)}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-foreground/70 text-sm mb-1">Khách hàng</p>
                        <p className="font-semibold">{customerName}</p>
                      </div>
                      <div>
                        <p className="text-foreground/70 text-sm mb-1">Số sản phẩm</p>
                        <p className="font-semibold">{order.items?.length || 0} sản phẩm</p>
                      </div>
                      <div>
                        <p className="text-foreground/70 text-sm mb-1">Tổng tiền</p>
                        <p className="font-semibold text-primary">
                          {((order.totalAmount || (order as any).total_amount || 0) / 1000).toLocaleString()}K VNĐ
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <button className="text-primary hover:text-primary/80 transition font-semibold">
                        Xem chi tiết →
                      </button>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
