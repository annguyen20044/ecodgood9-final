"use client"

import { Mail, Phone, MapPin, Facebook, Instagram, Leaf } from "lucide-react"
import { useAdmin } from "@/lib/admin-context"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"

export default function Footer() {
  const { media } = useAdmin()

  const logoMedia = media.find((m) => m.category === "logo")

  return (
    <footer id="contact" className="bg-primary text-primary-foreground py-8 md:py-12">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                {logoMedia ? (
                  <ImageWithFallback
                    src={logoMedia.url}
                    alt="EcoGood Logo"
                    className="h-10 w-10 rounded-md object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-md bg-white/90 flex items-center justify-center">
                    <Leaf className="h-6 w-6 text-primary" />
                  </div>
                )}
              </div>
              <p className="text-primary-foreground/90 text-sm md:text-base">
                Mang đến những sản phẩm bền vững cho tương lai xanh hơn
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-secondary text-sm md:text-base">Sản phẩm</h4>
              <ul className="space-y-2 text-primary-foreground/90 text-sm">
                <li>
                  <a href="#" className="hover:text-secondary transition">
                    Túi tái sử dụng
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-secondary transition">
                    Chai nước Bamboo
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-secondary transition">
                    Sản phẩm tự nhiên
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-secondary text-sm md:text-base">Công ty</h4>
              <ul className="space-y-2 text-primary-foreground/90 text-sm">
                <li>
                  <a href="#" className="hover:text-secondary transition">
                    Về chúng tôi
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-secondary transition">
                    Tuyển dụng
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-secondary transition">
                    Chính sách bền vững
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-secondary text-sm md:text-base">Liên hệ</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone size={18} className="text-secondary flex-shrink-0" />
                  <span className="text-primary-foreground/90 text-sm">0826 071 111</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={18} className="text-secondary flex-shrink-0" />
                  <span className="text-primary-foreground/90 text-sm">Giaminh.ecogood68@gmail.com</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin size={18} className="text-secondary flex-shrink-0 mt-0.5" />
                  <span className="text-primary-foreground/90 text-xs md:text-sm">
                    158-158A Đào Duy Anh, Phường Đức Nhuận, TP.HCM
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-secondary text-sm md:text-base">Kết nối</h4>
              <div className="flex gap-3">
                <a
                  href="https://facebook.com/ecogood"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded transition"
                  aria-label="Facebook"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="https://instagram.com/ecogood"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded transition"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-primary-foreground/20 pt-6 md:pt-8 text-center text-primary-foreground/90 text-sm">
            <p>&copy; 2025 EcoGood. Tất cả quyền được bảo lưu. Cam kết bền vững cho tương lai.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
