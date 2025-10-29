export interface User {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  address: string | null
  city: string | null
  district: string | null
  avatar_url: string | null
  is_admin: boolean
  created_at: string
  updated_at: string
}

export interface Product {
  id: number
  name: string
  description: string
  price: number
  sku: string
  category: string
  image_url: string | null
  stock: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Order {
  id: number
  order_number: string
  user_id: string | null
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_address: string
  total_amount: number
  payment_method: string
  payment_status: string
  order_status: string
  notes: string | null
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  product_name: string
  quantity: number
  price: number
  created_at: string
}

export interface CartItem {
  id: number
  cart_id: number
  product_id: number
  quantity: number
  price_at_time: number
  created_at: string
  updated_at: string
}

export interface ShoppingCart {
  id: number
  user_id: string
  created_at: string
  updated_at: string
}
