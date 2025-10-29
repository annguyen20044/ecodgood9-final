"use client"

import { useState } from "react"
import { useAdmin } from "@/lib/admin-context"
import { Button } from "@/components/ui/button"
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
import BlogForm from "./blog-form"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"

export default function BlogManagement() {
  const { posts, deletePost } = useAdmin()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  const handleDeleteConfirm = (id: number) => {
    deletePost(id)
    setDeleteConfirm(null)
  }

  const handleAddNew = () => {
    setEditingId(null)
    setShowForm(true)
  }

  const handleEdit = (id: number) => {
    setEditingId(id)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Bài viết Blog</h2>
        <Button onClick={handleAddNew} className="bg-primary text-primary-foreground hover:bg-primary/90">
          {showForm && editingId === null ? "Hủy" : "Thêm Bài viết"}
        </Button>
      </div>

      {showForm && <BlogForm editingId={editingId} onClose={handleCloseForm} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <Card key={post.id} className="overflow-hidden">
            <ImageWithFallback src={post.image} alt={post.title} className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-foreground mb-2">{post.title}</h3>
              <p className="text-foreground/70 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
              <div className="flex gap-2">
                <Button onClick={() => handleEdit(post.id)} variant="outline" className="flex-1">
                  Sửa
                </Button>
                <AlertDialog open={deleteConfirm === post.id} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
                  <Button
                    onClick={() => setDeleteConfirm(post.id)}
                    variant="outline"
                    className="flex-1 text-destructive hover:bg-destructive/10"
                  >
                    Xóa
                  </Button>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Xác nhận xóa bài viết</AlertDialogTitle>
                      <AlertDialogDescription>
                        Bạn có chắc chắn muốn xóa bài viết "{post.title}"? Hành động này không thể hoàn tác.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteConfirm(post.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Xóa
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
