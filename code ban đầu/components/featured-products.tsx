"use client"

import type React from "react"

import { useAdmin } from "@/lib/admin-context"
import { useCart } from "@/lib/cart-context"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"

const formatPrice = (price: number) => {
  return (price / 1000).toLocaleString("vi-VN") + ".000 đ"
}

export default function FeaturedProducts() {
  const { products } = useAdmin()
  const { addToCart } = useCart()

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

  const featuredProducts = [...products].reverse().slice(0, 3)

  return (
    <section id="products" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <div className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer h-full flex flex-col">
                <div className="relative">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-semibold text-card-foreground mb-2 line-clamp-2 h-14">{product.name}</h3>
                  <p className="text-foreground/70 text-sm mb-4 line-clamp-2 h-10 flex-1">{product.description}</p>
                  <div className="flex justify-between items-center gap-2 mt-auto">
                    <span className="text-primary font-bold text-lg">{formatPrice(product.price)}</span>
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition"
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
