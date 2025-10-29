"use client"

import { useState } from "react"
import { Menu, X, Leaf, Phone, MapPin, ShoppingCart, Package } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { useAdmin } from "@/lib/admin-context"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { items } = useCart()
  const { media } = useAdmin()
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const logoMedia = media.find((m) => m.category === "logo")

  const handleLinkClick = () => {
    setIsOpen(false)
  }

  return (
    <>
      {/* Top Info Bar */}
      <div className="bg-primary text-primary-foreground text-sm py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center">
          <div className="flex gap-8">
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span>158-158A Đào Duy Anh, Phường Đức Nhuận, TP.HCM</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} />
              <span>0826 071 111</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header - Long Frame Design */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-secondary/20">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href="/"
              className="flex-shrink-0 flex items-center px-3 py-2 rounded-lg hover:bg-primary/5 transition"
              onClick={handleLinkClick}
            >
              {logoMedia ? (
                <img
                  src={logoMedia.url || "/placeholder.svg"}
                  alt="EcoGood Logo"
                  className="h-10 w-10 rounded-md object-cover flex-shrink-0"
                />
              ) : (
                <Leaf size={32} className="text-primary flex-shrink-0" />
              )}
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-8">
              <a href="/" className="text-foreground hover:text-primary transition font-medium">
                Trang chủ
              </a>
              <a href="/about" className="text-foreground hover:text-primary transition font-medium">
                Về chúng tôi
              </a>
              <a href="/products" className="text-foreground hover:text-primary transition font-medium">
                Sản phẩm
              </a>
              <a href="/careers" className="text-foreground hover:text-primary transition font-medium">
                Tuyển dụng
              </a>
              <a href="/blog" className="text-foreground hover:text-primary transition font-medium">
                Blog
              </a>
              <a href="/faq" className="text-foreground hover:text-primary transition font-medium">
                FAQ
              </a>
              <a href="/contact" className="text-foreground hover:text-primary transition font-medium">
                Liên hệ
              </a>
            </nav>

            <div className="flex items-center gap-4">
              <Link href="/orders" className="relative" onClick={handleLinkClick}>
                <Package size={24} className="text-primary hover:text-primary/80 transition" />
              </Link>
              <Link href="/cart" className="relative" onClick={handleLinkClick}>
                <ShoppingCart size={24} className="text-primary hover:text-primary/80 transition" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-secondary text-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden text-foreground" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {isOpen && (
            <nav className="md:hidden pb-4 border-t border-border pt-4 bg-background/95 backdrop-blur-sm">
              <div className="space-y-1">
                <a
                  href="/"
                  className="block px-4 py-3 text-foreground hover:bg-primary/10 hover:text-primary transition font-medium rounded-lg"
                  onClick={handleLinkClick}
                >
                  Trang chủ
                </a>
                <a
                  href="/about"
                  className="block px-4 py-3 text-foreground hover:bg-primary/10 hover:text-primary transition font-medium rounded-lg"
                  onClick={handleLinkClick}
                >
                  Về chúng tôi
                </a>
                <a
                  href="/products"
                  className="block px-4 py-3 text-foreground hover:bg-primary/10 hover:text-primary transition font-medium rounded-lg"
                  onClick={handleLinkClick}
                >
                  Sản phẩm
                </a>
                <a
                  href="/careers"
                  className="block px-4 py-3 text-foreground hover:bg-primary/10 hover:text-primary transition font-medium rounded-lg"
                  onClick={handleLinkClick}
                >
                  Tuyển dụng
                </a>
                <a
                  href="/blog"
                  className="block px-4 py-3 text-foreground hover:bg-primary/10 hover:text-primary transition font-medium rounded-lg"
                  onClick={handleLinkClick}
                >
                  Blog
                </a>
                <a
                  href="/faq"
                  className="block px-4 py-3 text-foreground hover:bg-primary/10 hover:text-primary transition font-medium rounded-lg"
                  onClick={handleLinkClick}
                >
                  FAQ
                </a>
                <a
                  href="/contact"
                  className="block px-4 py-3 text-foreground hover:bg-primary/10 hover:text-primary transition font-medium rounded-lg"
                  onClick={handleLinkClick}
                >
                  Liên hệ
                </a>
              </div>
            </nav>
          )}
        </div>
      </header>
    </>
  )
}
