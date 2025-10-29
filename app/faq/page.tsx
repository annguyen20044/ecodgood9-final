import Header from "@/components/header"
import Footer from "@/components/footer"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "Sản phẩm EcoGood được làm từ những gì?",
    answer:
      "Tất cả sản phẩm EcoGood được làm từ các thành phần tự nhiên, bền vững và không chứa hóa chất độc hại. Chúng tôi cam kết sử dụng các nguồn nguyên liệu thân thiện với môi trường.",
  },
  {
    question: "Làm thế nào để đặt hàng?",
    answer:
      "Bạn có thể đặt hàng trực tiếp tại cửa hàng của chúng tôi hoặc liên hệ qua số điện thoại 0826 071 111. Chúng tôi cũng sẽ sớm có dịch vụ đặt hàng trực tuyến.",
  },
  {
    question: "Sản phẩm có bảo hành không?",
    answer:
      "Có, tất cả sản phẩm EcoGood đều có bảo hành 12 tháng. Nếu sản phẩm bị lỗi, vui lòng liên hệ với chúng tôi để được hỗ trợ.",
  },
  {
    question: "Giao hàng mất bao lâu?",
    answer:
      "Giao hàng thường mất 2-3 ngày làm việc trong nội thành TP.HCM. Đối với các tỉnh khác, thời gian giao hàng có thể lâu hơn.",
  },
  {
    question: "Có chính sách hoàn trả không?",
    answer:
      "Có, chúng tôi có chính sách hoàn trả 30 ngày. Nếu bạn không hài lòng với sản phẩm, vui lòng liên hệ với chúng tôi để được hỗ trợ.",
  },
  {
    question: "Làm thế nào để liên hệ với EcoGood?",
    answer:
      "Bạn có thể liên hệ với chúng tôi qua số điện thoại 0826 071 111 hoặc email Giaminh.ecogood68@gmail.com. Chúng tôi cũng có các cửa hàng tại TP.HCM, Hà Nội và Đà Nẵng.",
  },
]

export default function FAQ() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Câu hỏi thường gặp</h1>
          <p className="text-lg opacity-90">Tìm câu trả lời cho những câu hỏi của bạn</p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="bg-background border border-secondary/20 rounded-lg p-6 cursor-pointer hover:shadow-md transition"
              >
                <summary className="flex items-center justify-between font-bold text-primary text-lg">
                  {faq.question}
                  <ChevronDown size={24} className="flex-shrink-0" />
                </summary>
                <p className="text-foreground/80 mt-4 leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
