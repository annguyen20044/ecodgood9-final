"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAdmin } from "@/lib/admin-context"
import { generateSKU } from "@/lib/sku-generator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"

interface ProductFormProps {
  editingId: number | null
  onClose: () => void
}

export default function ProductForm({ editingId, onClose }: ProductFormProps) {
  const { products, addProduct, updateProduct, getMediaByCategory } = useAdmin()
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
    category: "",
    sku: "",
    stock: "",
  })

  const existingCategories = Array.from(new Set(products.map((p) => p.category)))
  const usedCategories = editingId ? [] : existingCategories
  const productMedia = getMediaByCategory("product")

  useEffect(() => {
    if (editingId) {
      const product = products.find((p) => p.id === editingId)
      if (product) {
        setFormData({
          name: product.name,
          price: product.price.toString(),
          image: product.image,
          description: product.description,
          category: product.category,
          sku: product.sku,
          stock: product.stock.toString(),
        })
      }
    }
  }, [editingId, products])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataToSend,
      })

      const data = await response.json()
      if (data.url) {
        setFormData({ ...formData, image: data.url })
      } else {
        alert("Tải ảnh lên thất bại: " + (data.error || "Lỗi không xác định"))
      }
    } catch (error) {
      console.error("Upload failed:", error)
      alert("Tải ảnh lên thất bại")
    } finally {
      setUploading(false)
    }
  }

  const handleNameChange = (newName: string) => {
    setFormData({ ...formData, name: newName })
    if (!editingId && newName.trim()) {
      setFormData((prev) => ({
        ...prev,
        sku: generateSKU(newName),
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const priceNum = Number.parseFloat(formData.price)
    if (isNaN(priceNum)) {
      alert("Giá phải là số")
      return
    }

    const stockNum = Number.parseInt(formData.stock)
    if (isNaN(stockNum)) {
      alert("Số lượng phải là số")
      return
    }

    if (!formData.sku.trim()) {
      alert("SKU không được để trống")
      return
    }

    const productData = {
      name: formData.name,
      price: priceNum,
      image: formData.image,
      description: formData.description,
      category: formData.category,
      sku: formData.sku,
      stock: stockNum,
    }

    let result
    if (editingId) {
      result = await updateProduct(editingId, productData)
    } else {
      result = await addProduct(productData)
    }

    if (!result.success) {
      // Toast will be shown from admin-context
      return
    }

    setFormData({
      name: "",
      price: "",
      image: "",
      description: "",
      category: "",
      sku: "",
      stock: "",
    })
    onClose()
  }

  return (
    <Card className="p-6 mb-6">
      <h3 className="text-xl font-semibold text-foreground mb-4">{editingId ? "Sửa Sản phẩm" : "Thêm Sản phẩm"}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Tên sản phẩm</label>
          <Input
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Nhập tên sản phẩm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Giá (chỉ nhập số)</label>
          <Input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="Ví dụ: 89000"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Hình ảnh sản phẩm</label>
          <div className="space-y-3">
            {productMedia.length > 0 && (
              <div>
                <p className="text-xs font-medium text-foreground/70 mb-2">Chọn từ thư viện media:</p>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {productMedia.map((media) => (
                    <button
                      key={media.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, image: media.url })}
                      className={`relative aspect-square rounded border-2 overflow-hidden transition ${
                        formData.image === media.url
                          ? "border-primary bg-primary/10"
                          : "border-secondary/20 hover:border-primary/50"
                      }`}
                    >
                      <img
                        src={media.url || "/placeholder.svg"}
                        alt={media.name}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="flex-1"
              />
              {uploading && <span className="text-sm text-foreground/60">Đang tải...</span>}
            </div>
          </div>
          {formData.image && (
            <div className="mt-2 relative">
              <img
                src={formData.image || "/placeholder.svg"}
                alt="Preview"
                className="h-32 w-32 object-cover rounded"
              />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, image: "" })}
                className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded hover:bg-red-600"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Mô tả sản phẩm</label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Nhập mô tả chi tiết sản phẩm"
            required
          />
        </div>

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
              <p className="text-xs text-foreground/60 mt-2">Hãy chọn danh mục khác hoặc tạo danh mục mới</p>
            </div>
          )}
          <Input
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="Ví dụ: Túi xách, Đồ uống, Bộ ăn"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            SKU {!editingId && <span className="text-xs text-foreground/60">(Tự động tạo)</span>}
          </label>
          <Input
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            placeholder="Ví dụ: ECO-BAG-123456"
            readOnly={!editingId}
            className={!editingId ? "bg-secondary/10 cursor-not-allowed" : ""}
            required
          />
          {!editingId && (
            <p className="text-xs text-foreground/60 mt-1">SKU sẽ được tự động tạo dựa trên tên sản phẩm</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Số lượng tồn kho</label>
          <Input
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            placeholder="Ví dụ: 50"
            required
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
            {editingId ? "Cập nhật" : "Thêm"}
          </Button>
          <Button type="button" onClick={onClose} variant="outline" className="flex-1 bg-transparent">
            Hủy
          </Button>
        </div>
      </form>
    </Card>
  )
}
