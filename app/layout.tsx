import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "sonner"
import { CartProvider } from "@/lib/cart-context"
import { OrderProvider } from "@/lib/order-context"
import { AdminProvider } from "@/lib/admin-context"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "EcoGood - Sản phẩm Bền vững & Thân thiện với Môi trường",
  description: "EcoGood - Khám phá các sản phẩm eco-friendly chất lượng cao, bền vững và thân thiện với môi trường",
  generator: "v0.app",
  icons: {
    icon: "/Logo_2_2@4x.png",
    shortcut: "/Logo_2_2@4x.png",
    apple: "/Logo_2_2@4x.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`} suppressHydrationWarning>
        <AdminProvider>
          <CartProvider>
            <OrderProvider>
              {children}
              <Analytics />
              <Toaster 
                position="top-right" 
                richColors 
                closeButton
                duration={5000}
              />
            </OrderProvider>
          </CartProvider>
        </AdminProvider>
      </body>
    </html>
  )
}
