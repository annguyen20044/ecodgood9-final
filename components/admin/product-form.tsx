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
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    images: [] as string[],
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
        // Hỗ trợ cả images (mảng) và image (string) để tương thích ngược
        const productImages = (product as any).images || []
        const hasImages = productImages.length > 0
        const productImage = product.image || ""
        
        setFormData({
          name: product.name,
          price: product.price.toString(),
          images: hasImages ? productImages : (productImage ? [productImage] : []),
          description: product.description,
          category: product.category,
          sku: product.sku,
          stock: product.stock.toString(),
        })
      }
    }
  }, [editingId, products])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const filesArray = Array.from(files)
    
    // Nếu có index, thay thế ảnh tại vị trí đó, nếu không thì thêm mới
    const uploadPromises = filesArray.map(async (file, fileIndex) => {
      const uploadIndex = index !== undefined ? index : formData.images.length + fileIndex
      setUploadingIndex(uploadIndex)
      
      try {
        const formDataToSend = new FormData()
        formDataToSend.append("file", file)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formDataToSend,
        })

        const data = await response.json()
        if (data.url) {
          return { url: data.url, index: uploadIndex }
        } else {
          throw new Error(data.error || "Lỗi không xác định")
        }
      } catch (error) {
        console.error("Upload failed:", error)
        throw error
      } finally {
        setUploadingIndex(null)
      }
    })

    try {
      const results = await Promise.all(uploadPromises)
      
      setFormData((prev) => {
        const newImages = [...prev.images]
        results.forEach(({ url, index }) => {
          if (index < newImages.length) {
            newImages[index] = url
          } else {
            newImages.push(url)
          }
        })
        return { ...prev, images: newImages }
      })
    } catch (error) {
      alert("Tải ảnh lên thất bại: " + (error instanceof Error ? error.message : "Lỗi không xác định"))
    } finally {
      setUploadingIndex(null)
    }
  }

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
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

    if (formData.images.length === 0) {
      alert("Phải có ít nhất một ảnh")
      return
    }

    const productData = {
      name: formData.name,
      price: priceNum,
      images: formData.images,
      image: formData.images[0], // Giữ lại image để tương thích ngược
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
      images: [],
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
          <label className="block text-sm font-medium text-foreground mb-2">
            Hình ảnh sản phẩm <span className="text-xs text-foreground/60">(có thể thêm nhiều ảnh)</span>
          </label>
          <div className="space-y-3">
            {productMedia.length > 0 && (
              <div>
                <p className="text-xs font-medium text-foreground/70 mb-2">Chọn từ thư viện media:</p>
                <div className="grid grid-cols-4 gap-2 mb-3 max-h-48 overflow-y-auto">
                  {productMedia.map((media) => (
                    <button
                      key={media.id}
                      type="button"
                      onClick={() => {
                        if (!formData.images.includes(media.url)) {
                          setFormData((prev) => ({
                            ...prev,
                            images: [...prev.images, media.url],
                          }))
                        }
                      }}
                      className={`relative aspect-square rounded border-2 overflow-hidden transition ${
                        formData.images.includes(media.url)
                          ? "border-primary bg-primary/10"
                          : "border-secondary/20 hover:border-primary/50"
                      }`}
                    >
                      <img
                        src={media.url || "/placeholder.svg"}
                        alt={media.name}
                        className="w-full h-full object-cover"
                      />
                      {formData.images.includes(media.url) && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <span className="text-xs font-semibold text-primary">✓</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-2">
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={uploadingIndex !== null}
                className="flex-1"
              />
              {uploadingIndex !== null && (
                <span className="text-sm text-foreground/60 flex items-center">
                  Đang tải {uploadingIndex !== null ? `${uploadingIndex + 1}` : ""}...
                </span>
              )}
            </div>
          </div>
          
          {/* Hiển thị danh sách ảnh đã chọn */}
          {formData.images.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-medium text-foreground/70 mb-2">
                {formData.images.length} ảnh đã chọn:
              </p>
              <div className="grid grid-cols-4 gap-3">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img || "/placeholder.svg"}
                      alt={`Preview ${index + 1}`}
                      className="w-full aspect-square object-cover rounded border-2 border-secondary/20"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Xóa ảnh"
                    >
                      <X size={14} />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded">
                        Ảnh chính
                      </div>
                    )}
                  </div>
                ))}
              </div>
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
          <div className="mb-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
            <p className="text-xs font-medium text-foreground/70 mb-2">Danh mục khuyến nghị (để liên kết với trang chủ):</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {["Túi & Bao bì", "Chai & Ly", "Đồ gia dụng", "Chăm sóc cá nhân"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat })}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    formData.category === cat
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "bg-white border border-primary/20 text-primary hover:bg-primary/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <p className="text-xs text-foreground/60">Hoặc nhập danh mục tùy chỉnh bên dưới</p>
          </div>
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
            placeholder="Nhập hoặc chọn danh mục ở trên"
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
