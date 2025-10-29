"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { useOrders } from "@/lib/order-context"
import { useParams } from "next/navigation"

export default function OrderDetailPage() {
  const params = useParams()
  const { getOrder } = useOrders()
  const order = getOrder(params.id as string)

  if (!order) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-primary mb-4">Không tìm thấy đơn hàng</h1>
            <Link href="/orders">
              <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 transition">
                Quay lại lịch sử đơn hàng
              </button>
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

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

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/orders" className="text-primary hover:text-primary/80 transition mb-8 inline-block">
            ← Quay lại
          </Link>

          <div className="bg-white border border-secondary/20 rounded-lg p-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-4xl font-bold text-primary mb-2">{order.id}</h1>
                <p className="text-foreground/70">{new Date(order.date).toLocaleDateString("vi-VN")}</p>
              </div>
              <span className={`px-6 py-3 rounded-full text-lg font-semibold ${getStatusColor(order.status)}`}>
                {getStatusLabel(order.status)}
              </span>
            </div>

            {/* Customer Info */}
            <div className="mb-8 pb-8 border-b border-secondary/20">
              <h2 className="text-2xl font-bold text-primary mb-4">Thông tin giao hàng</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-foreground/70 text-sm mb-1">Họ và tên</p>
                  <p className="font-semibold">{order.customerInfo.fullName}</p>
                </div>
                <div>
                  <p className="text-foreground/70 text-sm mb-1">Email</p>
                  <p className="font-semibold">{order.customerInfo.email}</p>
                </div>
                <div>
                  <p className="text-foreground/70 text-sm mb-1">Số điện thoại</p>
                  <p className="font-semibold">{order.customerInfo.phone}</p>
                </div>
                <div>
                  <p className="text-foreground/70 text-sm mb-1">Địa chỉ</p>
                  <p className="font-semibold">
                    {order.customerInfo.address}, {order.customerInfo.district}, {order.customerInfo.city}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-8 pb-8 border-b border-secondary/20">
              <h2 className="text-2xl font-bold text-primary mb-4">Sản phẩm</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-4 bg-background rounded-lg">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-foreground/70 text-sm">Số lượng: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{(item.price / 1000).toLocaleString()}K VNĐ</p>
                      <p className="text-foreground/70 text-sm">
                        Tổng: {((item.price * item.quantity) / 1000).toLocaleString()}K VNĐ
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Total */}
            <div className="flex justify-end">
              <div className="w-full md:w-1/3">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Tổng tiền hàng:</span>
                    <span className="font-semibold">{(order.total / 1000).toLocaleString()}K VNĐ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Phí vận chuyển:</span>
                    <span className="font-semibold">Miễn phí</span>
                  </div>
                  <div className="border-t border-secondary/20 pt-2 flex justify-between">
                    <span className="font-bold text-primary">Tổng cộng:</span>
                    <span className="font-bold text-primary text-lg">{(order.total / 1000).toLocaleString()}K VNĐ</span>
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
