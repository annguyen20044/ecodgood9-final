"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { AlertCircle, CheckCircle, Loader } from "lucide-react"

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

  useEffect(() => {
    fetchBankConfig()
  }, [])

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
      </div>
    </div>
  )
}
