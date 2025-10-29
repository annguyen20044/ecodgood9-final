import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { XCircle } from "lucide-react"

export default function PaymentFailedPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <XCircle size={80} className="text-red-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-red-500 mb-4">Thanh toán thất bại!</h1>
          <p className="text-foreground/70 mb-8 text-lg">Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.</p>
          <div className="space-y-4">
            <Link href="/checkout">
              <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 transition font-semibold">
                Thử lại
              </button>
            </Link>
            <Link href="/cart">
              <button className="bg-secondary text-primary px-8 py-3 rounded-lg hover:bg-secondary/90 transition font-semibold ml-4">
                Quay về giỏ hàng
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
