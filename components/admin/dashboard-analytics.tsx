"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { ShoppingCart, DollarSign, Package, TrendingUp } from "lucide-react"
import { useAdmin } from "@/lib/admin-context"
import { Loading } from "@/components/ui/loading"

export default function DashboardAnalytics() {
  const { products, posts, contacts } = useAdmin()
  const [syncedData, setSyncedData] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    paidOrders: 0,
    pendingOrders: 0,
    paymentMethodBreakdown: { vnpay: 0, bank_transfer: 0, cod: 0 },
    orderStatusBreakdown: { pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 },
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/admin/orders-analytics")
        if (response.ok) {
          const data = await response.json()
          if (data.analytics) {
            setSyncedData(data.analytics)
            console.log("[v0] Analytics synced from Supabase:", data.analytics)
          }
        }
      } catch (error) {
        console.error("[v0] Failed to fetch analytics:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
    // Refresh analytics every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000)
    return () => clearInterval(interval)
  }, [])

  const paymentMethodBreakdown = syncedData.paymentMethodBreakdown
  const orderStatusBreakdown = syncedData.orderStatusBreakdown

  const lowStockProducts = products?.filter((p: any) => p.stock < 10) || []
  const totalMessages = contacts?.length || 0

  const formatCurrency = (amount: number) => {
    return (amount / 1000).toLocaleString("vi-VN") + ".000 đ"
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Tổng đơn hàng</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">{syncedData.totalOrders}</p>
            </div>
            <ShoppingCart size={40} className="text-blue-300" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Tổng doanh thu</p>
              <p className="text-2xl font-bold text-green-900 mt-2">{formatCurrency(syncedData.totalRevenue)}</p>
            </div>
            <DollarSign size={40} className="text-green-300" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Đã thanh toán</p>
              <p className="text-3xl font-bold text-purple-900 mt-2">{syncedData.paidOrders}</p>
              <p className="text-xs text-purple-600 mt-1">
                {syncedData.totalOrders > 0 ? Math.round((syncedData.paidOrders / syncedData.totalOrders) * 100) : 0}%
              </p>
            </div>
            <TrendingUp size={40} className="text-purple-300" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Chờ xác nhận</p>
              <p className="text-3xl font-bold text-orange-900 mt-2">{syncedData.pendingOrders}</p>
            </div>
            <Package size={40} className="text-orange-300" />
          </div>
        </Card>
      </div>

      {/* Payment Methods Breakdown */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Phương thức thanh toán</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-600 font-medium">VNPay</p>
            <p className="text-2xl font-bold text-blue-900 mt-2">{paymentMethodBreakdown.vnpay}</p>
            <p className="text-xs text-blue-600 mt-1">
              {syncedData.totalOrders > 0
                ? Math.round((paymentMethodBreakdown.vnpay / syncedData.totalOrders) * 100)
                : 0}
              %
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-600 font-medium">Chuyển khoản</p>
            <p className="text-2xl font-bold text-green-900 mt-2">{paymentMethodBreakdown.bank_transfer}</p>
            <p className="text-xs text-green-600 mt-1">
              {syncedData.totalOrders > 0
                ? Math.round((paymentMethodBreakdown.bank_transfer / syncedData.totalOrders) * 100)
                : 0}
              %
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-sm text-purple-600 font-medium">Thanh toán khi nhận</p>
            <p className="text-2xl font-bold text-purple-900 mt-2">{paymentMethodBreakdown.cod}</p>
            <p className="text-xs text-purple-600 mt-1">
              {syncedData.totalOrders > 0 ? Math.round((paymentMethodBreakdown.cod / syncedData.totalOrders) * 100) : 0}
              %
            </p>
          </div>
        </div>
      </Card>

      {/* Order Status Breakdown */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Trạng thái đơn hàng</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-xs text-yellow-600 font-medium">Chờ xử lý</p>
            <p className="text-xl font-bold text-yellow-900 mt-1">{orderStatusBreakdown.pending}</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-600 font-medium">Đang xử lý</p>
            <p className="text-xl font-bold text-blue-900 mt-1">{orderStatusBreakdown.processing}</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-xs text-purple-600 font-medium">Đã gửi</p>
            <p className="text-xl font-bold text-purple-900 mt-1">{orderStatusBreakdown.shipped}</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-xs text-green-600 font-medium">Đã giao</p>
            <p className="text-xl font-bold text-green-900 mt-1">{orderStatusBreakdown.delivered}</p>
          </div>
          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
            <p className="text-xs text-red-600 font-medium">Đã hủy</p>
            <p className="text-xl font-bold text-red-900 mt-1">{orderStatusBreakdown.cancelled}</p>
          </div>
        </div>
      </Card>

      {/* Inventory & Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Low Stock Products */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Sản phẩm hết hàng</h3>
          {lowStockProducts.length === 0 ? (
            <p className="text-muted-foreground text-sm">Tất cả sản phẩm đều có đủ hàng</p>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.slice(0, 5).map((product: any) => (
                <div
                  key={product.id}
                  className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200"
                >
                  <div>
                    <p className="font-medium text-foreground text-sm">{product.name}</p>
                    <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                  </div>
                  <span className="text-lg font-bold text-red-600">{product.stock}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Content Stats */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Thống kê nội dung</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <span className="text-foreground font-medium">Bài viết Blog</span>
              <span className="text-lg font-bold text-blue-600">{posts?.length || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
              <span className="text-foreground font-medium">Sản phẩm</span>
              <span className="text-lg font-bold text-green-600">{products?.length || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
              <span className="text-foreground font-medium">Tin nhắn liên hệ</span>
              <span className="text-lg font-bold text-purple-600">{totalMessages}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
