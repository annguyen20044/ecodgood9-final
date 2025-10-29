"use client"

import { Leaf, Droplet, Utensils, Home } from "lucide-react"
import Link from "next/link"

export default function Categories() {
  const categories = [
    {
      icon: Leaf,
      name: "Túi & Bao bì",
      description: "Túi tái sử dụng, bao bì phân hủy",
      color: "bg-green-100 text-green-600",
      href: "/products?category=bags"
    },
    {
      icon: Droplet,
      name: "Chai & Ly",
      description: "Bình nước, ly giữ nhiệt eco",
      color: "bg-blue-100 text-blue-600",
      href: "/products?category=bottles"
    },
    {
      icon: Utensils,
      name: "Đồ gia dụng",
      description: "Đồ dùng nhà bếp bền vững",
      color: "bg-yellow-100 text-yellow-600",
      href: "/products?category=kitchen"
    },
    {
      icon: Home,
      name: "Chăm sóc cá nhân",
      description: "Sản phẩm vệ sinh tự nhiên",
      color: "bg-pink-100 text-pink-600",
      href: "/products?category=personal"
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-background to-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Danh mục sản phẩm
          </h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Khám phá các sản phẩm xanh theo từng danh mục
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Link key={category.name} href={category.href}>
                <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-2 border border-secondary/10 hover:border-secondary/30">
                  <div className={`${category.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-secondary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-foreground/70 text-sm">
                    {category.description}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

