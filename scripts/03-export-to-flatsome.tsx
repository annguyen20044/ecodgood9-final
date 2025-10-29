import fs from "fs"
import path from "path"

// This script exports data from localStorage to JSON files for Flatsome import
// Run this in the browser console or as a Node.js script after fetching data

interface Product {
  id: number
  name: string
  price: number
  image: string
  description: string
  category: string
  sku: string
  stock: number
}

interface BlogPost {
  id: number
  title: string
  excerpt: string
  content: string
  image: string
  category: string
  date: string
}

interface Job {
  id: number
  title: string
  department: string
  location: string
  type: string
  salary: string
  description: string
  requirements: string[]
}

// Sample data for export
const sampleProducts: Product[] = [
  {
    id: 1,
    name: "Túi Tái Sử Dụng Eco",
    price: 89000,
    image: "/reusable-eco-bag.jpg",
    description: "Túi vải bền vững, có thể tái sử dụng hàng trăm lần. Chất liệu 100% cotton hữu cơ.",
    category: "Túi xách",
    sku: "ECO-BAG-001",
    stock: 50,
  },
]

const samplePosts: BlogPost[] = [
  {
    id: 1,
    title: "Tại sao bền vững lại quan trọng",
    excerpt: "Khám phá tác động của các sản phẩm bền vững đối với môi trường và sức khỏe",
    content: "<h2>Tại sao bền vững lại quan trọng</h2><p>Bền vững không chỉ là một từ khóa, mà là một cách sống.</p>",
    image: "/sustainable-living.jpg",
    category: "Bền vững",
    date: "15 Tháng 10, 2024",
  },
]

const sampleJobs: Job[] = [
  {
    id: 1,
    title: "Nhân viên Bán hàng",
    department: "Bán hàng",
    location: "TP.HCM",
    type: "Toàn thời gian",
    salary: "8.000.000 - 12.000.000 đ",
    description: "Chúng tôi tìm kiếm nhân viên bán hàng nhiệt tình để phục vụ khách hàng tại cửa hàng.",
    requirements: [
      "Tốt nghiệp THPT trở lên",
      "Có kinh nghiệm bán hàng là lợi thế",
      "Kỹ năng giao tiếp tốt",
      "Đam mê sản phẩm eco-friendly",
    ],
  },
]

export function exportToFlatsome() {
  const exportDir = path.join(process.cwd(), "public", "export")

  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true })
  }

  // Export products as CSV for WooCommerce
  const productsCSV = convertProductsToCSV(sampleProducts)
  fs.writeFileSync(path.join(exportDir, "products.csv"), productsCSV)

  // Export posts as JSON
  fs.writeFileSync(path.join(exportDir, "posts.json"), JSON.stringify(samplePosts, null, 2))

  // Export jobs as JSON
  fs.writeFileSync(path.join(exportDir, "jobs.json"), JSON.stringify(sampleJobs, null, 2))

  console.log("Export completed! Files saved to public/export/")
}

function convertProductsToCSV(products: Product[]): string {
  const headers = ["ID", "Name", "Price", "Description", "Category", "SKU", "Stock", "Image"]
  const rows = products.map((p) => [
    p.id,
    `"${p.name}"`,
    p.price,
    `"${p.description}"`,
    p.category,
    p.sku,
    p.stock,
    p.image,
  ])

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
}

// Run export
exportToFlatsome()
