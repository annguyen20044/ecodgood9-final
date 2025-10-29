export default function Stores() {
  const stores = [
    {
      id: 1,
      name: "EcoGood - Chi nhánh TP.HCM",
      address: "158-158A Đào Duy Anh, Phường Đức Nhuận, TP.HCM",
      image: "/modern-eco-store.jpg",
    },
    {
      id: 2,
      name: "EcoGood - Chi nhánh Hà Nội",
      address: "Số 45 Phố Huế, Quận Hoàn Kiếm, Hà Nội",
      image: "/sustainable-shop-interior.jpg",
    },
    {
      id: 3,
      name: "EcoGood - Chi nhánh Đà Nẵng",
      address: "Số 123 Nguyễn Văn Linh, Quận Hải Châu, Đà Nẵng",
      image: "/eco-friendly-store.jpg",
    },
  ]

  return (
    <section id="stores" className="py-20 bg-secondary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-4">Cửa hàng EcoGood</h2>
          <p className="text-foreground/70 text-lg">Ghé thăm các chi nhánh của chúng tôi trên khắp Việt Nam</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stores.map((store) => (
            <div
              key={store.id}
              className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition border-l-4 border-primary"
            >
              <img src={store.image || "/placeholder.svg"} alt={store.name} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-card-foreground mb-2">{store.name}</h3>
                <p className="text-foreground/70 mb-4">{store.address}</p>
                <button className="w-full bg-primary text-primary-foreground py-2 rounded hover:bg-primary/90 transition font-medium">
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
