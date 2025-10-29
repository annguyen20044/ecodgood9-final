import Header from "@/components/header"
import Hero from "@/components/hero"
import ProductCarousel from "@/components/product-carousel"
import SignatureProduct from "@/components/signature-product"
import Blog from "@/components/blog"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <ProductCarousel />
      <SignatureProduct />
      <Blog />
      <Footer />
    </main>
  )
}
