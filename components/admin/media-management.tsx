"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useAdmin } from "@/lib/admin-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trash2, Upload, ImageIcon, Copy } from "lucide-react"

export default function MediaManagement() {
  const { media, addMedia, deleteMedia, getMediaByCategory } = useAdmin()
  const [selectedCategory, setSelectedCategory] = useState<"product" | "blog" | "general" | "logo">("product")
  const [uploading, setUploading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (!files) return

    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        const reader = new FileReader()
        reader.onload = (event) => {
          const base64 = event.target?.result as string
          const newMedia = {
            id: `media-${Date.now()}-${Math.random()}`,
            name: file.name,
            url: base64,
            category: selectedCategory,
            uploadedAt: new Date().toISOString(),
            size: file.size,
          }
          addMedia(newMedia)
        }
        reader.readAsDataURL(file)
      }
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const categoryMedia = getMediaByCategory(selectedCategory)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-2xl font-bold text-primary mb-6">Quản lý Media</h2>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(["product", "blog", "general", "logo"] as const).map((cat) => (
            <Button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }
            >
              {cat === "product" ? "Sản phẩm" : cat === "blog" ? "Blog" : cat === "logo" ? "Logo" : "Chung"}
            </Button>
          ))}
        </div>

        {/* Upload Section */}
        <div className="mb-8 p-6 border-2 border-dashed border-border rounded-lg bg-muted/30">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="text-center">
            <Upload className="mx-auto mb-3 text-muted-foreground" size={32} />
            <p className="text-foreground font-medium mb-2">Kéo thả hoặc nhấp để tải lên</p>
            <p className="text-sm text-muted-foreground mb-4">Hỗ trợ: JPG, PNG, GIF, WebP</p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-primary hover:bg-primary/90"
            >
              {uploading ? "Đang tải..." : "Chọn tệp"}
            </Button>
          </div>
        </div>

        {/* Media Grid */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Media ({categoryMedia.length})</h3>
          {categoryMedia.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ImageIcon size={48} className="mx-auto mb-3 opacity-50" />
              <p>Không có media nào trong danh mục này</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categoryMedia.map((file) => (
                <Card key={file.id} className="overflow-hidden hover:shadow-lg transition">
                  <div className="aspect-square bg-muted overflow-hidden">
                    <img src={file.url || "/placeholder.svg"} alt={file.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-foreground truncate mb-2">{file.name}</p>
                    <p className="text-xs text-muted-foreground mb-3">{formatFileSize(file.size)}</p>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleCopyUrl(file.url, file.id)}
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs"
                      >
                        <Copy size={14} className="mr-1" />
                        {copiedId === file.id ? "Đã sao" : "Sao"}
                      </Button>
                      <Button
                        onClick={() => deleteMedia(file.id)}
                        variant="outline"
                        size="sm"
                        className="flex-1 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
