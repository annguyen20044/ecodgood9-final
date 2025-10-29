"use client"

import type React from "react"

import { useState } from "react"
import { useAdmin } from "@/lib/admin-context"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Mail, Phone, MapPin } from "lucide-react"
import { toast } from "sonner"

export default function Contact() {
  const { addContact } = useAdmin()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      addContact({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
        date: new Date().toLocaleDateString("vi-VN"),
        status: "new",
      })

      toast.success("Cảm ơn bạn! Chúng tôi sẽ liên hệ với bạn sớm.", {
        position: "bottom-right",
        duration: 3000,
      })

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      console.error("Contact form error:", error)
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.", {
        position: "bottom-right",
        duration: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Liên hệ với chúng tôi</h1>
          <p className="text-lg opacity-90">Chúng tôi sẵn sàng trả lời mọi câu hỏi của bạn</p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold text-primary mb-8">Thông tin liên hệ</h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <MapPin size={24} className="text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-primary mb-2">Địa chỉ</h3>
                    <p className="text-foreground/80">158-158A Đào Duy Anh, Phường Đức Nhuận, TP.HCM</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Phone size={24} className="text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-primary mb-2">Số điện thoại</h3>
                    <p className="text-foreground/80">0826 071 111</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Mail size={24} className="text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-primary mb-2">Email</h3>
                    <p className="text-foreground/80">Giaminh.ecogood68@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-primary mb-8">Gửi tin nhắn</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-foreground font-medium mb-2">Tên của bạn</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-secondary/20 rounded-lg focus:outline-none focus:border-primary"
                    placeholder="Nhập tên của bạn"
                  />
                </div>

                <div>
                  <label className="block text-foreground font-medium mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-secondary/20 rounded-lg focus:outline-none focus:border-primary"
                    placeholder="Nhập email của bạn"
                  />
                </div>

                <div>
                  <label className="block text-foreground font-medium mb-2">Số điện thoại</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-secondary/20 rounded-lg focus:outline-none focus:border-primary"
                    placeholder="Nhập số điện thoại"
                  />
                </div>

                <div>
                  <label className="block text-foreground font-medium mb-2">Chủ đề</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-secondary/20 rounded-lg focus:outline-none focus:border-primary"
                    placeholder="Nhập chủ đề"
                  />
                </div>

                <div>
                  <label className="block text-foreground font-medium mb-2">Tin nhắn</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2 border border-secondary/20 rounded-lg focus:outline-none focus:border-primary"
                    placeholder="Nhập tin nhắn của bạn"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:bg-primary/90 transition disabled:opacity-50"
                >
                  {loading ? "Đang gửi..." : "Gửi tin nhắn"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
