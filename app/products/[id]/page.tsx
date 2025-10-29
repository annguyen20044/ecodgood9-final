"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useAdmin } from "@/lib/admin-context"
import { useCart } from "@/lib/cart-context"
import { useState, useEffect, use } from "react"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"

const formatPrice = (price: number) => {
  return (price / 1000).toLocaleString("vi-VN") + ".000 đ"
}

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { products } = useAdmin()
  const { addToCart } = useCart()
  const [isAdded, setIsAdded] = useState(false)
  const { id } = use(params)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  const product = products.find((p) => p.id === Number.parseInt(id))

  if (!product) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="py-16 text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Sản phẩm không tìm thấy</h1>
          <Link href="/products" className="text-primary hover:text-primary/80">
            Quay lại sản phẩm
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    })
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-secondary/10 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/products" className="flex items-center gap-2 text-primary hover:text-primary/80 transition">
            <ArrowLeft size={20} />
            Quay lại sản phẩm
          </Link>
        </div>
      </div>

      {/* Product Detail */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-primary mb-4">{product.name}</h1>
              <p className="text-2xl font-bold text-secondary mb-6">{formatPrice(product.price)}</p>
              <p className="text-foreground/80 mb-8 leading-relaxed">{product.description}</p>

              <div className="mb-8">
                <h3 className="text-xl font-bold text-primary mb-4">Thông tin sản phẩm</h3>
                <div className="space-y-3 text-foreground/80">
                  <div className="flex justify-between">
                    <span>Danh mục:</span>
                    <span className="font-semibold">{product.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tồn kho:</span>
                    <span className={`font-semibold ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                      {product.stock > 0 ? `${product.stock} sản phẩm` : "Hết hàng"}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`w-full py-3 rounded-lg font-bold transition ${
                  isAdded
                    ? "bg-green-600 text-white"
                    : product.stock === 0
                      ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {isAdded ? "✓ Đã thêm vào giỏ" : product.stock === 0 ? "Hết hàng" : "Thêm vào giỏ hàng"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
