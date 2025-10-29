import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function PaymentSuccessPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <CheckCircle size={80} className="text-primary mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-primary mb-4">Thanh toán thành công!</h1>
          <p className="text-foreground/70 mb-8 text-lg">
            Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xác nhận và sẽ được giao sớm nhất.
          </p>
          <div className="bg-white border border-secondary/20 rounded-lg p-8 mb-8">
            <p className="text-foreground/70 mb-4">Bạn sẽ nhận được email xác nhận trong vài phút tới.</p>
            <p className="text-foreground/70">
              Mã đơn hàng: <span className="font-bold text-primary">{Date.now()}</span>
            </p>
          </div>
          <Link href="/">
            <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 transition font-semibold">
              Quay về trang chủ
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
