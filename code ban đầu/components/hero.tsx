"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      image: "/eco-friendly-sustainable-products-banner.jpg",
      alt: "Sản phẩm bền vững",
    },
    {
      image: "/environmental-protection-green-nature-banner.jpg",
      alt: "Bảo vệ môi trường",
    },
    {
      image: "/eco-friendly-lifestyle-sustainable-living-banner.jpg",
      alt: "Cuộc sống xanh",
    },
    {
      image: "/organic-coffee-beans-sustainable.jpg",
      alt: "Cà phê hữu cơ",
    },
    {
      image: "/eco-friendly-packaging-green.jpg",
      alt: "Bao bì thân thiện",
    },
    {
      image: "/sustainable-agriculture-farming.jpg",
      alt: "Nông nghiệp bền vững",
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)

  return (
    <section className="relative bg-background overflow-hidden">
      <div className="relative h-96 md:h-[500px] flex items-center">
        {/* Carousel */}
        <div className="w-full relative">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img src={slide.image || "/placeholder.svg"} alt={slide.alt} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <div className="absolute inset-0 flex items-center justify-between px-4 md:px-8 z-10">
          <button
            onClick={prevSlide}
            className="bg-white/30 hover:bg-white/50 text-white p-3 rounded-full transition"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="bg-white/30 hover:bg-white/50 text-white p-3 rounded-full transition"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition ${
                index === currentSlide ? "bg-secondary w-8" : "bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
