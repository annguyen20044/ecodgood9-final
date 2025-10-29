"use client"

import type React from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { useAdmin } from "@/lib/admin-context"
import { ShoppingCart } from 'lucide-react'

const formatPrice = (price: number) => {
  return (price / 1000).toLocaleString("vi-VN") + ".000 đ"
}

export default function Products() {
  const { addToCart } = useCart()
  const { products } = useAdmin()

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
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Sản phẩm EcoGood</h1>
          <p className="text-lg opacity-90">Khám phá bộ sưu tập sản phẩm bền vững của chúng tôi</p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <div className="bg-white border border-secondary/20 rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer h-full">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-primary mb-2">{product.name}</h3>
                    <p className="text-foreground/70 mb-4 text-sm">{product.description}</p>
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
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

      <Footer />
    </main>
  )
}
