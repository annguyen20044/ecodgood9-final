"use client"

import { useRealtimeProducts } from "@/lib/use-realtime-data"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { Loading } from "@/components/ui/loading"
import type React from "react"

const formatPrice = (price: number) => {
  return (price / 1000).toLocaleString("vi-VN") + ".000 đ"
}

export default function RealtimeProducts() {
  const { products, isLoading } = useRealtimeProducts()
  const { addToCart } = useCart()

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>, product: any) => {
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

  if (isLoading) {
    return <Loading />
  }

  return (
    <section id="products" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-primary mb-2">Sản phẩm nổi bật</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.slice(0, 3).map((product) => (
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
                  <h3 className="text-lg font-semibold text-card-foreground mb-2 line-clamp-2 h-14">{product.name}</h3>
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
      </div>
    </section>
  )
}
