"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { CheckCircle, Copy } from "lucide-react"
import { generateQRCode } from "@/lib/qr-code-generator"

export default function PaymentConfirmationPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get("orderId")
  const method = searchParams.get("method")
  const [isUpdating, setIsUpdating] = useState(true)
  const [qrCode, setQrCode] = useState<string>("")
  const [bankDetails, setBankDetails] = useState({
    bankName: "Ngân hàng Vietcombank",
    accountName: "EcoGood Coffee",
    accountNumber: "1234567890",
    branch: "Chi nhánh Hà Nội",
  })

  useEffect(() => {
    const fetchBankConfig = async () => {
      try {
        const response = await fetch("/api/bank-transfer/config")
        const data = await response.json()
        if (data.success && data.bankConfig) {
          setBankDetails(data.bankConfig)
          if (method === "bank_transfer") {
            const qr = await generateQRCode(
              `${data.bankConfig.accountNumber}|${data.bankConfig.accountName}|${orderId}`,
            )
            setQrCode(qr)
          }
        }
      } catch (error) {
        console.error("[v0] Failed to fetch bank config:", error)
      }
    }

    fetchBankConfig()
  }, [method, orderId])

  useEffect(() => {
    const updateOrderPaymentStatus = async () => {
      if (!orderId) {
        setIsUpdating(false)
        return
      }

      try {
        const response = await fetch(`/api/admin/orders/${orderId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentMethod: method || "cod",
            paymentStatus: method === "bank_transfer" ? "pending" : "pending",
          }),
        })

        if (response.ok) {
          console.log("[v0] Order payment status updated")
        }
      } catch (error) {
        console.error("[v0] Failed to update order payment status:", error)
      } finally {
        setIsUpdating(false)
      }
    }

    updateOrderPaymentStatus()
  }, [orderId, method])

  const [copied, setCopied] = useState(false)

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(bankDetails.accountNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-secondary/20 rounded-lg p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />

            {method === "cod" ? (
              <>
                <h1 className="text-3xl font-bold text-primary mb-4">Đơn hàng đã được tạo</h1>
                <p className="text-foreground/70 mb-6">
                  Cảm ơn bạn đã đặt hàng! Bạn sẽ thanh toán tiền mặt khi nhận hàng.
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
                  <h2 className="text-lg font-semibold text-primary mb-4">Thông tin đơn hàng</h2>
                  <div className="space-y-2">
                    <p className="text-foreground/70">
                      <span className="font-semibold">Mã đơn hàng:</span> #{orderId}
                    </p>
                    <p className="text-foreground/70">
                      <span className="font-semibold">Phương thức thanh toán:</span> Thanh toán khi nhận hàng
                    </p>
                    <p className="text-foreground/70">
                      <span className="font-semibold">Trạng thái:</span>{" "}
                      {isUpdating ? "Đang cập nhật..." : "Chờ xác nhận"}
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8 text-left">
                  <h3 className="font-semibold text-primary mb-3">Lưu ý quan trọng</h3>
                  <ul className="text-sm text-foreground/70 space-y-2">
                    <li>- Vui lòng chuẩn bị tiền mặt đủ để thanh toán khi nhận hàng</li>
                    <li>- Kiểm tra hàng trước khi thanh toán</li>
                    <li>- Bạn sẽ nhận được email xác nhận đơn hàng</li>
                    <li>- Liên hệ chúng tôi nếu có bất kỳ câu hỏi nào</li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-primary mb-4">Chuyển khoản ngân hàng</h1>
                <p className="text-foreground/70 mb-6">
                  Vui lòng chuyển khoản theo thông tin dưới đây. Đơn hàng sẽ được xác nhận sau khi nhận được thanh toán.
                </p>

                {qrCode && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-center">
                    <h2 className="text-lg font-semibold text-primary mb-4">Quét mã QR để chuyển khoản</h2>
                    <img src={qrCode || "/placeholder.svg"} alt="QR Code" className="w-48 h-48 mx-auto" />
                    <p className="text-sm text-foreground/70 mt-4">Sử dụng ứng dụng ngân hàng để quét mã QR</p>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
                  <h2 className="text-lg font-semibold text-primary mb-4">Thông tin chuyển khoản</h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-foreground/70">Ngân hàng</p>
                      <p className="font-semibold text-foreground">{bankDetails.bankName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/70">Chi nhánh</p>
                      <p className="font-semibold text-foreground">{bankDetails.branch}</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/70">Tên tài khoản</p>
                      <p className="font-semibold text-foreground">{bankDetails.accountName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/70">Số tài khoản</p>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground text-lg">{bankDetails.accountNumber}</p>
                        <button onClick={handleCopyAccount} className="p-2 hover:bg-blue-100 rounded transition">
                          <Copy size={18} className="text-primary" />
                        </button>
                      </div>
                      {copied && <p className="text-sm text-green-600 mt-1">Đã sao chép!</p>}
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8 text-left">
                  <h3 className="font-semibold text-primary mb-3">Lưu ý quan trọng</h3>
                  <ul className="text-sm text-foreground/70 space-y-2">
                    <li>- Ghi nội dung chuyển khoản: Mã đơn hàng #{orderId}</li>
                    <li>- Chuyển khoản đầy đủ số tiền theo đơn hàng</li>
                    <li>- Đơn hàng sẽ được xác nhận trong vòng 24 giờ</li>
                    <li>- Bạn sẽ nhận được email xác nhận thanh toán</li>
                  </ul>
                </div>
              </>
            )}

            <Link href="/products">
              <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 transition font-semibold">
                Tiếp tục mua sắm
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
