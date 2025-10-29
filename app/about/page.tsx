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
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Sứ mệnh của chúng tôi</h2>
              <p className="text-foreground/80 mb-4 leading-relaxed text-lg">
                EcoGood được thành lập với mục đích mang lại những sản phẩm eco-friendly chất lượng cao, giúp mọi người
                sống xanh hơn mà không phải hy sinh chất lượng.
              </p>
              <p className="text-foreground/80 leading-relaxed text-lg">
                Chúng tôi tin rằng mỗi lựa chọn tiêu dùng có thể tạo ra sự thay đổi tích cực cho hành tinh của chúng ta.
              </p>
            </div>
            <img src="/sustainable-eco-friendly-products.jpg" alt="Sứ mệnh EcoGood" className="rounded-2xl shadow-2xl" />
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <img src="/sustainable-living.jpg" alt="Tầm nhìn EcoGood" className="rounded-2xl shadow-2xl order-2 md:order-1" />
            <div className="order-1 md:order-2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Tầm nhìn của chúng tôi</h2>
              <p className="text-primary-foreground/90 mb-4 leading-relaxed text-lg">
                Trở thành thương hiệu hàng đầu tại Việt Nam trong lĩnh vực sản phẩm bền vững và thân thiện với môi trường.
              </p>
              <p className="text-primary-foreground/90 mb-4 leading-relaxed text-lg">
                Chúng tôi hướng tới việc xây dựng một cộng đồng lớn mạnh những người quan tâm đến môi trường và lối sống xanh.
              </p>
              <p className="text-primary-foreground/90 leading-relaxed text-lg">
                Góp phần tạo nên một Việt Nam xanh, sạch, đẹp cho thế hệ mai sau.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 text-center">Giá trị cốt lõi</h2>
          <p className="text-xl text-foreground/70 text-center mb-12 max-w-2xl mx-auto">
            Những giá trị định hướng mọi hoạt động của EcoGood
          </p>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center border border-secondary/10 hover:border-secondary/30">
              <div className="bg-green-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Leaf className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Bền vững</h3>
              <p className="text-foreground/70 leading-relaxed">Tất cả sản phẩm được chọn lựa kỹ lưỡng để bảo vệ môi trường</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center border border-secondary/10 hover:border-secondary/30">
              <div className="bg-blue-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Chất lượng</h3>
              <p className="text-foreground/70 leading-relaxed">Cam kết cung cấp sản phẩm chất lượng cao nhất</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center border border-secondary/10 hover:border-secondary/30">
              <div className="bg-purple-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Cộng đồng</h3>
              <p className="text-foreground/70 leading-relaxed">Xây dựng cộng đồng những người yêu thích cuộc sống xanh</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center border border-secondary/10 hover:border-secondary/30">
              <div className="bg-yellow-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="w-10 h-10 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Đổi mới</h3>
              <p className="text-foreground/70 leading-relaxed">Liên tục tìm kiếm các giải pháp bền vững mới</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
