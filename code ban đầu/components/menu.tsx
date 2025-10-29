export default function Menu() {
  const products = [
    {
      id: 1,
      name: "Túi tái sử dụng Eco",
      description: "Túi vải bền, có thể tái sử dụng hàng trăm lần",
      price: "89.000đ",
      image: "/reusable-eco-bag.jpg",
    },
    {
      id: 2,
      name: "Chai nước Bamboo",
      description: "Chai nước từ sợi tre, an toàn và bền vững",
      price: "129.000đ",
      image: "/bamboo-water-bottle.jpg",
    },
    {
      id: 3,
      name: "Bộ ăn cơm Gỗ",
      description: "Bộ ăn cơm từ gỗ tự nhiên, không hóa chất",
      price: "159.000đ",
      image: "/wooden-cutlery-set.jpg",
    },
    {
      id: 4,
      name: "Xà phòng Tự nhiên",
      description: "Xà phòng từ nguyên liệu thiên nhiên 100%",
      price: "49.000đ",
      image: "/natural-soap-bar.jpg",
    },
  ]

  return (
    <section id="products" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-4">Sản phẩm EcoGood</h2>
          <p className="text-foreground/70 text-lg">Những lựa chọn bền vững cho cuộc sống xanh hơn</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition border border-secondary/20 hover:border-accent/50"
            >
              <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-card-foreground mb-2">{product.name}</h3>
                <p className="text-sm text-foreground/70 mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-primary font-bold">{product.price}</span>
                  <button className="bg-primary text-primary-foreground px-4 py-2 rounded text-sm hover:bg-primary/90 transition font-medium">
                    Thêm vào
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
