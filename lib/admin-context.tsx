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
import { toast } from "sonner"

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
  addProduct: (product: Omit<Product, "id">) => Promise<{ success: boolean; error?: string }>
  updateProduct: (id: number, product: Omit<Product, "id">) => Promise<{ success: boolean; error?: string }>
  deleteProduct: (id: number) => Promise<void>
  reduceProductStock: (productId: number, quantity: number) => boolean
  posts: BlogPost[]
  addPost: (post: Omit<BlogPost, "id">) => Promise<{ success: boolean; error?: string }>
  updatePost: (id: number, post: Omit<BlogPost, "id">) => Promise<{ success: boolean; error?: string }>
  deletePost: (id: number) => Promise<void>
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

  const [products, setProducts] = useState<Product[]>([])

  const [posts, setPosts] = useState<BlogPost[]>([])

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

        console.log("[EcoGood] Starting data initialization from Supabase...")
        
        // Fetch products from Supabase
        try {
          const productsRes = await fetch("/api/admin/products")
          if (productsRes.ok) {
            const { products: fetchedProducts } = await productsRes.json()
            console.log("[EcoGood] Loaded products from Supabase:", fetchedProducts.length)
            setProducts(fetchedProducts)
          }
        } catch (error) {
          console.warn("[EcoGood] Failed to load products from Supabase:", error)
        }

        // Fetch blog posts from Supabase
        try {
          const postsRes = await fetch("/api/admin/posts")
          if (postsRes.ok) {
            const { posts: fetchedPosts } = await postsRes.json()
            console.log("[EcoGood] Loaded posts from Supabase:", fetchedPosts.length)
            setPosts(fetchedPosts)
          }
        } catch (error) {
          console.warn("[EcoGood] Failed to load posts from Supabase:", error)
        }

        // Fetch other data from blob storage (temporarily keep these)
        const results = await Promise.allSettled([
          loadDataFromBlob("CONTACTS"),
          loadDataFromBlob("APPLICATIONS"),
          loadDataFromBlob("ORDERS"),
          loadDataFromBlob("JOBS"),
          loadDataFromBlob("MEDIA"),
        ])

        const [contactsResult, applicationsResult, ordersResult, jobsResult, mediaResult] = results

        if (contactsResult.status === "fulfilled" && contactsResult.value) {
          setContacts(contactsResult.value)
        }

        if (applicationsResult.status === "fulfilled" && applicationsResult.value) {
          setApplications(applicationsResult.value)
        }

        if (ordersResult.status === "fulfilled" && ordersResult.value) {
          setOrders(ordersResult.value)
        }

        if (jobsResult.status === "fulfilled" && jobsResult.value) {
          setJobs(jobsResult.value)
        }

        if (mediaResult.status === "fulfilled" && mediaResult.value) {
          setMedia(mediaResult.value)
        }

        await fetchCartOrdersFromSupabase()

        setLoadError(null)
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error)
        console.error("[EcoGood] Failed to initialize data:", errorMsg)
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
      }, 60000)
    }

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

  const addProduct = async (product: Omit<Product, "id">) => {
    try {
      const validated = ProductSchema.omit({ id: true }).parse(product)
      
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.error || "Lỗi khi thêm sản phẩm")
        return { success: false, error: error.error || "Lỗi khi thêm sản phẩm" }
      }

      const { product: newProduct } = await response.json()
      setProducts([newProduct, ...products])
      toast.success("Đã thêm sản phẩm thành công!")
      return { success: true }
    } catch (error: any) {
      const errorMsg = error.errors?.[0]?.message || "Lỗi xác thực dữ liệu"
      toast.error(errorMsg)
      return { success: false, error: errorMsg }
    }
  }

  const updateProduct = async (id: number, product: Omit<Product, "id">) => {
    try {
      const validated = ProductSchema.omit({ id: true }).parse(product)
      
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.error || "Lỗi khi cập nhật sản phẩm")
        return { success: false, error: error.error || "Lỗi khi cập nhật sản phẩm" }
      }

      const { product: updatedProduct } = await response.json()
      setProducts(products.map((p) => (p.id === id ? updatedProduct : p)))
      toast.success("Đã cập nhật sản phẩm thành công!")
      return { success: true }
    } catch (error: any) {
      const errorMsg = error.errors?.[0]?.message || "Lỗi xác thực dữ liệu"
      toast.error(errorMsg)
      return { success: false, error: errorMsg }
    }
  }

  const deleteProduct = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (response.ok) {
        setProducts(products.filter((p) => p.id !== id))
        toast.success("Đã xóa sản phẩm thành công!")
      } else {
        // Show error toast
        toast.error(data.error || "Không thể xóa sản phẩm")
        throw new Error(data.error)
      }
    } catch (error: any) {
      console.error("Failed to delete product:", error)
      throw error
    }
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

  const addPost = async (post: Omit<BlogPost, "id">) => {
    try {
      const validated = BlogPostSchema.omit({ id: true }).parse(post)
      
      const response = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.error || "Lỗi khi thêm bài viết")
        return { success: false, error: error.error || "Lỗi khi thêm bài viết" }
      }

      const { post: newPost } = await response.json()
      setPosts([newPost, ...posts])
      toast.success("Đã thêm bài viết thành công!")
      return { success: true }
    } catch (error: any) {
      const errorMsg = error.errors?.[0]?.message || "Lỗi xác thực dữ liệu"
      toast.error(errorMsg)
      return { success: false, error: errorMsg }
    }
  }

  const updatePost = async (id: number, post: Omit<BlogPost, "id">) => {
    try {
      const validated = BlogPostSchema.omit({ id: true }).parse(post)
      
      const response = await fetch(`/api/admin/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.error || "Lỗi khi cập nhật bài viết")
        return { success: false, error: error.error || "Lỗi khi cập nhật bài viết" }
      }

      const { post: updatedPost } = await response.json()
      setPosts(posts.map((p) => (p.id === id ? updatedPost : p)))
      toast.success("Đã cập nhật bài viết thành công!")
      return { success: true }
    } catch (error: any) {
      const errorMsg = error.errors?.[0]?.message || "Lỗi xác thực dữ liệu"
      toast.error(errorMsg)
      return { success: false, error: errorMsg }
    }
  }

  const deletePost = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/posts/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (response.ok) {
        setPosts(posts.filter((p) => p.id !== id))
        toast.success("Đã xóa bài viết thành công!")
      } else {
        toast.error(data.error || "Không thể xóa bài viết")
        throw new Error(data.error)
      }
    } catch (error: any) {
      console.error("Failed to delete post:", error)
      throw error
    }
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
      const orderIds = orders.map((o) => o.id).filter((id): id is number => id !== undefined)
      const maxId = orderIds.length > 0 ? Math.max(...orderIds) : 0
      const newOrder = {
        ...validated,
        id: maxId + 1,
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
      const jobIds = jobs.map((j) => j.id).filter((id): id is number => id !== undefined)
      const maxId = jobIds.length > 0 ? Math.max(...jobIds) : 0
      const newJob = {
        ...validated,
        id: maxId + 1,
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
