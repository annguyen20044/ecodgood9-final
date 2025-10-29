"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAdmin } from "@/lib/admin-context"
import { useCart } from "@/lib/cart-context"
import Link from "next/link"
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react"

const formatPrice = (price: number) => {
  return (price / 1000).toLocaleString("vi-VN") + ".000 đ"
}

export default function ProductCarousel() {
  const { products } = useAdmin()
  const { addToCart } = useCart()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const itemsPerRow = 3
  const totalSlides = Math.ceil(products.length / itemsPerRow)

  useEffect(() => {
    if (!isAutoPlay || totalSlides <= 1) return

    const timer = setInterval(() => {
      setIsTransitioning(true)
      setCurrentIndex((prev) => (prev + 1) % totalSlides)
    }, 5000)

    return () => clearInterval(timer)
  }, [isAutoPlay, totalSlides])

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

  const nextSlide = () => {
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev + 1) % totalSlides)
    setIsAutoPlay(false)
  }

  const prevSlide = () => {
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides)
    setIsAutoPlay(false)
  }

  // Get current visible products
  const startIndex = currentIndex * itemsPerRow
  const visibleProducts = products.slice(startIndex, startIndex + itemsPerRow)

  return (
    <section id="products" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-primary mb-2">Sản phẩm nổi bật</h2>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Products Grid with smooth transition */}
          <div
            className={`grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-700 ease-in-out ${isTransitioning ? "opacity-100" : "opacity-100"}`}
          >
            {visibleProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <div className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col transform hover:scale-105">
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-64 object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-lg font-semibold text-card-foreground mb-2 line-clamp-2 h-14">
                      {product.name}
                    </h3>
                    <p className="text-foreground/70 text-sm mb-4 line-clamp-2 h-10 flex-1">{product.description}</p>
                    <div className="flex justify-between items-center gap-2 mt-auto">
                      <span className="text-primary font-bold text-lg">{formatPrice(product.price)}</span>
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 transform hover:scale-110"
                        title="Thêm vào giỏ hàng"
                        type="button"
                      >
                        <ShoppingCart size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Navigation Arrows - Only show if multiple slides */}
          {totalSlides > 1 && (
            <>
              <button
                onClick={prevSlide}
                onMouseEnter={() => setIsAutoPlay(false)}
                onMouseLeave={() => setIsAutoPlay(true)}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90 transition-all duration-300 transform hover:scale-110 z-10"
                aria-label="Previous products"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextSlide}
                onMouseEnter={() => setIsAutoPlay(false)}
                onMouseLeave={() => setIsAutoPlay(true)}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90 transition-all duration-300 transform hover:scale-110 z-10"
                aria-label="Next products"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>

        {/* Slide Indicators */}
        {totalSlides > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsTransitioning(true)
                  setCurrentIndex(index)
                  setIsAutoPlay(false)
                }}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex ? "bg-primary w-8 h-3" : "bg-secondary/50 hover:bg-secondary w-3 h-3"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
