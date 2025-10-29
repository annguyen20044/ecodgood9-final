"use client"

import { Star, Quote } from "lucide-react"
import { useState } from "react"

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const testimonials = [
    {
      name: "Nguyễn Thị Mai",
      role: "Khách hàng thân thiết",
      image: "/placeholder-user.jpg",
      rating: 5,
      content: "Tôi rất hài lòng với chất lượng sản phẩm của EcoGood. Túi tái sử dụng rất bền và đẹp. Tôi đã giới thiệu cho nhiều bạn bè!"
    },
    {
      name: "Trần Văn Long",
      role: "Khách hàng",
      image: "/placeholder-user.jpg",
      rating: 5,
      content: "Chai nước bamboo rất tiện lợi và giữ nhiệt tốt. Giá cả hợp lý, chất lượng tuyệt vời. Sẽ tiếp tục ủng hộ!"
    },
    {
      name: "Lê Thị Hoa",
      role: "Khách hàng",
      image: "/placeholder-user.jpg",
      rating: 5,
      content: "Shop giao hàng nhanh, đóng gói cẩn thận. Sản phẩm đúng như mô tả, chất lượng cao. Tôi rất yêu thích!"
    }
  ]

  return (
    <section className="py-20 bg-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Khách hàng nói gì về chúng tôi
          </h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Những đánh giá chân thực từ khách hàng đã sử dụng sản phẩm
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-secondary/10 hover:border-secondary/30 relative"
            >
              <Quote className="absolute top-6 right-6 w-12 h-12 text-secondary/20" />
              
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-secondary/20"
                />
                <div>
                  <h3 className="font-bold text-primary text-lg">{testimonial.name}</h3>
                  <p className="text-sm text-foreground/60">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-foreground/80 leading-relaxed italic">
                "{testimonial.content}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

