"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import {
  ProductSchema,
  BlogPostSchema,
  OrderSchema,
  JobSchema,
  type Product,
  type BlogPost,
  type Order,
  type Job,
} from "./schemas"
import { syncDataToBlob, loadDataFromBlob } from "./admin-storage"
import { Loading } from "@/components/ui/loading"

interface Contact {
  id: number
  name: string
  email: string
  phone: string
  subject: string
  message: string
  date: string
  status: "new" | "read" | "replied"
}

interface Application {
  id: number
  name: string
  email: string
  phone: string
  position: string
  experience: string
  message: string
  date: string
  status: "new" | "reviewing" | "rejected" | "accepted"
}

interface CartOrder {
  id: number
  customerName: string
  customerEmail: string
  customerPhone: string
  items: Array<{
    id: number
    name: string
    price: number
    quantity: number
  }>
  totalAmount: number
  date: string
  status: "abandoned" | "active"
}

interface MediaFile {
  id: string
  name: string
  url: string
  category: "product" | "blog" | "general"
  uploadedAt: string
  size: number
}

interface AdminContextType {
  isAuthenticated: boolean
  login: (password: string) => boolean
  logout: () => void
  changePassword: (oldPassword: string, newPassword: string) => boolean
  products: Product[]
  addProduct: (product: Omit<Product, "id">) => { success: boolean; error?: string }
  updateProduct: (id: number, product: Omit<Product, "id">) => { success: boolean; error?: string }
  deleteProduct: (id: number) => void
  reduceProductStock: (productId: number, quantity: number) => boolean
  posts: BlogPost[]
  addPost: (post: Omit<BlogPost, "id">) => { success: boolean; error?: string }
  updatePost: (id: number, post: Omit<BlogPost, "id">) => { success: boolean; error?: string }
  deletePost: (id: number) => void
  contacts: Contact[]
  addContact: (contact: Omit<Contact, "id">) => void
  updateContactStatus: (id: number, status: Contact["status"]) => void
  deleteContact: (id: number) => void
  applications: Application[]
  addApplication: (application: Omit<Application, "id">) => void
  updateApplicationStatus: (id: number, status: Application["status"]) => void
  deleteApplication: (id: number) => void
  orders: Order[]
  addOrder: (order: Omit<Order, "id">) => { success: boolean; error?: string }
  updateOrderStatus: (id: number, orderStatus: Order["orderStatus"], paymentStatus: Order["paymentStatus"]) => void
  deleteOrder: (id: number) => void
  cartOrders: CartOrder[]
  addCartOrder: (order: Omit<CartOrder, "id">) => void
  updateCartOrderStatus: (id: number, status: CartOrder["status"]) => void
  deleteCartOrder: (id: number) => void
  jobs: Job[]
  addJob: (job: Omit<Job, "id">) => { success: boolean; error?: string }
  updateJob: (id: number, job: Omit<Job, "id">) => { success: boolean; error?: string }
  deleteJob: (id: number) => void
  media: MediaFile[]
  addMedia: (file: MediaFile) => void
  deleteMedia: (id: string) => void
  getMediaByCategory: (category: string) => MediaFile[]
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentPassword, setCurrentPassword] = useState(process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123")
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)

  const [products, setProducts] = useState<Product[]>([
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
    {
      id: 2,
      name: "Chai Nước Bamboo",
      price: 129000,
      image: "/bamboo-water-bottle.jpg",
      description: "Chai nước từ tre tự nhiên, không chứa BPA. Giữ nước lạnh đến 24 giờ.",
      category: "Đồ uống",
      sku: "ECO-BOTTLE-001",
      stock: 35,
    },
    {
      id: 3,
      name: "Bộ Ăn Cơm Gỗ",
      price: 159000,
      image: "/wooden-cutlery-set.jpg",
      description: "Bộ đũa gỗ tự nhiên, thân thiện với môi trường. Bao gồm đũa, muỗng, nĩa.",
      category: "Bộ ăn",
      sku: "ECO-CUTLERY-001",
      stock: 40,
    },
  ])

  const [posts, setPosts] = useState<BlogPost[]>([
    {
      id: 1,
      title: "Tại sao bền vững lại quan trọng",
      excerpt: "Khám phá tác động của các sản phẩm bền vững đối với môi trường và sức khỏe",
      content:
        "<h2>Tại sao bền vững lại quan trọng</h2><p>Bền vững không chỉ là một từ khóa, mà là một cách sống. Khi chúng ta chọn các sản phẩm bền vững, chúng ta đang đầu tư vào tương lai của hành tinh.</p>",
      image: "/sustainable-living.jpg",
      category: "Bền vững",
      date: "15 Tháng 10, 2024",
    },
    {
      id: 2,
      title: "Cách sống xanh hơn mỗi ngày",
      excerpt: "Những mẹo đơn giản để giảm lượng rác thải và bảo vệ hành tinh",
      content:
        "<h2>Cách sống xanh hơn</h2><p>Có nhiều cách đơn giản để bắt đầu cuộc sống xanh hơn. Từ việc sử dụng túi tái sử dụng đến việc chọn các sản phẩm không chứa hóa chất độc hại.</p>",
      image: "/green-living-tips.jpg",
      category: "Cuộc sống xanh",
      date: "12 Tháng 10, 2024",
    },
    {
      id: 3,
      title: "Sản phẩm Eco-friendly là gì",
      excerpt: "Tìm hiểu về các sản phẩm thân thiện với môi trường và lợi ích của chúng",
      content:
        "<h2>Sản phẩm Eco-friendly</h2><p>Sản phẩm eco-friendly được thiết kế để giảm thiểu tác động tiêu cực đến môi trường. Chúng được làm từ các vật liệu bền vững và có thể tái chế.</p>",
      image: "/eco-products.jpg",
      category: "Sản phẩm",
      date: "10 Tháng 10, 2024",
    },
    {
      id: 4,
      title: "Lợi ích của việc sử dụng túi tái sử dụng",
      excerpt: "Tại sao túi tái sử dụng là lựa chọn tốt nhất cho môi trường",
      content:
        "<h2>Lợi ích của túi tái sử dụng</h2><p>Túi tái sử dụng không chỉ giúp giảm rác thải mà còn tiết kiệm chi phí. Một chiếc túi có thể được sử dụng hàng trăm lần.</p>",
      image: "/reusable-bags.jpg",
      category: "Bền vững",
      date: "8 Tháng 10, 2024",
    },
    {
      id: 5,
      title: "Bamboo - Vật liệu tương lai",
      excerpt: "Khám phá tại sao bamboo là lựa chọn hoàn hảo cho các sản phẩm bền vững",
      content:
        "<h2>Bamboo - Vật liệu tương lai</h2><p>Bamboo là một vật liệu tự nhiên, bền vững và có thể tái sinh. Nó phát triển nhanh chóng mà không cần sử dụng hóa chất.</p>",
      image: "/bamboo-material.jpg",
      category: "Vật liệu",
      date: "5 Tháng 10, 2024",
    },
    {
      id: 6,
      title: "Cách chọn sản phẩm bền vững",
      excerpt: "Hướng dẫn chi tiết để chọn các sản phẩm thực sự bền vững",
      content:
        "<h2>Cách chọn sản phẩm bền vững</h2><p>Khi chọn sản phẩm bền vững, hãy tìm kiếm các chứng chỉ, kiểm tra nguồn gốc và đảm bảo rằng sản phẩm có thể tái chế.</p>",
      image: "/choosing-sustainable.jpg",
      category: "Hướng dẫn",
      date: "3 Tháng 10, 2024",
    },
    {
      id: 7,
      title: "Tác động của nhựa đơn lần sử dụng",
      excerpt: "Hiểu rõ hơn về vấn đề nhựa và cách chúng ta có thể giúp",
      content:
        "<h2>Tác động của nhựa đơn lần sử dụng</h2><p>Nhựa đơn lần sử dụng gây ra những vấn đề nghiêm trọng cho môi trường. Bằng cách chọn các sản phẩm tái sử dụng, chúng ta có thể tạo ra sự thay đổi.</p>",
      image: "/plastic-impact.jpg",
      category: "Môi trường",
      date: "1 Tháng 10, 2024",
    },
    {
      id: 8,
      title: "Cộng đồng EcoGood",
      excerpt: "Tham gia cộng đồng những người yêu thích cuộc sống bền vững",
      content:
        "<h2>Cộng đồng EcoGood</h2><p>EcoGood không chỉ là một thương hiệu, mà là một cộng đồng những người quan tâm đến tương lai của hành tinh. Hãy tham gia với chúng tôi.</p>",
      image: "/community.jpg",
      category: "Về EcoGood",
      date: "28 Tháng 9, 2024",
    },
    {
      id: 9,
      title: "Những bước nhỏ tạo nên sự thay đổi lớn",
      excerpt: "Mỗi hành động nhỏ đều có ý nghĩa trong việc bảo vệ môi trường",
      content:
        "<h2>Những bước nhỏ tạo nên sự thay đổi lớn</h2><p>Không cần phải thay đổi toàn bộ cuộc sống của bạn. Những bước nhỏ, khi được thực hiện bởi nhiều người, có thể tạo ra sự thay đổi lớn.</p>",
      image: "/small-steps.jpg",
      category: "Cuộc sống xanh",
      date: "25 Tháng 9, 2024",
    },
  ])

  const [contacts, setContacts] = useState<Contact[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [cartOrders, setCartOrders] = useState<CartOrder[]>([])
  const [jobs, setJobs] = useState<Job[]>([
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
    {
      id: 2,
      title: "Chuyên viên Marketing",
      department: "Marketing",
      location: "TP.HCM",
      type: "Toàn thời gian",
      salary: "12.000.000 - 18.000.000 đ",
      description: "Tham gia xây dựng chiến lược marketing và quản lý các chiến dịch quảng cáo.",
      requirements: [
        "Tốt nghiệp Đại học chuyên ngành Marketing hoặc liên quan",
        "2+ năm kinh nghiệm trong marketing",
        "Kỹ năng sáng tạo và phân tích dữ liệu",
        "Thành thạo các công cụ marketing digital",
      ],
    },
    {
      id: 3,
      title: "Lập trình viên Full Stack",
      department: "Công nghệ",
      location: "TP.HCM",
      type: "Toàn thời gian",
      salary: "15.000.000 - 25.000.000 đ",
      description: "Phát triển và bảo trì các ứng dụng web và mobile cho EcoGood.",
      requirements: [
        "Tốt nghiệp Đại học chuyên ngành Công nghệ Thông tin",
        "3+ năm kinh nghiệm lập trình",
        "Thành thạo React, Node.js, và các công nghệ web hiện đại",
        "Kinh nghiệm với cơ sở dữ liệu SQL/NoSQL",
      ],
    },
    {
      id: 4,
      title: "Chuyên viên Nhân sự",
      department: "Nhân sự",
      location: "TP.HCM",
      type: "Toàn thời gian",
      salary: "10.000.000 - 15.000.000 đ",
      description: "Quản lý tuyển dụng, đào tạo và phát triển nhân sự cho công ty.",
      requirements: [
        "Tốt nghiệp Đại học chuyên ngành Quản lý Nhân sự",
        "2+ năm kinh nghiệm trong lĩnh vực Nhân sự",
        "Kỹ năng giao tiếp và quản lý mối quan hệ tốt",
        "Hiểu biết về luật lao động Việt Nam",
      ],
    },
    {
      id: 5,
      title: "Chuyên viên Kế toán",
      department: "Tài chính",
      location: "TP.HCM",
      type: "Toàn thời gian",
      salary: "10.000.000 - 14.000.000 đ",
      description: "Quản lý kế toán, báo cáo tài chính và kiểm soát chi phí.",
      requirements: [
        "Tốt nghiệp Đại học chuyên ngành Kế toán",
        "2+ năm kinh nghiệm kế toán",
        "Thành thạo phần mềm kế toán",
        "Hiểu biết về thuế và quy định tài chính",
      ],
    },
    {
      id: 6,
      title: "Quản lý Cửa hàng",
      department: "Bán hàng",
      location: "Hà Nội",
      type: "Toàn thời gian",
      salary: "14.000.000 - 20.000.000 đ",
      description: "Quản lý hoạt động hàng ngày của cửa hàng và đội ngũ nhân viên.",
      requirements: [
        "Tốt nghiệp Đại học chuyên ngành Quản lý Bán lẻ hoặc liên quan",
        "3+ năm kinh nghiệm quản lý cửa hàng",
        "Kỹ năng lãnh đạo và quản lý đội ngũ",
        "Kinh nghiệm với hệ thống POS",
      ],
    },
  ])

  const [media, setMedia] = useState<MediaFile[]>([])

  useEffect(() => {
    const initializeData = async () => {
      try {
        const saved = localStorage.getItem("adminAuth")
        if (saved === "true") {
          setIsAuthenticated(true)
        }

        console.log("[v0] Starting data initialization...")
        const results = await Promise.allSettled([
          loadDataFromBlob("PRODUCTS"),
          loadDataFromBlob("POSTS"),
          loadDataFromBlob("CONTACTS"),
          loadDataFromBlob("APPLICATIONS"),
          loadDataFromBlob("ORDERS"),
          loadDataFromBlob("JOBS"),
          loadDataFromBlob("MEDIA"),
        ])

        const [productsResult, postsResult, contactsResult, applicationsResult, ordersResult, jobsResult, mediaResult] =
          results

        if (productsResult.status === "fulfilled" && productsResult.value) {
          console.log("[v0] Loaded products:", productsResult.value.length)
          setProducts(productsResult.value)
        } else {
          console.warn("[v0] Failed to load products, using defaults")
        }

        if (postsResult.status === "fulfilled" && postsResult.value) {
          console.log("[v0] Loaded posts:", postsResult.value.length)
          setPosts(postsResult.value)
        } else {
          console.warn("[v0] Failed to load posts, using defaults")
        }

        if (contactsResult.status === "fulfilled" && contactsResult.value) {
          console.log("[v0] Loaded contacts:", contactsResult.value.length)
          setContacts(contactsResult.value)
        }

        if (applicationsResult.status === "fulfilled" && applicationsResult.value) {
          console.log("[v0] Loaded applications:", applicationsResult.value.length)
          setApplications(applicationsResult.value)
        }

        if (ordersResult.status === "fulfilled" && ordersResult.value) {
          console.log("[v0] Loaded orders:", ordersResult.value.length)
          setOrders(ordersResult.value)
        }

        if (jobsResult.status === "fulfilled" && jobsResult.value) {
          console.log("[v0] Loaded jobs:", jobsResult.value.length)
          setJobs(jobsResult.value)
        }

        if (mediaResult.status === "fulfilled" && mediaResult.value) {
          console.log("[v0] Loaded media:", mediaResult.value.length)
          setMedia(mediaResult.value)
        }

        await fetchCartOrdersFromSupabase()

        setLoadError(null)
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error)
        console.error("[v0] Failed to initialize data:", errorMsg)
        setLoadError(errorMsg)
      } finally {
        setIsLoading(false)
      }
    }

    initializeData()

    let cartOrdersInterval: NodeJS.Timeout | null = null

    const startInterval = () => {
      cartOrdersInterval = setInterval(() => {
        fetchCartOrdersFromSupabase()
      }, 60000) // Changed from 30000 to 60000 (60 seconds)
    }

    // Start the interval after a small delay to avoid immediate duplicate calls
    const timeoutId = setTimeout(startInterval, 5000)

    return () => {
      clearTimeout(timeoutId)
      if (cartOrdersInterval) {
        clearInterval(cartOrdersInterval)
      }
    }
  }, [])

  const fetchCartOrdersFromSupabase = async () => {
    try {
      const response = await fetch("/api/admin/cart-orders")
      if (response.ok) {
        const data = await response.json()
        if (data.cartOrders && Array.isArray(data.cartOrders)) {
          console.log("[v0] Fetched cart orders from Supabase:", data.cartOrders.length)
          setCartOrders(data.cartOrders)
        }
      }
    } catch (error) {
      console.warn("[v0] Failed to fetch cart orders from Supabase:", error)
    }
  }

  const syncToSupabase = async () => {
    if (isSyncing) return

    setIsSyncing(true)
    try {
      const response = await fetch("/api/admin/sync-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "sync",
          data: {
            products,
            posts,
            jobs,
            contacts,
            applications,
            orders,
            cartOrders,
          },
        }),
      })

      const result = await response.json()
      if (result.success) {
        setLastSyncTime(new Date().toISOString())
        console.log("[v0] Data synced to Supabase successfully")
      } else {
        console.error("[v0] Sync failed:", result.error)
      }
    } catch (error) {
      console.error("[v0] Failed to sync to Supabase:", error)
    } finally {
      setIsSyncing(false)
    }
  }

  const login = (password: string): boolean => {
    if (password === currentPassword) {
      setIsAuthenticated(true)
      localStorage.setItem("adminAuth", "true")
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("adminAuth")
  }

  const changePassword = (oldPassword: string, newPassword: string): boolean => {
    if (oldPassword === currentPassword) {
      setCurrentPassword(newPassword)
      return true
    }
    return false
  }

  const addProduct = (product: Omit<Product, "id">) => {
    try {
      const validated = ProductSchema.omit({ id: true }).parse(product)
      const newProduct = {
        ...validated,
        id: Math.max(...products.map((p) => p.id), 0) + 1,
      }
      const updatedProducts = [newProduct, ...products]
      setProducts(updatedProducts)
      syncDataToBlob("PRODUCTS", updatedProducts)
      syncToSupabase()
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.errors?.[0]?.message || "Lỗi xác thực dữ liệu" }
    }
  }

  const updateProduct = (id: number, product: Omit<Product, "id">) => {
    try {
      const validated = ProductSchema.omit({ id: true }).parse(product)
      const updatedProducts = products.map((p) => (p.id === id ? { ...validated, id } : p))
      setProducts(updatedProducts)
      syncDataToBlob("PRODUCTS", updatedProducts)
      syncToSupabase()
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.errors?.[0]?.message || "Lỗi xác thực dữ liệu" }
    }
  }

  const deleteProduct = (id: number) => {
    const updatedProducts = products.filter((p) => p.id !== id)
    setProducts(updatedProducts)
    syncDataToBlob("PRODUCTS", updatedProducts)
  }

  const reduceProductStock = (productId: number, quantity: number): boolean => {
    const product = products.find((p) => p.id === productId)
    if (!product || product.stock < quantity) {
      return false
    }
    const updatedProducts = products.map((p) => (p.id === productId ? { ...p, stock: p.stock - quantity } : p))
    setProducts(updatedProducts)
    syncDataToBlob("PRODUCTS", updatedProducts)
    return true
  }

  const addPost = (post: Omit<BlogPost, "id">) => {
    try {
      const validated = BlogPostSchema.omit({ id: true }).parse(post)
      const newPost = {
        ...validated,
        id: Math.max(...posts.map((p) => p.id), 0) + 1,
      }
      const updatedPosts = [newPost, ...posts]
      setPosts(updatedPosts)
      syncDataToBlob("POSTS", updatedPosts)
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.errors?.[0]?.message || "Lỗi xác thực dữ liệu" }
    }
  }

  const updatePost = (id: number, post: Omit<BlogPost, "id">) => {
    try {
      const validated = BlogPostSchema.omit({ id: true }).parse(post)
      const updatedPosts = posts.map((p) => (p.id === id ? { ...validated, id } : p))
      setPosts(updatedPosts)
      syncDataToBlob("POSTS", updatedPosts)
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.errors?.[0]?.message || "Lỗi xác thực dữ liệu" }
    }
  }

  const deletePost = (id: number) => {
    const updatedPosts = posts.filter((p) => p.id !== id)
    setPosts(updatedPosts)
    syncDataToBlob("POSTS", updatedPosts)
  }

  const addContact = (contact: Omit<Contact, "id">) => {
    const newContact = {
      ...contact,
      id: Math.max(...contacts.map((c) => c.id), 0) + 1,
    }
    const updatedContacts = [newContact, ...contacts]
    setContacts(updatedContacts)
    syncDataToBlob("CONTACTS", updatedContacts)
  }

  const updateContactStatus = (id: number, status: Contact["status"]) => {
    const updatedContacts = contacts.map((c) => (c.id === id ? { ...c, status } : c))
    setContacts(updatedContacts)
    syncDataToBlob("CONTACTS", updatedContacts)
  }

  const deleteContact = (id: number) => {
    const updatedContacts = contacts.filter((c) => c.id !== id)
    setContacts(updatedContacts)
    syncDataToBlob("CONTACTS", updatedContacts)
  }

  const addApplication = (application: Omit<Application, "id">) => {
    const newApplication = {
      ...application,
      id: Math.max(...applications.map((a) => a.id), 0) + 1,
    }
    const updatedApplications = [newApplication, ...applications]
    setApplications(updatedApplications)
    syncDataToBlob("APPLICATIONS", updatedApplications)
  }

  const updateApplicationStatus = (id: number, status: Application["status"]) => {
    const updatedApplications = applications.map((a) => (a.id === id ? { ...a, status } : a))
    setApplications(updatedApplications)
    syncDataToBlob("APPLICATIONS", updatedApplications)
  }

  const deleteApplication = (id: number) => {
    const updatedApplications = applications.filter((a) => a.id !== id)
    setApplications(updatedApplications)
    syncDataToBlob("APPLICATIONS", updatedApplications)
  }

  const addOrder = (order: Omit<Order, "id">) => {
    try {
      const validated = OrderSchema.omit({ id: true }).parse(order)
      const newOrder = {
        ...validated,
        id: Math.max(...orders.map((o) => o.id), 0) + 1,
      }
      const updatedOrders = [newOrder, ...orders]
      setOrders(updatedOrders)
      syncDataToBlob("ORDERS", updatedOrders)
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.errors?.[0]?.message || "Lỗi xác thực dữ liệu" }
    }
  }

  const updateOrderStatus = (id: number, orderStatus: Order["orderStatus"], paymentStatus: Order["paymentStatus"]) => {
    const updatedOrders = orders.map((o) => (o.id === id ? { ...o, orderStatus, paymentStatus } : o))
    setOrders(updatedOrders)
    syncDataToBlob("ORDERS", updatedOrders)
  }

  const deleteOrder = (id: number) => {
    const updatedOrders = orders.filter((o) => o.id !== id)
    setOrders(updatedOrders)
    syncDataToBlob("ORDERS", updatedOrders)
  }

  const addCartOrder = (order: Omit<CartOrder, "id">) => {
    const newCartOrder = {
      ...order,
      id: Math.max(...cartOrders.map((o) => o.id), 0) + 1,
    }
    const updatedCartOrders = [newCartOrder, ...cartOrders]
    setCartOrders(updatedCartOrders)
    syncDataToBlob("CART_ORDERS", updatedCartOrders)
  }

  const updateCartOrderStatus = (id: number, status: CartOrder["status"]) => {
    const updatedCartOrders = cartOrders.map((o) => (o.id === id ? { ...o, status } : o))
    setCartOrders(updatedCartOrders)
    syncDataToBlob("CART_ORDERS", updatedCartOrders)
  }

  const deleteCartOrder = (id: number) => {
    const updatedCartOrders = cartOrders.filter((o) => o.id !== id)
    setCartOrders(updatedCartOrders)
    syncDataToBlob("CART_ORDERS", updatedCartOrders)
  }

  const addJob = (job: Omit<Job, "id">) => {
    try {
      const validated = JobSchema.omit({ id: true }).parse(job)
      const newJob = {
        ...validated,
        id: Math.max(...jobs.map((j) => j.id), 0) + 1,
      }
      const updatedJobs = [newJob, ...jobs]
      setJobs(updatedJobs)
      syncDataToBlob("JOBS", updatedJobs)
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.errors?.[0]?.message || "Lỗi xác thực dữ liệu" }
    }
  }

  const updateJob = (id: number, job: Omit<Job, "id">) => {
    try {
      const validated = JobSchema.omit({ id: true }).parse(job)
      const updatedJobs = jobs.map((j) => (j.id === id ? { ...validated, id } : j))
      setJobs(updatedJobs)
      syncDataToBlob("JOBS", updatedJobs)
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.errors?.[0]?.message || "Lỗi xác thực dữ liệu" }
    }
  }

  const deleteJob = (id: number) => {
    const updatedJobs = jobs.filter((j) => j.id !== id)
    setJobs(updatedJobs)
    syncDataToBlob("JOBS", updatedJobs)
  }

  const addMedia = (file: MediaFile) => {
    const updatedMedia = [file, ...media]
    setMedia(updatedMedia)
    syncDataToBlob("MEDIA", updatedMedia)
  }

  const deleteMedia = (id: string) => {
    const updatedMedia = media.filter((m) => m.id !== id)
    setMedia(updatedMedia)
    syncDataToBlob("MEDIA", updatedMedia)
  }

  const getMediaByCategory = (category: string): MediaFile[] => {
    return media.filter((m) => m.category === (category as any))
  }

  if (isLoading) {
    return <Loading />
  }

  if (loadError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded">
        <p className="text-red-800">Lỗi tải dữ liệu: {loadError}</p>
        <p className="text-sm text-red-600 mt-2">Vui lòng tải lại trang</p>
      </div>
    )
  }

  return (
    <AdminContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        changePassword,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        reduceProductStock,
        posts,
        addPost,
        updatePost,
        deletePost,
        contacts,
        addContact,
        updateContactStatus,
        deleteContact,
        applications,
        addApplication,
        updateApplicationStatus,
        deleteApplication,
        orders,
        addOrder,
        updateOrderStatus,
        deleteOrder,
        cartOrders,
        addCartOrder,
        updateCartOrderStatus,
        deleteCartOrder,
        jobs,
        addJob,
        updateJob,
        deleteJob,
        media,
        addMedia,
        deleteMedia,
        getMediaByCategory,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider")
  }
  return context
}
