"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { ArrowLeft, ChevronLeft, ChevronRight, ShoppingCart, Leaf } from "lucide-react"
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { id } = use(params)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  const product = products.find((p) => p.id === Number.parseInt(id))
  
  // Hỗ trợ cả images (mảng) và image (string) để tương thích ngược
  const productImages = product 
    ? ((product as any).images && (product as any).images.length > 0 
        ? (product as any).images 
        : product.image ? [product.image] : [])
    : []

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
      image: productImages[0] || product.image,
    })
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length)
  }

  const goToImage = (index: number) => {
    setCurrentImageIndex(index)
  }

  // Lấy sản phẩm liên quan (cùng danh mục, loại trừ sản phẩm hiện tại)
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4) // Giới hạn 4 sản phẩm

  const handleRelatedProductAddToCart = (e: React.MouseEvent<HTMLButtonElement>, relatedProduct: typeof products[0]) => {
    e.preventDefault()
    e.stopPropagation()

    addToCart({
      id: relatedProduct.id,
      name: relatedProduct.name,
      price: relatedProduct.price,
      quantity: 1,
      image: ((relatedProduct as any).images && (relatedProduct as any).images.length > 0)
        ? (relatedProduct as any).images[0]
        : relatedProduct.image,
    })
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
              {/* Image Gallery */}
              {productImages.length > 0 ? (
                <div className="space-y-4">
                  {/* Main Image */}
                  <div className="relative group">
                    <div className="relative overflow-hidden rounded-lg shadow-lg aspect-square bg-secondary/5">
                      <ImageWithFallback
                        src={productImages[currentImageIndex]}
                        alt={`${product.name} - Ảnh ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {productImages.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Ảnh trước"
                          >
                            <ChevronLeft size={20} />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Ảnh sau"
                          >
                            <ChevronRight size={20} />
                          </button>
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                            {currentImageIndex + 1} / {productImages.length}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Thumbnail Images */}
                  {productImages.length > 1 && (
                    <div className="grid grid-cols-4 gap-3">
                      {productImages.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => goToImage(index)}
                          className={`relative aspect-square overflow-hidden rounded-lg border-2 transition ${
                            index === currentImageIndex
                              ? "border-primary shadow-lg"
                              : "border-secondary/20 hover:border-primary/50"
                          }`}
                          aria-label={`Xem ảnh ${index + 1}`}
                        >
                          <ImageWithFallback
                            src={img}
                            alt={`${product.name} - Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {index === currentImageIndex && (
                            <div className="absolute inset-0 bg-primary/20"></div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full rounded-lg shadow-lg"
                />
              )}
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

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-16 bg-gradient-to-b from-background to-primary/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                Sản phẩm liên quan
              </h2>
              <p className="text-lg text-foreground/70">
                Khám phá thêm các sản phẩm cùng danh mục
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              {relatedProducts.map((relatedProduct) => {
                // Hỗ trợ cả images (mảng) và image (string) để tương thích ngược
                const relatedProductImages = (relatedProduct as any).images && (relatedProduct as any).images.length > 0
                  ? (relatedProduct as any).images
                  : relatedProduct.image ? [relatedProduct.image] : []
                const displayImage = relatedProductImages[0] || relatedProduct.image

                return (
                  <Link key={relatedProduct.id} href={`/products/${relatedProduct.id}`}>
                    <div className="group bg-white border border-secondary/10 rounded-xl overflow-hidden hover:shadow-xl hover:border-secondary/30 transition-all duration-300 cursor-pointer h-full hover:-translate-y-1">
                      {/* Image Container */}
                      <div className="relative overflow-hidden aspect-[4/3]">
                        <ImageWithFallback
                          src={displayImage}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-2 right-2">
                          <div className="bg-secondary/90 backdrop-blur-sm text-primary px-2 py-1 rounded-full flex items-center gap-1">
                            <Leaf size={12} />
                            <span className="text-xs font-semibold">Eco</span>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="text-base font-bold text-primary mb-2 group-hover:text-secondary transition-colors line-clamp-2 min-h-[48px]">
                          {relatedProduct.name}
                        </h3>
                        <p className="text-foreground/60 mb-3 text-xs leading-relaxed line-clamp-2 min-h-[32px]">
                          {relatedProduct.description}
                        </p>
                        
                        {/* Price & Add to Cart */}
                        <div className="flex justify-between items-center gap-2 pt-3 border-t border-secondary/10">
                          <div>
                            <span className="text-lg font-bold text-primary block">
                              {formatPrice(relatedProduct.price)}
                            </span>
                          </div>
                          <button
                            onClick={(e) => handleRelatedProductAddToCart(e, relatedProduct)}
                            className="group/btn flex items-center justify-center p-2 rounded-lg bg-primary text-primary-foreground hover:bg-secondary hover:text-primary transition-all duration-300 hover:scale-105"
                            title="Thêm vào giỏ hàng"
                            type="button"
                          >
                            <ShoppingCart size={18} className="group-hover/btn:rotate-12 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}
