"use client"

import { useState, useEffect } from "react"
import { useAdmin } from "@/lib/admin-context"
import { CheckCircle, Clock, XCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface PaymentConfirmation {
  orderId: string
  orderNumber: string
  method: "bank_transfer" | "cod" | "vnpay"
  status: "pending" | "confirmed" | "failed"
  amount: number
  customerName: string
  date: string
}

export default function PaymentConfirmations() {
  const { orders, updateOrderStatus } = useAdmin()
  const [confirmations, setConfirmations] = useState<PaymentConfirmation[]>([])
  const [selectedStatus, setSelectedStatus] = useState<"all" | "pending" | "confirmed" | "failed">("pending")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (orders && orders.length > 0) {
      const paymentConfirmations: PaymentConfirmation[] = orders
        .filter((order: any) => order.paymentMethod !== "vnpay")
        .map((order: any) => ({
          orderId: order.id.toString(),
          orderNumber: order.orderNumber,
          method: order.paymentMethod || "cod",
          status: order.paymentStatus || "pending",
          amount: order.totalAmount,
          customerName: order.customerName,
          date: order.date,
        }))
      setConfirmations(paymentConfirmations)
    }
  }, [orders])

  const handleConfirmPayment = async (orderId: string, method: string) => {
    setLoading(true)
    try {
      const orderIdNum = Number.parseInt(orderId)
      updateOrderStatus(orderIdNum, "processing", "confirmed")

      // Also sync to API
      await fetch("/api/orders/confirm-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          paymentMethod: method,
          status: "confirmed",
        }),
      })

      setConfirmations((prev) =>
        prev.map((conf) => (conf.orderId === orderId ? { ...conf, status: "confirmed" as const } : conf)),
      )
    } catch (error) {
      console.error("Failed to confirm payment:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFailPayment = async (orderId: string, method: string) => {
    setLoading(true)
    try {
      const orderIdNum = Number.parseInt(orderId)
      updateOrderStatus(orderIdNum, "cancelled", "failed")

      // Also sync to API
      await fetch("/api/orders/confirm-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          paymentMethod: method,
          status: "failed",
        }),
      })

      setConfirmations((prev) =>
        prev.map((conf) => (conf.orderId === orderId ? { ...conf, status: "failed" as const } : conf)),
      )
    } catch (error) {
      console.error("Failed to fail payment:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredConfirmations =
    selectedStatus === "all" ? confirmations : confirmations.filter((conf) => conf.status === selectedStatus)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="text-green-500" size={20} />
      case "pending":
        return <Clock className="text-yellow-500" size={20} />
      case "failed":
        return <XCircle className="text-red-500" size={20} />
      default:
        return null
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Đã xác nhận"
      case "pending":
        return "Chờ xác nhận"
      case "failed":
        return "Thất bại"
      default:
        return status
    }
  }

  const getMethodLabel = (method: string) => {
    switch (method) {
      case "bank_transfer":
        return "Chuyển khoản"
      case "cod":
        return "Thanh toán khi nhận"
      case "vnpay":
        return "VNPay"
      default:
        return method
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-2xl font-bold text-primary mb-6">Xác nhận thanh toán</h2>

      <div className="flex gap-2 mb-6 flex-wrap">
        {(["all", "pending", "confirmed", "failed"] as const).map((status) => (
          <Button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded-lg transition ${
              selectedStatus === status
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            {status === "all"
              ? "Tất cả"
              : status === "pending"
                ? "Chờ xác nhận"
                : status === "confirmed"
                  ? "Đã xác nhận"
                  : "Thất bại"}
          </Button>
        ))}
      </div>

      {filteredConfirmations.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <RefreshCw size={48} className="mx-auto mb-3 opacity-50" />
          <p>Không có thanh toán nào cần xác nhận</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-foreground">Mã đơn hàng</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Khách hàng</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Phương thức</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Số tiền</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Ngày</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Trạng thái</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredConfirmations.map((conf) => (
                <tr key={conf.orderId} className="border-b border-border hover:bg-muted/50 transition">
                  <td className="py-3 px-4 text-foreground font-medium">{conf.orderNumber}</td>
                  <td className="py-3 px-4 text-foreground">{conf.customerName}</td>
                  <td className="py-3 px-4 text-foreground">{getMethodLabel(conf.method)}</td>
                  <td className="py-3 px-4 text-foreground font-semibold">
                    {(conf.amount / 1000).toLocaleString()}.000 đ
                  </td>
                  <td className="py-3 px-4 text-foreground text-sm">
                    {new Date(conf.date).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(conf.status)}
                      <span className="text-sm">{getStatusLabel(conf.status)}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      {conf.status === "pending" && (
                        <>
                          <Button
                            onClick={() => handleConfirmPayment(conf.orderId, conf.method)}
                            disabled={loading}
                            size="sm"
                            className="bg-green-500 hover:bg-green-600 text-white"
                          >
                            Xác nhận
                          </Button>
                          <Button
                            onClick={() => handleFailPayment(conf.orderId, conf.method)}
                            disabled={loading}
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:bg-red-50"
                          >
                            Từ chối
                          </Button>
                        </>
                      )}
                      {conf.status === "confirmed" && (
                        <span className="text-sm text-green-600 font-medium">Đã xác nhận</span>
                      )}
                      {conf.status === "failed" && <span className="text-sm text-red-600 font-medium">Đã từ chối</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-3 gap-4">
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <p className="text-sm text-yellow-600 font-medium">Chờ xác nhận</p>
          <p className="text-2xl font-bold text-yellow-700">
            {confirmations.filter((c) => c.status === "pending").length}
          </p>
        </Card>
        <Card className="p-4 bg-green-50 border-green-200">
          <p className="text-sm text-green-600 font-medium">Đã xác nhận</p>
          <p className="text-2xl font-bold text-green-700">
            {confirmations.filter((c) => c.status === "confirmed").length}
          </p>
        </Card>
        <Card className="p-4 bg-red-50 border-red-200">
          <p className="text-sm text-red-600 font-medium">Thất bại</p>
          <p className="text-2xl font-bold text-red-700">{confirmations.filter((c) => c.status === "failed").length}</p>
        </Card>
      </div>
    </div>
  )
}
