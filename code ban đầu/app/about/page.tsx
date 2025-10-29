import Header from "@/components/header"
import Footer from "@/components/footer"
import { Leaf, Target, Users, Award } from "lucide-react"

export default function About() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Về EcoGood</h1>
          <p className="text-lg opacity-90">Cam kết bảo vệ môi trường thông qua các sản phẩm bền vững</p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">Sứ mệnh của chúng tôi</h2>
              <p className="text-foreground/80 mb-4 leading-relaxed">
                EcoGood được thành lập với mục đích mang lại những sản phẩm eco-friendly chất lượng cao, giúp mọi người
                sống xanh hơn mà không phải hy sinh chất lượng.
              </p>
              <p className="text-foreground/80 leading-relaxed">
                Chúng tôi tin rằng mỗi lựa chọn tiêu dùng có thể tạo ra sự thay đổi tích cực cho hành tinh của chúng ta.
              </p>
            </div>
            <img src="/sustainable-eco-friendly-products.jpg" alt="Sứ mệnh EcoGood" className="rounded-lg shadow-lg" />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-secondary/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary mb-12 text-center">Giá trị cốt lõi</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-background p-6 rounded-lg shadow-md text-center">
              <Leaf className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-primary mb-2">Bền vững</h3>
              <p className="text-foreground/70">Tất cả sản phẩm được chọn lựa kỹ lưỡng để bảo vệ môi trường</p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-md text-center">
              <Target className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-primary mb-2">Chất lượng</h3>
              <p className="text-foreground/70">Cam kết cung cấp sản phẩm chất lượng cao nhất</p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-md text-center">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-primary mb-2">Cộng đồng</h3>
              <p className="text-foreground/70">Xây dựng cộng đồng những người yêu thích cuộc sống xanh</p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-md text-center">
              <Award className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-primary mb-2">Đổi mới</h3>
              <p className="text-foreground/70">Liên tục tìm kiếm các giải pháp bền vững mới</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
