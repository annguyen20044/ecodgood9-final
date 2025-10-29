"use client"

import { useAdmin } from "@/lib/admin-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import { Trash2, Eye, Search, Filter, RefreshCw } from "lucide-react"
import useSWR from "swr"
import { Loading } from "@/components/ui/loading"

const formatPrice = (price: number) => {
  return (price / 1000).toLocaleString("vi-VN") + ".000 đ"
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function OrderManagement() {
  const { updateOrderStatus, deleteOrder } = useAdmin()
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterPayment, setFilterPayment] = useState<string>("all")

  const queryParams = new URLSearchParams()
  if (filterStatus !== "all") queryParams.append("status", filterStatus)
  if (filterPayment !== "all") queryParams.append("paymentStatus", filterPayment)
  if (searchTerm) queryParams.append("search", searchTerm)

  const { data, isLoading, error, mutate } = useSWR(`/api/admin/orders?${queryParams.toString()}`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  })

  const orders = data?.data || []

  const getOrderStatusColor = (status: string) => {
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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getOrderStatusLabel = (status: string) => {
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

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ thanh toán"
      case "completed":
        return "Đã thanh toán"
      case "failed":
        return "Thanh toán thất bại"
      default:
        return status
    }
  }

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "vnpay":
        return "VNPay"
      case "bank_transfer":
        return "Chuyển khoản"
      case "cod":
        return "Thanh toán khi nhận"
      default:
        return method
    }
  }

  const stats = {
    total: orders.length,
    pending: orders.filter((o: any) => o.orderStatus === "pending").length,
    processing: orders.filter((o: any) => o.orderStatus === "processing").length,
    delivered: orders.filter((o: any) => o.orderStatus === "delivered").length,
    totalRevenue: orders.reduce((sum: number, o: any) => sum + o.totalAmount, 0),
    completedPayments: orders.filter((o: any) => o.paymentStatus === "completed").length,
  }

  const handleUpdateStatus = async (orderId: number, newOrderStatus: string, newPaymentStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: newOrderStatus, paymentStatus: newPaymentStatus }),
      })

      if (response.ok) {
        mutate()
        setSelectedOrder(null)
      }
    } catch (error) {
      console.error("[v0] Failed to update order:", error)
    }
  }

  const handleDeleteOrder = async (orderId: number) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        mutate()
        setDeleteId(null)
      }
    } catch (error) {
      console.error("[v0] Failed to delete order:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">Quản lý Đơn hàng</h2>
        <div className="flex gap-2 items-center">
          <span className="text-sm text-muted-foreground">Tổng: {orders.length} đơn</span>
          <Button size="sm" variant="outline" onClick={() => mutate()} className="gap-2">
            <RefreshCw size={16} />
            Làm mới
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground mb-1">Tổng đơn hàng</p>
          <p className="text-2xl font-bold text-primary">{stats.total}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground mb-1">Chờ xử lý</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground mb-1">Đã giao</p>
          <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground mb-1">Doanh thu</p>
          <p className="text-lg font-bold text-primary">{formatPrice(stats.totalRevenue)}</p>
        </Card>
      </div>

      <div className="bg-white border border-secondary/20 rounded-lg p-4 space-y-4">
        <div className="flex gap-2 flex-wrap">
          <div className="flex-1 min-w-64 relative">
            <Search size={16} className="absolute left-3 top-3 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, điện thoại, mã đơn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-secondary/20 rounded-lg focus:outline-none focus:border-primary text-sm"
            />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Trạng thái đơn:</span>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1 border border-secondary/20 rounded-lg text-sm focus:outline-none focus:border-primary"
          >
            <option value="all">Tất cả</option>
            <option value="pending">Chờ xử lý</option>
            <option value="processing">Đang xử lý</option>
            <option value="shipped">Đã gửi</option>
            <option value="delivered">Đã giao</option>
            <option value="cancelled">Đã hủy</option>
          </select>

          <span className="text-sm font-medium text-foreground">Thanh toán:</span>
          <select
            value={filterPayment}
            onChange={(e) => setFilterPayment(e.target.value)}
            className="px-3 py-1 border border-secondary/20 rounded-lg text-sm focus:outline-none focus:border-primary"
          >
            <option value="all">Tất cả</option>
            <option value="pending">Chờ thanh toán</option>
            <option value="completed">Đã thanh toán</option>
            <option value="failed">Thất bại</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <Loading />
      ) : error ? (
        <Card className="p-8 text-center bg-red-50 border-red-200">
          <p className="text-red-600">Lỗi tải dữ liệu: {error.message}</p>
        </Card>
      ) : orders.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Không tìm thấy đơn hàng nào</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <Card key={order.id} className="p-4">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="font-semibold text-lg">Đơn #{order.orderNumber}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${getOrderStatusColor(order.orderStatus)}`}>
                      {getOrderStatusLabel(order.orderStatus)}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {getPaymentStatusLabel(order.paymentStatus)}
                    </span>
                    <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                      {getPaymentMethodLabel(order.paymentMethod)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Khách hàng:</strong> {order.customerName}
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Email:</strong> {order.customerEmail}
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Điện thoại:</strong> {order.customerPhone}
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Địa chỉ:</strong> {order.customerAddress}
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Tổng tiền:</strong> {formatPrice(order.totalAmount)}
                  </p>
                  <p className="text-xs text-muted-foreground">{order.date}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setSelectedOrder(order)} className="gap-2">
                    <Eye size={16} />
                    Chi tiết
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => setDeleteId(order.id)} className="gap-2">
                    <Trash2 size={16} />
                    Xóa
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>Bạn có chắc chắn muốn xóa đơn hàng này không?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              if (deleteId) {
                handleDeleteOrder(deleteId)
              }
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Xóa
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>

      {/* Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">Đơn #{selectedOrder.orderNumber}</h3>
                <button onClick={() => setSelectedOrder(null)} className="text-muted-foreground hover:text-foreground">
                  ✕
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <strong>Thông tin khách hàng:</strong>
                  <p className="text-sm mt-1">Tên: {selectedOrder.customerName}</p>
                  <p className="text-sm">Email: {selectedOrder.customerEmail}</p>
                  <p className="text-sm">Điện thoại: {selectedOrder.customerPhone}</p>
                  <p className="text-sm">Địa chỉ: {selectedOrder.customerAddress}</p>
                </div>
                <div>
                  <strong>Phương thức thanh toán:</strong>
                  <p className="text-sm mt-1">{getPaymentMethodLabel(selectedOrder.paymentMethod)}</p>
                </div>
                <div>
                  <strong>Sản phẩm:</strong>
                  <div className="mt-2 space-y-2">
                    {selectedOrder.items.map((item: any, idx: number) => (
                      <div key={idx} className="text-sm p-2 bg-muted rounded">
                        {item.productName} x {item.quantity} = {formatPrice(item.price * item.quantity)}
                      </div>
                    ))}
                  </div>
                </div>
                <p>
                  <strong>Tổng tiền:</strong> {formatPrice(selectedOrder.totalAmount)}
                </p>
                <p>
                  <strong>Ghi chú:</strong> {selectedOrder.notes || "Không có"}
                </p>
                <div className="flex gap-2 pt-4 flex-wrap">
                  {selectedOrder.orderStatus !== "processing" && (
                    <Button
                      size="sm"
                      onClick={() => handleUpdateStatus(selectedOrder.id, "processing", selectedOrder.paymentStatus)}
                    >
                      Đang xử lý
                    </Button>
                  )}
                  {selectedOrder.orderStatus !== "shipped" && (
                    <Button
                      size="sm"
                      onClick={() => handleUpdateStatus(selectedOrder.id, "shipped", selectedOrder.paymentStatus)}
                    >
                      Đã gửi
                    </Button>
                  )}
                  {selectedOrder.orderStatus !== "delivered" && (
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleUpdateStatus(selectedOrder.id, "delivered", selectedOrder.paymentStatus)}
                    >
                      Đã giao
                    </Button>
                  )}
                  {selectedOrder.paymentStatus !== "completed" && (
                    <Button
                      size="sm"
                      onClick={() => handleUpdateStatus(selectedOrder.id, selectedOrder.orderStatus, "completed")}
                    >
                      Đã thanh toán
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
