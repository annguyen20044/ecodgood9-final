import Header from "@/components/header"
import Hero from "@/components/hero"
import Categories from "@/components/categories"
import ProductCarousel from "@/components/product-carousel"
import SignatureProduct from "@/components/signature-product"
import Testimonials from "@/components/testimonials"
import Blog from "@/components/blog"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Categories />
      <ProductCarousel />
      <SignatureProduct />
      <Testimonials />
      <Blog />
      <Footer />
    </main>
  )
}
