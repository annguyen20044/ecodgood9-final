// Export all React components for WordPress plugin consumption
// This file serves as the entry point for the WordPress plugin to import components

// UI Components
export { Button } from "@/components/ui/button"
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
export { Input } from "@/components/ui/input"
export { Label } from "@/components/ui/label"
export { Textarea } from "@/components/ui/textarea"
export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
export { Checkbox } from "@/components/ui/checkbox"
export { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
export { Badge } from "@/components/ui/badge"
export { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
export { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
export { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
export { Skeleton } from "@/components/ui/skeleton"
export { Spinner } from "@/components/ui/spinner"
export { Toaster } from "@/components/ui/toaster"

// Page Components
export { default as Header } from "@/components/header"
export { default as Footer } from "@/components/footer"
export { default as Hero } from "@/components/hero"
export { default as FeaturedProducts } from "@/components/featured-products"
export { default as SignatureProduct } from "@/components/signature-product"
export { default as Blog } from "@/components/blog"
export { default as Stores } from "@/components/stores"
export { default as Menu } from "@/components/menu"
export { default as ZaloChat } from "@/components/zalo-chat"

// Admin Components
export { default as ProductManagement } from "@/components/admin/product-management"
export { default as ProductForm } from "@/components/admin/product-form"
export { default as BlogManagement } from "@/components/admin/blog-management"
export { default as BlogForm } from "@/components/admin/blog-form"
export { default as OrderManagement } from "@/components/admin/order-management"
export { default as CartOrdersReport } from "@/components/admin/cart-orders-report"
export { default as ContactManagement } from "@/components/admin/contact-management"
export { default as JobManagement } from "@/components/admin/job-management"
export { default as JobForm } from "@/components/admin/job-form"
export { default as ApplicationManagement } from "@/components/admin/application-management"

// Providers
export { ThemeProvider } from "@/components/theme-provider"

// Utilities
export { cn } from "@/lib/utils"
export { useToast } from "@/components/ui/use-toast"
export { useIsMobile } from "@/hooks/use-mobile"
