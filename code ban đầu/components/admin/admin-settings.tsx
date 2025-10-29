"use client"

import type React from "react"

import { useState } from "react"
import { useAdmin } from "@/lib/admin-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { AlertCircle, CheckCircle } from "lucide-react"

export default function AdminSettings() {
  const { changePassword } = useAdmin()
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    // Validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      setMessage({ type: "error", text: "Vui lòng điền tất cả các trường" })
      return
    }

    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "Mật khẩu mới phải có ít nhất 6 ký tự" })
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Mật khẩu xác nhận không khớp" })
      return
    }

    if (oldPassword === newPassword) {
      setMessage({ type: "error", text: "Mật khẩu mới phải khác mật khẩu cũ" })
      return
    }

    setLoading(true)
    try {
      const success = changePassword(oldPassword, newPassword)

      if (success) {
        setMessage({ type: "success", text: "Đổi mật khẩu thành công!" })
        setOldPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        setMessage({ type: "error", text: "Mật khẩu cũ không chính xác" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Có lỗi xảy ra, vui lòng thử lại" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-primary mb-6">Cài đặt Admin</h2>

        {/* Change Password Section */}
        <div className="max-w-md">
          <h3 className="text-lg font-semibold text-foreground mb-4">Đổi mật khẩu</h3>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Mật khẩu cũ</label>
              <Input
                type="password"
                value={oldPassword}
                onChange={(e) => {
                  setOldPassword(e.target.value)
                  setMessage(null)
                }}
                placeholder="Nhập mật khẩu cũ"
                disabled={loading}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Mật khẩu mới</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value)
                  setMessage(null)
                }}
                placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                disabled={loading}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Xác nhận mật khẩu mới</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  setMessage(null)
                }}
                placeholder="Nhập lại mật khẩu mới"
                disabled={loading}
                className="w-full"
              />
            </div>

            {message && (
              <div
                className={`flex items-center gap-2 p-3 rounded-lg ${
                  message.type === "success"
                    ? "bg-green-50 border border-green-200 text-green-800"
                    : "bg-red-50 border border-red-200 text-red-800"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle size={20} className="flex-shrink-0" />
                ) : (
                  <AlertCircle size={20} className="flex-shrink-0" />
                )}
                <span className="text-sm">{message.text}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Lưu ý:</strong> Mật khẩu mới sẽ được lưu trữ an toàn. Hãy nhớ mật khẩu mới của bạn để đăng nhập
              lần sau.
            </p>
          </div>
        </div>
      </Card>

      {/* Security Info */}
      <Card className="p-6 bg-amber-50 border-amber-200">
        <h3 className="text-lg font-semibold text-amber-900 mb-3">Thông tin bảo mật</h3>
        <ul className="space-y-2 text-sm text-amber-800">
          <li>• Sử dụng mật khẩu mạnh với ít nhất 8 ký tự</li>
          <li>• Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt</li>
          <li>• Không chia sẻ mật khẩu với bất kỳ ai</li>
          <li>• Thay đổi mật khẩu định kỳ để bảo vệ tài khoản</li>
        </ul>
      </Card>
    </div>
  )
}
