"use client"

import type React from "react"
import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { useAdmin } from "@/lib/admin-context"
import { ShoppingCart, Leaf, Sparkles, X } from 'lucide-react'
import { ImageWithFallback } from "@/components/ui/image-with-fallback"
import { Loading } from "@/components/ui/loading"

const formatPrice = (price: number) => {
  return (price / 1000).toLocaleString("vi-VN") + ".000 đ"
}

// Mapping giữa category slug và category name
const categoryMap: Record<string, string> = {
  bags: "Túi & Bao bì",
  bottles: "Chai & Ly",
  kitchen: "Đồ gia dụng",
  personal: "Chăm sóc cá nhân"
}

function ProductsContent() {
  const { addToCart } = useCart()
  const { products } = useAdmin()
  const searchParams = useSearchParams()
  const categorySlug = searchParams.get("category")
  
  // Filter products theo category
  const filteredProducts = categorySlug && categoryMap[categorySlug]
    ? products.filter((p) => p.category === categoryMap[categorySlug])
    : products
  
  const categoryName = categorySlug ? categoryMap[categorySlug] : null
  const productCount = filteredProducts.length

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>, product: (typeof products)[0]) => {
    e.preventDefault()
    e.stopPropagation()

    if (!product) {
      console.error("[v0] Product not found")
      return
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    })
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-primary/5">
      <Header />

      {/* Hero Section - Optimized */}
      <section className="relative bg-gradient-to-r from-primary to-primary/90 text-primary-foreground py-12 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-secondary rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Leaf className="w-10 h-10 text-secondary" />
                <h1 className="text-3xl md:text-4xl font-bold">
                  {categoryName ? categoryName : "Sản phẩm EcoGood"}
                </h1>
              </div>
              <p className="text-base md:text-lg opacity-90 max-w-2xl">
                {categoryName 
                  ? `${productCount} sản phẩm trong danh mục ${categoryName.toLowerCase()}`
                  : "Khám phá bộ sưu tập sản phẩm bền vững, thân thiện với môi trường"
                }
              </p>
            </div>
            {categoryName && (
              <Link 
                href="/products"
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-colors text-sm font-medium"
              >
                <X size={16} />
                Xóa bộ lọc
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Products Grid - Optimized */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <Sparkles className="w-16 h-16 text-primary mx-auto mb-4 opacity-50" />
              <p className="text-xl text-foreground/70">
                {categoryName 
                  ? `Chưa có sản phẩm nào trong danh mục "${categoryName}"`
                  : "Chưa có sản phẩm nào"
                }
              </p>
              {categoryName && (
                <Link 
                  href="/products"
                  className="mt-4 inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-secondary hover:text-primary transition-colors"
                >
                  Xem tất cả sản phẩm
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {filteredProducts.map((product) => {
                // Hỗ trợ cả images (mảng) và image (string) để tương thích ngược
                const productImages = (product as any).images && (product as any).images.length > 0
                  ? (product as any).images
                  : product.image ? [product.image] : []
                const displayImage = productImages[0] || product.image
                
                return (
                <Link key={product.id} href={`/products/${product.id}`}>
                  <div className="group bg-white border border-secondary/10 rounded-xl overflow-hidden hover:shadow-xl hover:border-secondary/30 transition-all duration-300 cursor-pointer h-full hover:-translate-y-1">
                    {/* Image Container */}
                    <div className="relative overflow-hidden aspect-[4/3]">
                      <ImageWithFallback
                        src={displayImage}
                        alt={product.name}
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
                        {product.name}
                      </h3>
                      <p className="text-foreground/60 mb-3 text-xs leading-relaxed line-clamp-2 min-h-[32px]">
                        {product.description}
                      </p>
                      
                      {/* Price & Add to Cart */}
                      <div className="flex justify-between items-center gap-2 pt-3 border-t border-secondary/10">
                        <div>
                          <span className="text-lg font-bold text-primary block">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                        <button
                          onClick={(e) => handleAddToCart(e, product)}
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
              )})}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default function Products() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-b from-background to-primary/5">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loading />
        </div>
        <Footer />
      </main>
    }>
      <ProductsContent />
    </Suspense>
  )
}
