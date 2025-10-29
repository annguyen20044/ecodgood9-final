"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAdmin } from "@/lib/admin-context"
import { Button } from "@/components/ui/button"
import ProductManagement from "@/components/admin/product-management"
import BlogManagement from "@/components/admin/blog-management"
import ContactManagement from "@/components/admin/contact-management"
import OrderManagement from "@/components/admin/order-management"
import CartOrdersReport from "@/components/admin/cart-orders-report"
import JobManagement from "@/components/admin/job-management"
import ApplicationManagement from "@/components/admin/application-management"
import PaymentSettings from "@/components/admin/payment-settings"
import MediaManagement from "@/components/admin/media-management"
import AdminSettings from "@/components/admin/admin-settings"
import DashboardAnalytics from "@/components/admin/dashboard-analytics"

type TabType =
  | "dashboard"
  | "products"
  | "blog"
  | "contacts"
  | "orders"
  | "cart-orders"
  | "jobs"
  | "applications"
  | "payment-settings"
  | "media"
  | "settings"

export default function AdminDashboard() {
  const { isAuthenticated, logout } = useAdmin()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>("dashboard")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">EcoGood Admin</h1>
          <div className="flex gap-2">
            <Button
              onClick={() => setActiveTab("settings")}
              variant="outline"
              className="text-foreground hover:bg-muted"
            >
              Cài đặt
            </Button>
            <Button onClick={logout} variant="outline">
              Đăng xuất
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 flex-wrap">
          <Button
            onClick={() => setActiveTab("dashboard")}
            className={activeTab === "dashboard" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}
          >
            Bảng điều khiển
          </Button>
          <Button
            onClick={() => setActiveTab("products")}
            className={activeTab === "products" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}
          >
            Sản phẩm
          </Button>
          <Button
            onClick={() => setActiveTab("blog")}
            className={activeTab === "blog" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}
          >
            Blog
          </Button>
          <Button
            onClick={() => setActiveTab("media")}
            className={activeTab === "media" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}
          >
            Media
          </Button>
          <Button
            onClick={() => setActiveTab("contacts")}
            className={activeTab === "contacts" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}
          >
            Liên hệ
          </Button>
          <Button
            onClick={() => setActiveTab("jobs")}
            className={activeTab === "jobs" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}
          >
            Vị trí tuyển dụng
          </Button>
          <Button
            onClick={() => setActiveTab("applications")}
            className={activeTab === "applications" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}
          >
            Đơn tuyển dụng
          </Button>
          <Button
            onClick={() => setActiveTab("orders")}
            className={activeTab === "orders" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}
          >
            Đơn hàng
          </Button>
          <Button
            onClick={() => setActiveTab("cart-orders")}
            className={activeTab === "cart-orders" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}
          >
            Giỏ hàng
          </Button>
          <Button
            onClick={() => setActiveTab("payment-settings")}
            className={
              activeTab === "payment-settings" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
            }
          >
            Cài đặt thanh toán
          </Button>
        </div>

        {/* Content */}
        {activeTab === "dashboard" && <DashboardAnalytics />}
        {activeTab === "products" && <ProductManagement />}
        {activeTab === "blog" && <BlogManagement />}
        {activeTab === "media" && <MediaManagement />}
        {activeTab === "contacts" && <ContactManagement />}
        {activeTab === "jobs" && <JobManagement />}
        {activeTab === "applications" && <ApplicationManagement />}
        {activeTab === "orders" && <OrderManagement />}
        {activeTab === "cart-orders" && <CartOrdersReport />}
        {activeTab === "payment-settings" && <PaymentSettings />}
        {activeTab === "settings" && <AdminSettings />}
      </main>
    </div>
  )
}
