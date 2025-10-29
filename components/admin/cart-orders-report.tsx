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
import { Trash2, Eye, Search, Filter, ShoppingCart } from "lucide-react"

const formatPrice = (price: number) => {
  return (price / 1000).toLocaleString("vi-VN") + ".000 đ"
}

export default function CartOrdersReport() {
  const { cartOrders, updateCartOrderStatus, deleteCartOrder } = useAdmin()
  const [selectedOrder, setSelectedOrder] = useState<(typeof cartOrders)[0] | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800"
      case "abandoned":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Đang hoạt động"
      case "abandoned":
        return "Bỏ rơi"
      default:
        return status
    }
  }

  const filteredOrders = cartOrders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.includes(searchTerm)

    const matchesStatus = filterStatus === "all" || order.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const stats = {
    total: cartOrders.length,
    active: cartOrders.filter((o) => o.status === "active").length,
    abandoned: cartOrders.filter((o) => o.status === "abandoned").length,
    totalValue: cartOrders.reduce((sum, o) => sum + o.totalAmount, 0),
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
          <ShoppingCart size={28} />
          Báo cáo Giỏ hàng
        </h2>
        <span className="text-sm text-muted-foreground">Tổng: {cartOrders.length} giỏ</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground mb-1">Tổng giỏ hàng</p>
          <p className="text-2xl font-bold text-primary">{stats.total}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground mb-1">Đang hoạt động</p>
          <p className="text-2xl font-bold text-blue-600">{stats.active}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground mb-1">Bỏ rơi</p>
          <p className="text-2xl font-bold text-red-600">{stats.abandoned}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground mb-1">Giá trị</p>
          <p className="text-lg font-bold text-primary">{formatPrice(stats.totalValue)}</p>
        </Card>
      </div>

      <div className="bg-white border border-secondary/20 rounded-lg p-4 space-y-4">
        <div className="flex gap-2 flex-wrap">
          <div className="flex-1 min-w-64 relative">
            <Search size={16} className="absolute left-3 top-3 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, điện thoại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-secondary/20 rounded-lg focus:outline-none focus:border-primary text-sm"
            />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Trạng thái:</span>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1 border border-secondary/20 rounded-lg text-sm focus:outline-none focus:border-primary"
          >
            <option value="all">Tất cả</option>
            <option value="active">Đang hoạt động</option>
            <option value="abandoned">Bỏ rơi</option>
          </select>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            {cartOrders.length === 0 ? "Chưa có giỏ hàng nào" : "Không tìm thấy giỏ hàng phù hợp"}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="p-4">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="font-semibold text-lg">{order.customerName}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Email:</strong> {order.customerEmail}
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Điện thoại:</strong> {order.customerPhone}
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Số sản phẩm:</strong> {order.items.length}
                  </p>
                  <p className="text-sm font-semibold text-primary mb-2">
                    <strong>Giá trị:</strong> {formatPrice(order.totalAmount)}
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
            <AlertDialogDescription>Bạn có chắc chắn muốn xóa giỏ hàng này không?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              if (deleteId) {
                deleteCartOrder(deleteId)
                setDeleteId(null)
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
                <h3 className="text-xl font-bold">{selectedOrder.customerName}</h3>
                <button onClick={() => setSelectedOrder(null)} className="text-muted-foreground hover:text-foreground">
                  ✕
                </button>
              </div>
              <div className="space-y-3">
                <p>
                  <strong>Email:</strong> {selectedOrder.customerEmail}
                </p>
                <p>
                  <strong>Điện thoại:</strong> {selectedOrder.customerPhone}
                </p>
                <p>
                  <strong>Ngày:</strong> {selectedOrder.date}
                </p>
                <p>
                  <strong>Trạng thái:</strong> {getStatusLabel(selectedOrder.status)}
                </p>
                <div>
                  <strong>Sản phẩm trong giỏ:</strong>
                  <div className="mt-2 space-y-2">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="text-sm p-2 bg-muted rounded">
                        {item.name} x {item.quantity} = {formatPrice(item.price * item.quantity)}
                      </div>
                    ))}
                  </div>
                </div>
                <p>
                  <strong>Tổng giá trị:</strong> {formatPrice(selectedOrder.totalAmount)}
                </p>
                <div className="flex gap-2 pt-4 flex-wrap">
                  {selectedOrder.status !== "abandoned" && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        updateCartOrderStatus(selectedOrder.id, "abandoned")
                        setSelectedOrder(null)
                      }}
                    >
                      Đánh dấu bỏ rơi
                    </Button>
                  )}
                  {selectedOrder.status !== "active" && (
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => {
                        updateCartOrderStatus(selectedOrder.id, "active")
                        setSelectedOrder(null)
                      }}
                    >
                      Đánh dấu hoạt động
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
