export default function SignatureProduct() {
  return (
    <section id="signature" className="py-20 bg-gradient-to-b from-background to-secondary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left - Image */}
          <div className="relative">
            <img src="/eco-friendly-signature-product.jpg" alt="Sản phẩm Signature" className="w-full rounded-lg shadow-lg" />
          </div>

          {/* Right - Content */}
          <div>
            <div className="mb-6">
              <p className="text-secondary font-semibold text-lg mb-2">Sản phẩm Signature</p>
              <h2 className="text-5xl font-bold text-primary mb-4 text-balance">Bộ Sản Phẩm Eco Premium</h2>
            </div>

            <p className="text-foreground/80 text-lg leading-relaxed mb-6">
              Được trồng trọt và chế biến theo tiêu chuẩn bền vững cao nhất, bộ sản phẩm Eco Premium của EcoGood mang
              đến cho bạn những sản phẩm chất lượng tuyệt vời. Mỗi sản phẩm được lựa chọn kỹ lưỡng để đảm bảo tính bền
              vững, an toàn cho sức khỏe và tôn trọng môi trường.
            </p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <span className="text-secondary font-bold text-xl">✓</span>
                <span className="text-foreground">100% nguyên liệu tự nhiên, không hóa chất</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-secondary font-bold text-xl">✓</span>
                <span className="text-foreground">Được chứng nhận bền vững quốc tế</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-secondary font-bold text-xl">✓</span>
                <span className="text-foreground">Hỗ trợ cộng đồng địa phương</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-secondary font-bold text-xl">✓</span>
                <span className="text-foreground">Bao bì tái chế 100%</span>
              </li>
            </ul>

            <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition shadow-md">
              Tìm hiểu thêm
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
