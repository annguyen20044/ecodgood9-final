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
import { Trash2, Eye } from "lucide-react"

export default function ContactManagement() {
  const { contacts, updateContactStatus, deleteContact } = useAdmin()
  const [selectedContact, setSelectedContact] = useState<(typeof contacts)[0] | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800"
      case "read":
        return "bg-yellow-100 text-yellow-800"
      case "replied":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "new":
        return "Mới"
      case "read":
        return "Đã đọc"
      case "replied":
        return "Đã trả lời"
      default:
        return status
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">Quản lý Liên hệ</h2>
        <span className="text-sm text-muted-foreground">Tổng: {contacts.length} liên hệ</span>
      </div>

      {contacts.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Chưa có liên hệ nào</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact) => (
            <Card key={contact.id} className="p-4">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{contact.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(contact.status)}`}>
                      {getStatusLabel(contact.status)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Email:</strong> {contact.email}
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Điện thoại:</strong> {contact.phone}
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Chủ đề:</strong> {contact.subject}
                  </p>
                  <p className="text-sm text-foreground mb-2">{contact.message}</p>
                  <p className="text-xs text-muted-foreground">{contact.date}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setSelectedContact(contact)} className="gap-2">
                    <Eye size={16} />
                    Chi tiết
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => setDeleteId(contact.id)} className="gap-2">
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
            <AlertDialogDescription>Bạn có chắc chắn muốn xóa liên hệ này không?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              if (deleteId) {
                deleteContact(deleteId)
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
      {selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{selectedContact.name}</h3>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-3">
                <p>
                  <strong>Email:</strong> {selectedContact.email}
                </p>
                <p>
                  <strong>Điện thoại:</strong> {selectedContact.phone}
                </p>
                <p>
                  <strong>Chủ đề:</strong> {selectedContact.subject}
                </p>
                <p>
                  <strong>Ngày:</strong> {selectedContact.date}
                </p>
                <div>
                  <strong>Nội dung:</strong>
                  <p className="mt-2 p-3 bg-muted rounded">{selectedContact.message}</p>
                </div>
                <div className="flex gap-2 pt-4">
                  {selectedContact.status !== "read" && (
                    <Button
                      size="sm"
                      onClick={() => {
                        updateContactStatus(selectedContact.id, "read")
                        setSelectedContact(null)
                      }}
                    >
                      Đánh dấu đã đọc
                    </Button>
                  )}
                  {selectedContact.status !== "replied" && (
                    <Button
                      size="sm"
                      onClick={() => {
                        updateContactStatus(selectedContact.id, "replied")
                        setSelectedContact(null)
                      }}
                    >
                      Đánh dấu đã trả lời
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
