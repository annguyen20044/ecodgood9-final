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
import { Trash2, Eye, Search, Filter } from "lucide-react"

export default function ApplicationManagement() {
  const { applications, updateApplicationStatus, deleteApplication } = useAdmin()
  const [selectedApp, setSelectedApp] = useState<(typeof applications)[0] | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterPosition, setFilterPosition] = useState<string>("all")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800"
      case "reviewing":
        return "bg-yellow-100 text-yellow-800"
      case "accepted":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "new":
        return "Mới"
      case "reviewing":
        return "Đang xem xét"
      case "accepted":
        return "Chấp nhận"
      case "rejected":
        return "Từ chối"
      default:
        return status
    }
  }

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.phone.includes(searchTerm) ||
      app.position.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === "all" || app.status === filterStatus
    const matchesPosition = filterPosition === "all" || app.position === filterPosition

    return matchesSearch && matchesStatus && matchesPosition
  })

  const uniquePositions = Array.from(new Set(applications.map((app) => app.position)))

  const stats = {
    total: applications.length,
    new: applications.filter((a) => a.status === "new").length,
    reviewing: applications.filter((a) => a.status === "reviewing").length,
    accepted: applications.filter((a) => a.status === "accepted").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">Quản lý Tuyển dụng</h2>
        <span className="text-sm text-muted-foreground">Tổng: {applications.length} đơn</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground mb-1">Tổng đơn</p>
          <p className="text-2xl font-bold text-primary">{stats.total}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground mb-1">Mới</p>
          <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground mb-1">Đang xem xét</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.reviewing}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground mb-1">Chấp nhận</p>
          <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground mb-1">Từ chối</p>
          <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
        </Card>
      </div>

      <div className="bg-white border border-secondary/20 rounded-lg p-4 space-y-4">
        <div className="flex gap-2 flex-wrap">
          <div className="flex-1 min-w-64 relative">
            <Search size={16} className="absolute left-3 top-3 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, điện thoại, vị trí..."
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
            <option value="new">Mới</option>
            <option value="reviewing">Đang xem xét</option>
            <option value="accepted">Chấp nhận</option>
            <option value="rejected">Từ chối</option>
          </select>

          <span className="text-sm font-medium text-foreground">Vị trí:</span>
          <select
            value={filterPosition}
            onChange={(e) => setFilterPosition(e.target.value)}
            className="px-3 py-1 border border-secondary/20 rounded-lg text-sm focus:outline-none focus:border-primary"
          >
            <option value="all">Tất cả vị trí</option>
            {uniquePositions.map((position) => (
              <option key={position} value={position}>
                {position}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredApplications.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            {applications.length === 0 ? "Chưa có đơn tuyển dụng nào" : "Không tìm thấy đơn phù hợp"}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((app) => (
            <Card key={app.id} className="p-4">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="font-semibold text-lg">{app.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(app.status)}`}>
                      {getStatusLabel(app.status)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Vị trí:</strong> {app.position}
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Email:</strong> {app.email}
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Điện thoại:</strong> {app.phone}
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Kinh nghiệm:</strong> {app.experience}
                  </p>
                  <p className="text-xs text-muted-foreground">{app.date}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setSelectedApp(app)} className="gap-2">
                    <Eye size={16} />
                    Chi tiết
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => setDeleteId(app.id)} className="gap-2">
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
            <AlertDialogDescription>Bạn có chắc chắn muốn xóa đơn tuyển dụng này không?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              if (deleteId) {
                deleteApplication(deleteId)
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
      {selectedApp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{selectedApp.name}</h3>
                <button onClick={() => setSelectedApp(null)} className="text-muted-foreground hover:text-foreground">
                  ✕
                </button>
              </div>
              <div className="space-y-3">
                <p>
                  <strong>Vị trí:</strong> {selectedApp.position}
                </p>
                <p>
                  <strong>Email:</strong> {selectedApp.email}
                </p>
                <p>
                  <strong>Điện thoại:</strong> {selectedApp.phone}
                </p>
                <p>
                  <strong>Kinh nghiệm:</strong> {selectedApp.experience}
                </p>
                <p>
                  <strong>Ngày:</strong> {selectedApp.date}
                </p>
                <div>
                  <strong>Thư tự giới thiệu:</strong>
                  <p className="mt-2 p-3 bg-muted rounded">{selectedApp.message}</p>
                </div>
                <div className="flex gap-2 pt-4 flex-wrap">
                  {selectedApp.status !== "reviewing" && (
                    <Button
                      size="sm"
                      onClick={() => {
                        updateApplicationStatus(selectedApp.id, "reviewing")
                        setSelectedApp(null)
                      }}
                    >
                      Đang xem xét
                    </Button>
                  )}
                  {selectedApp.status !== "accepted" && (
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        updateApplicationStatus(selectedApp.id, "accepted")
                        setSelectedApp(null)
                      }}
                    >
                      Chấp nhận
                    </Button>
                  )}
                  {selectedApp.status !== "rejected" && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        updateApplicationStatus(selectedApp.id, "rejected")
                        setSelectedApp(null)
                      }}
                    >
                      Từ chối
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
