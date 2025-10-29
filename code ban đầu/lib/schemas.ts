import { z } from "zod"

export const ProductSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Tên sản phẩm không được để trống"),
  price: z.number().min(0, "Giá phải lớn hơn 0"),
  image: z.string().min(1, "Ảnh không được để trống"),
  description: z.string().min(1, "Mô tả không được để trống"),
  category: z.string().min(1, "Danh mục không được để trống"),
  sku: z.string().min(1, "SKU không được để trống"),
  stock: z.number().min(0, "Kho hàng không được âm"),
})

export const BlogPostSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "Tiêu đề không được để trống"),
  excerpt: z.string().min(1, "Tóm tắt không được để trống"),
  content: z.string().min(1, "Nội dung không được để trống"),
  image: z.string().min(1, "Ảnh không được để trống"),
  category: z.string().min(1, "Danh mục không được để trống"),
  date: z.string().min(1, "Ngày không được để trống"),
})

export const OrderSchema = z.object({
  id: z.number().optional(),
  orderNumber: z.string().min(1, "Số đơn hàng không được để trống"),
  customerName: z.string().min(1, "Tên khách hàng không được để trống"),
  customerEmail: z.string().email("Email không hợp lệ"),
  customerPhone: z.string().min(1, "Số điện thoại không được để trống"),
  customerAddress: z.string().min(1, "Địa chỉ không được để trống"),
  items: z.array(
    z.object({
      productId: z.number(),
      productName: z.string(),
      quantity: z.number().min(1),
      price: z.number().min(0),
    }),
  ),
  totalAmount: z.number().min(0),
  paymentStatus: z.enum(["pending", "completed", "failed"]),
  paymentMethod: z.enum(["vnpay", "bank_transfer", "cod"]).default("vnpay"),
  orderStatus: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
  date: z.string(),
  notes: z.string().optional(),
})

export const JobSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "Tiêu đề vị trí không được để trống"),
  department: z.string().min(1, "Phòng ban không được để trống"),
  location: z.string().min(1, "Địa điểm không được để trống"),
  type: z.string().min(1, "Loại hình công việc không được để trống"),
  salary: z.string().min(1, "Mức lương không được để trống"),
  description: z.string().min(1, "Mô tả công việc không được để trống"),
  requirements: z.array(z.string().min(1)).min(1, "Phải có ít nhất một yêu cầu"),
})

export type Product = z.infer<typeof ProductSchema>
export type BlogPost = z.infer<typeof BlogPostSchema>
export type Order = z.infer<typeof OrderSchema>
export type Job = z.infer<typeof JobSchema>
