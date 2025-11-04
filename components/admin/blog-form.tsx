"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useAdmin } from "@/lib/admin-context"
import { uploadToImgbb } from "@/lib/imgbb-upload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import TiptapEditor from "./tiptap-editor"
import { X, Star } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

interface BlogFormProps {
  editingId: number | null
  onClose: () => void
}

export default function BlogForm({ editingId, onClose }: BlogFormProps) {
  const { posts, addPost, updatePost } = useAdmin()
  const [uploading, setUploading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    image: "",
    category: "",
    date: new Date().toLocaleDateString("vi-VN"),
    tags: "" as string,
    seoDescription: "",
    isFeatured: false,
  })

  const existingCategories = Array.from(new Set(posts.map((p) => p.category)))
  const usedCategories = editingId ? [] : existingCategories

  useEffect(() => {
    if (editingId) {
      const post = posts.find((p) => p.id === editingId)
      if (post) {
        setFormData({
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          image: post.image,
          category: post.category,
          date: post.date,
          tags: (post as any).tags || "",
          seoDescription: (post as any).seoDescription || "",
          isFeatured: (post as any).isFeatured || false,
        })
        const dateParts = post.date.split(" ")
        if (dateParts.length >= 3) {
          const monthMap: { [key: string]: number } = {
            "Tháng 1": 0,
            "Tháng 2": 1,
            "Tháng 3": 2,
            "Tháng 4": 3,
            "Tháng 5": 4,
            "Tháng 6": 5,
            "Tháng 7": 6,
            "Tháng 8": 7,
            "Tháng 9": 8,
            "Tháng 10": 9,
            "Tháng 11": 10,
            "Tháng 12": 11,
          }
          const day = Number.parseInt(dateParts[0])
          const month = monthMap[dateParts[1]]
          const year = Number.parseInt(dateParts[3])
          if (!isNaN(day) && month !== undefined && !isNaN(year)) {
            setSelectedDate(new Date(year, month, day))
          }
        }
      }
    } else {
      // Reset form when adding new post
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        image: "",
        category: "",
        date: new Date().toLocaleDateString("vi-VN"),
        tags: "",
        seoDescription: "",
        isFeatured: false,
      })
      setSelectedDate(new Date())
    }
  }, [editingId, posts])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const result = await uploadToImgbb(file)
      if (result.success && result.url) {
        setFormData({ ...formData, image: result.url })
      } else {
        alert(result.error || "Tải ảnh lên thất bại")
      }
    } catch (error) {
      console.error("Upload failed:", error)
      alert("Tải ảnh lên thất bại")
    } finally {
      setUploading(false)
    }
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
      const formattedDate = format(date, "dd 'Tháng' MM, yyyy", { locale: vi })
      setFormData({ ...formData, date: formattedDate })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const postData = {
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      image: formData.image,
      category: formData.category,
      date: formData.date,
      tags: formData.tags,
      seoDescription: formData.seoDescription,
      isFeatured: formData.isFeatured,
    }

    let result
    if (editingId) {
      result = await updatePost(editingId, postData)
    } else {
      result = await addPost(postData)
    }

    if (!result.success) {
      // Toast will be shown from admin-context
      return
    }

    setFormData({
      title: "",
      excerpt: "",
      content: "",
      image: "",
      category: "",
      date: new Date().toLocaleDateString("vi-VN"),
      tags: "",
      seoDescription: "",
      isFeatured: false,
    })
    setSelectedDate(new Date())
    onClose()
  }

  const renderPreview = (html: string) => {
    return <div className="prose prose-sm max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: html }} />
  }

  return (
    <Card className="p-6 mb-6 max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-foreground">{editingId ? "Sửa Bài viết" : "Thêm Bài viết"}</h3>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="text-sm px-3 py-1 bg-secondary/20 text-primary rounded hover:bg-secondary/30 transition"
        >
          {showPreview ? "Ẩn xem trước" : "Xem trước"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Tiêu đề</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Nhập tiêu đề bài viết"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Ngày đăng</label>
            <Popover>
              <PopoverTrigger asChild>
                <Input
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  placeholder="Chọn ngày đăng"
                  required
                  readOnly
                />
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={selectedDate} onSelect={handleDateSelect} />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Mô tả ngắn</label>
          <Textarea
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            placeholder="Nhập mô tả ngắn (hiển thị trên danh sách)"
            required
            rows={2}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Mô tả SEO</label>
          <Textarea
            value={formData.seoDescription}
            onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
            placeholder="Nhập mô tả SEO (160 ký tự)"
            rows={2}
            maxLength={160}
          />
          <p className="text-xs text-foreground/60 mt-1">{formData.seoDescription.length}/160</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Hình ảnh bài viết (Hero Image)</label>
          <div className="flex gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="flex-1 px-4 py-2 border border-secondary/20 rounded-lg focus:outline-none focus:border-primary"
            />
            {uploading && <span className="text-sm text-foreground/60">Đang tải...</span>}
          </div>
          {formData.image && (
            <div className="mt-2 relative">
              <ImageWithFallback
                src={formData.image}
                alt="Preview"
                className="w-full h-48 object-cover rounded"
              />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, image: "" })}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded hover:bg-red-600"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Danh mục</label>
            {!editingId && usedCategories.length > 0 && (
              <div className="mb-3 p-3 bg-secondary/10 rounded-lg">
                <p className="text-xs font-medium text-foreground/70 mb-2">Danh mục đã có:</p>
                <div className="flex flex-wrap gap-2">
                  {usedCategories.map((cat) => (
                    <span key={cat} className="px-2 py-1 bg-secondary/20 text-primary text-xs rounded">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <Input
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Ví dụ: Bền vững, Cuộc sống xanh"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Tags (cách nhau bằng dấu phẩy)</label>
            <Input
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="Ví dụ: eco, sustainable, green"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-secondary/10 rounded-lg">
          <input
            type="checkbox"
            id="isFeatured"
            checked={formData.isFeatured}
            onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
            className="w-4 h-4"
          />
          <label
            htmlFor="isFeatured"
            className="flex items-center gap-2 cursor-pointer text-sm font-medium text-foreground"
          >
            <Star size={16} />
            Bài viết nổi bật
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Nội dung bài viết</label>
          <TiptapEditor
            content={formData.content}
            onChange={(html) => setFormData({ ...formData, content: html })}
            onImageUpload={async (insertImage) => {
              const input = document.createElement('input')
              input.type = 'file'
              input.accept = 'image/*'
              input.onchange = async (e: any) => {
                const file = e.target?.files?.[0]
                if (file) {
                  setUploading(true)
                  const result = await uploadToImgbb(file)
                  setUploading(false)
                  if (result.success && result.url) {
                    // Insert image directly into editor
                    insertImage(result.url)
                  } else {
                    alert('Lỗi upload ảnh: ' + (result.error || 'Unknown error'))
                  }
                }
              }
              input.click()
            }}
          />
        </div>

        {showPreview && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-foreground">Xem trước</h3>
            {renderPreview(formData.content)}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button type="button" onClick={onClose} variant="outline">
            Hủy bỏ
          </Button>
          <Button type="submit">Lưu bài viết</Button>
        </div>
      </form>
    </Card>
  )
}
