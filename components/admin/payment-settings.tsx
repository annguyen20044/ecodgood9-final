"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { AlertCircle, CheckCircle, Loader } from "lucide-react"
import { generateQRCode } from "@/lib/qr-code-generator"

interface BankConfig {
  bankName: string
  accountName: string
  accountNumber: string
  branch: string
  swiftCode?: string
}

export default function PaymentSettings() {
  const [bankConfig, setBankConfig] = useState<BankConfig>({
    bankName: "Ngân hàng Vietcombank",
    accountName: "EcoGood Coffee",
    accountNumber: "1234567890",
    branch: "Chi nhánh Hà Nội",
    swiftCode: "BFTVVNVX",
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error">("success")
  const [qrCode, setQrCode] = useState<string>("")

  useEffect(() => {
    fetchBankConfig()
  }, [])

  // Auto-generate QR code when bank config changes
  useEffect(() => {
    const generateQR = async () => {
      if (bankConfig.accountNumber && bankConfig.accountName) {
        const qrData = `${bankConfig.accountNumber}|${bankConfig.accountName}`
        const qr = await generateQRCode(qrData)
        setQrCode(qr)
      }
    }
    generateQR()
  }, [bankConfig.accountNumber, bankConfig.accountName, bankConfig.bankName])

  const fetchBankConfig = async () => {
    try {
      const response = await fetch("/api/bank-transfer/config")
      const data = await response.json()
      if (data.success && data.bankConfig) {
        setBankConfig({
          bankName: data.bankConfig.bankName,
          accountName: data.bankConfig.accountName,
          accountNumber: data.bankConfig.accountNumber,
          branch: data.bankConfig.branch,
          swiftCode: data.bankConfig.swiftCode || "",
        })
      }
    } catch (error) {
      console.error("Failed to fetch bank config:", error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setBankConfig((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/bank-transfer/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bankConfig),
      })

      const data = await response.json()
      if (data.success) {
        setMessageType("success")
        setMessage("Cập nhật thông tin ngân hàng thành công!")
        if (data.bankConfig) {
          setBankConfig({
            bankName: data.bankConfig.bankName,
            accountName: data.bankConfig.accountName,
            accountNumber: data.bankConfig.accountNumber,
            branch: data.bankConfig.branch,
            swiftCode: data.bankConfig.swiftCode || "",
          })
        }
        // Clear message after 3 seconds
        setTimeout(() => setMessage(""), 3000)
      } else {
        setMessageType("error")
        setMessage(data.error || "Cập nhật thất bại")
      }
    } catch (error) {
      setMessageType("error")
      setMessage("Lỗi khi cập nhật thông tin ngân hàng")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Current Bank Config */}
      <div className="bg-white border border-secondary/20 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-primary mb-6">Cài đặt thanh toán</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Tên ngân hàng</label>
            <input
              type="text"
              name="bankName"
              value={bankConfig.bankName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-secondary/20 rounded-lg focus:outline-none focus:border-primary"
              placeholder="Nhập tên ngân hàng"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Tên chủ tài khoản</label>
            <input
              type="text"
              name="accountName"
              value={bankConfig.accountName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-secondary/20 rounded-lg focus:outline-none focus:border-primary"
              placeholder="Nhập tên chủ tài khoản"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Số tài khoản</label>
            <input
              type="text"
              name="accountNumber"
              value={bankConfig.accountNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-secondary/20 rounded-lg focus:outline-none focus:border-primary"
              placeholder="Nhập số tài khoản"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Chi nhánh</label>
            <input
              type="text"
              name="branch"
              value={bankConfig.branch}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-secondary/20 rounded-lg focus:outline-none focus:border-primary"
              placeholder="Nhập chi nhánh"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Mã SWIFT (tùy chọn)</label>
            <input
              type="text"
              name="swiftCode"
              value={bankConfig.swiftCode || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-secondary/20 rounded-lg focus:outline-none focus:border-primary"
              placeholder="Nhập mã SWIFT"
            />
          </div>

          {message && (
            <div
              className={`flex items-center gap-2 p-4 rounded-lg ${
                messageType === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {messageType === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              <span>{message}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader size={18} className="animate-spin" />}
            {loading ? "Đang cập nhật..." : "Cập nhật thông tin"}
          </button>
        </form>

        {/* Right Column - QR Code Preview */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-blue-50 to-green-50 border border-primary/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-primary mb-4 text-center">
              Mã QR chuyển khoản
            </h3>
            
            {qrCode ? (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <img 
                    src={qrCode} 
                    alt="QR Code" 
                    className="w-full h-auto mx-auto max-w-[250px]" 
                  />
                </div>
                <p className="text-xs text-center text-foreground/60">
                  Sẽ được cập nhật tự động khi bạn thay đổi thông tin
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[250px] bg-white rounded-lg">
                <Loader className="animate-spin text-primary" size={32} />
              </div>
            )}
          </div>

          {/* Bank Info Display */}
          <div className="bg-white border border-secondary/20 rounded-lg p-5 space-y-3">
            <h4 className="font-semibold text-primary mb-3">Thông tin chuyển khoản</h4>
            
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-foreground/60">Ngân hàng:</span>
                <p className="font-semibold text-foreground">{bankConfig.bankName}</p>
              </div>
              
              <div>
                <span className="text-foreground/60">Chi nhánh:</span>
                <p className="font-semibold text-foreground">{bankConfig.branch}</p>
              </div>
              
              <div>
                <span className="text-foreground/60">Chủ tài khoản:</span>
                <p className="font-semibold text-foreground">{bankConfig.accountName}</p>
              </div>
              
              <div>
                <span className="text-foreground/60">Số tài khoản:</span>
                <p className="font-semibold text-foreground text-lg tracking-wider">
                  {bankConfig.accountNumber}
                </p>
              </div>
              
              {bankConfig.swiftCode && (
                <div>
                  <span className="text-foreground/60">Mã SWIFT:</span>
                  <p className="font-semibold text-foreground">{bankConfig.swiftCode}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
