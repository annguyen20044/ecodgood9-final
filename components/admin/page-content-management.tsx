"use client"

import type React from "react"

import { useState } from "react"
import { useAdmin } from "@/lib/admin-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface PageContent {
  id: string
  title: string
  slug: string
  content: string
  metaDescription: string
}

const DEFAULT_PAGES: PageContent[] = [
  {
    id: "about",
    title: "Về chúng tôi",
    slug: "about",
    content: "Nội dung trang Về chúng tôi",
    metaDescription: "Tìm hiểu về EcoGood",
  },
  {
    id: "faq",
    title: "Câu hỏi thường gặp",
    slug: "faq",
    content: "Nội dung trang FAQ",
    metaDescription: "Câu hỏi thường gặp về EcoGood",
  },
  {
    id: "careers",
    title: "Tuyển dụng",
    slug: "careers",
    content: "Nội dung trang Tuyển dụng",
    metaDescription: "Cơ hội việc làm tại EcoGood",
  },
]

export default function PageContentManagement() {
  const { pages = [], updatePageContent } = useAdmin()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [formData, setFormData] = useState<PageContent>({
    id: "",
    title: "",
    slug: "",
    content: "",
    metaDescription: "",
  })

  const allPages = pages.length > 0 ? pages : DEFAULT_PAGES

  const handleEdit = (page: PageContent) => {
    setFormData(page)
    setEditingId(page.id)
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (updatePageContent) {
      updatePageContent(formData)
    }

    setFormData({
      id: "",
      title: "",
      slug: "",
      content: "",
      metaDescription: "",
    })
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Quản lý Nội dung Trang</h2>
        <Button
          onClick={() => {
            setEditingId(null)
            setFormData({
              id: "",
              title: "",
              slug: "",
              content: "",
              metaDescription: "",
            })
            setShowForm(!showForm)
          }}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {showForm ? "Hủy" : "Thêm Trang"}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 mb-6">
          <h3 className="text-xl font-semibold text-foreground mb-4">
            {editingId ? "Sửa Nội dung Trang" : "Thêm Trang Mới"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Tiêu đề Trang</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ví dụ: Về chúng tôi"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Slug (URL)</label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="Ví dụ: about"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Mô tả Meta (SEO)</label>
              <Textarea
                value={formData.metaDescription}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                placeholder="Mô tả ngắn cho công cụ tìm kiếm"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Nội dung Trang</label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Nhập nội dung trang"
                required
                rows={10}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                {editingId ? "Cập nhật" : "Thêm"}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingId(null)
                }}
                variant="outline"
                className="flex-1"
              >
                Hủy
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allPages.map((page) => (
          <Card key={page.id} className="p-4">
            <h3 className="font-semibold text-foreground mb-2">{page.title}</h3>
            <p className="text-foreground/70 text-sm mb-2">Slug: /{page.slug}</p>
            <p className="text-foreground/70 text-sm mb-4 line-clamp-2">{page.metaDescription}</p>
            <div className="flex gap-2">
              <Button onClick={() => handleEdit(page)} variant="outline" className="flex-1">
                Sửa
              </Button>
              <AlertDialog open={deleteConfirm === page.id} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
                <Button
                  onClick={() => setDeleteConfirm(page.id)}
                  variant="outline"
                  className="flex-1 text-destructive hover:bg-destructive/10"
                >
                  Xóa
                </Button>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Xác nhận xóa trang</AlertDialogTitle>
                    <AlertDialogDescription>
                      Bạn có chắc chắn muốn xóa trang "{page.title}"? Hành động này không thể hoàn tác.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        setDeleteConfirm(null)
                      }}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Xóa
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
