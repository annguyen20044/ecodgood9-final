"use client"

import { Mail, Phone, MapPin, Facebook, Instagram, Leaf } from "lucide-react"
import { useAdmin } from "@/lib/admin-context"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"

export default function Footer() {
  const { media } = useAdmin()

  const logoMedia = media.find((m) => m.category === "logo")

  return (
    <footer id="contact" className="bg-primary text-primary-foreground py-12 md:py-16">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 mb-10 md:mb-12">
            {/* Logo & Description - Wider column */}
            <div className="md:col-span-1">
              <div className="mb-6">
                <img
                  src="/Logo_2_2@4x.png"
                  alt="EcoGood Logo"
                  className="h-20 w-auto object-contain"
                />
              </div>
              <p className="text-primary-foreground/90 text-sm leading-relaxed mb-6">
                Mang đến những sản phẩm bền vững cho tương lai xanh hơn
              </p>
              {/* Social Links moved here */}
              <div className="flex gap-3 mt-4">
                <a
                  href="https://facebook.com/ecogood"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-secondary/20 hover:bg-secondary hover:text-primary rounded-lg transition-all duration-300 hover:scale-110"
                  aria-label="Facebook"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="https://instagram.com/ecogood"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-secondary/20 hover:bg-secondary hover:text-primary rounded-lg transition-all duration-300 hover:scale-110"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </a>
              </div>
            </div>

            {/* Sản phẩm */}
            <div>
              <h4 className="font-bold mb-4 text-secondary text-base">Sản phẩm</h4>
              <ul className="space-y-2.5 text-primary-foreground/90 text-sm">
                <li>
                  <a href="/products" className="hover:text-secondary transition-colors duration-200 hover:translate-x-1 inline-block">
                    Tất cả sản phẩm
                  </a>
                </li>
                <li>
                  <a href="/products" className="hover:text-secondary transition-colors duration-200 hover:translate-x-1 inline-block">
                    Túi tái sử dụng
                  </a>
                </li>
                <li>
                  <a href="/products" className="hover:text-secondary transition-colors duration-200 hover:translate-x-1 inline-block">
                    Chai nước Bamboo
                  </a>
                </li>
                <li>
                  <a href="/products" className="hover:text-secondary transition-colors duration-200 hover:translate-x-1 inline-block">
                    Sản phẩm tự nhiên
                  </a>
                </li>
              </ul>
            </div>

            {/* Công ty */}
            <div>
              <h4 className="font-bold mb-4 text-secondary text-base">Công ty</h4>
              <ul className="space-y-2.5 text-primary-foreground/90 text-sm">
                <li>
                  <a href="/about" className="hover:text-secondary transition-colors duration-200 hover:translate-x-1 inline-block">
                    Về chúng tôi
                  </a>
                </li>
                <li>
                  <a href="/blog" className="hover:text-secondary transition-colors duration-200 hover:translate-x-1 inline-block">
                    Blog & Tin tức
                  </a>
                </li>
                <li>
                  <a href="/about" className="hover:text-secondary transition-colors duration-200 hover:translate-x-1 inline-block">
                    Chính sách bền vững
                  </a>
                </li>
                <li>
                  <a href="/cart" className="hover:text-secondary transition-colors duration-200 hover:translate-x-1 inline-block">
                    Giỏ hàng
                  </a>
                </li>
              </ul>
            </div>

            {/* Liên hệ */}
            <div>
              <h4 className="font-bold mb-4 text-secondary text-base">Liên hệ</h4>
              <div className="space-y-3 text-sm">
                <a href="tel:0826071111" className="flex items-center gap-2.5 group hover:text-secondary transition">
                  <div className="p-1.5 bg-secondary/20 rounded-lg group-hover:bg-secondary/30 transition">
                    <Phone size={16} className="text-secondary" />
                  </div>
                  <span className="text-primary-foreground/90">0826 071 111</span>
                </a>
                <a href="mailto:Giaminh.ecogood68@gmail.com" className="flex items-center gap-2.5 group hover:text-secondary transition">
                  <div className="p-1.5 bg-secondary/20 rounded-lg group-hover:bg-secondary/30 transition">
                    <Mail size={16} className="text-secondary" />
                  </div>
                  <span className="text-primary-foreground/90 break-all">Giaminh.ecogood68@gmail.com</span>
                </a>
                <a 
                  href="https://maps.google.com/?q=158-158A+Đào+Duy+Anh,+Phường+Đức+Nhuận,+TP.HCM" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 group hover:text-secondary transition"
                >
                  <div className="p-1.5 bg-secondary/20 rounded-lg group-hover:bg-secondary/30 transition flex-shrink-0">
                    <MapPin size={16} className="text-secondary" />
                  </div>
                  <span className="text-primary-foreground/90 leading-relaxed">
                    158-158A Đào Duy Anh, Phường Đức Nhuận, TP.HCM
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-primary-foreground/20 pt-8 text-center">
            <p className="text-primary-foreground/80 text-base">
              &copy; 2025 EcoGood. Tất cả quyền được bảo lưu. Cam kết bền vững cho tương lai.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
