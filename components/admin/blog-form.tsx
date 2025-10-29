"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAdmin } from "@/lib/admin-context"
import { uploadToImgbb } from "@/lib/imgbb-upload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Bold,
  Italic,
  List,
  Heading2,
  X,
  Code,
  Link2,
  Heading1,
  Heading3,
  ListOrdered,
  Underline,
  Strikethrough,
  Quote,
  Minus,
  Star,
} from "lucide-react"
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

  const insertTag = (openTag: string, closeTag: string) => {
    const textarea = document.getElementById("content") as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = formData.content.substring(start, end)
    const newContent =
      closeTag === ""
        ? formData.content.substring(0, start) + openTag + formData.content.substring(end)
        : formData.content.substring(0, start) + openTag + selectedText + closeTag + formData.content.substring(end)

    setFormData({ ...formData, content: newContent })
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + openTag.length, start + openTag.length + selectedText.length)
    }, 0)
  }

  const insertImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const result = await uploadToImgbb(file)
      if (result.success && result.url) {
        const imgTag = `<img src="${result.url}" alt="Ảnh bài viết" style="max-width: 100%; height: auto; margin: 10px 0;" />`
        setFormData({ ...formData, content: formData.content + "\n" + imgTag })
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
          <div className="border border-secondary/30 rounded-lg overflow-hidden">
            <div className="bg-secondary/10 p-2 flex gap-1 flex-wrap border-b border-secondary/30">
              <button
                type="button"
                onClick={() => insertTag("<h1>", "</h1>")}
                className="p-2 hover:bg-secondary/20 rounded transition"
                title="Heading 1"
              >
                <Heading1 size={18} />
              </button>
              <button
                type="button"
                onClick={() => insertTag("<h2>", "</h2>")}
                className="p-2 hover:bg-secondary/20 rounded transition"
                title="Heading 2"
              >
                <Heading2 size={18} />
              </button>
              <button
                type="button"
                onClick={() => insertTag("<h3>", "</h3>")}
                className="p-2 hover:bg-secondary/20 rounded transition"
                title="Heading 3"
              >
                <Heading3 size={18} />
              </button>
              <div className="w-px bg-secondary/30"></div>

              <button
                type="button"
                onClick={() => insertTag("<strong>", "</strong>")}
                className="p-2 hover:bg-secondary/20 rounded transition"
                title="Bold"
              >
                <Bold size={18} />
              </button>
              <button
                type="button"
                onClick={() => insertTag("<em>", "</em>")}
                className="p-2 hover:bg-secondary/20 rounded transition"
                title="Italic"
              >
                <Italic size={18} />
              </button>
              <button
                type="button"
                onClick={() => insertTag("<u>", "</u>")}
                className="p-2 hover:bg-secondary/20 rounded transition"
                title="Underline"
              >
                <Underline size={18} />
              </button>
              <button
                type="button"
                onClick={() => insertTag("<s>", "</s>")}
                className="p-2 hover:bg-secondary/20 rounded transition"
                title="Strikethrough"
              >
                <Strikethrough size={18} />
              </button>
              <div className="w-px bg-secondary/30"></div>

              <button
                type="button"
                onClick={() => insertTag("<ul><li>", "</li></ul>")}
                className="p-2 hover:bg-secondary/20 rounded transition"
                title="Unordered List"
              >
                <List size={18} />
              </button>
              <button
                type="button"
                onClick={() => insertTag("<ol><li>", "</li></ol>")}
                className="p-2 hover:bg-secondary/20 rounded transition"
                title="Ordered List"
              >
                <ListOrdered size={18} />
              </button>
              <button
                type="button"
                onClick={() => insertTag("<blockquote>", "</blockquote>")}
                className="p-2 hover:bg-secondary/20 rounded transition"
                title="Quote"
              >
                <Quote size={18} />
              </button>
              <button
                type="button"
                onClick={() => insertTag("<hr />", "")}
                className="p-2 hover:bg-secondary/20 rounded transition"
                title="Horizontal Line"
              >
                <Minus size={18} />
              </button>
              <div className="w-px bg-secondary/30"></div>

              <button
                type="button"
                onClick={() => insertTag('<a href="">', "</a>")}
                className="p-2 hover:bg-secondary/20 rounded transition"
                title="Link"
              >
                <Link2 size={18} />
              </button>
              <button
                type="button"
                onClick={() => insertTag("<code>", "</code>")}
                className="p-2 hover:bg-secondary/20 rounded transition"
                title="Code"
              >
                <Code size={18} />
              </button>
              <div className="w-px bg-secondary/30"></div>
              
              <label className="p-2 hover:bg-secondary/20 rounded transition cursor-pointer" title="Chèn ảnh">
                <input
                  type="file"
                  accept="image/*"
                  onChange={insertImage}
                  className="hidden"
                  disabled={uploading}
                />
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </label>
            </div>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Nhập nội dung bài viết"
              required
              rows={10}
            />
          </div>
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
