"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAdmin } from "@/lib/admin-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function AdminLogin() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login, products, posts, jobs } = useAdmin()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (login(password)) {
      try {
        console.log("[v0] Admin logged in, initializing website builder...")

        // Initialize builder
        await fetch("/api/admin/build-website", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "initialize" }),
        })

        // Sync data to Supabase
        await fetch("/api/admin/build-website", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "sync",
            data: { products, posts, jobs },
          }),
        })

        // Build website pages
        await fetch("/api/admin/build-website", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "build" }),
        })

        console.log("[v0] Website build completed")
        router.push("/admin/dashboard")
      } catch (buildError) {
        console.error("[v0] Build error:", buildError)
        // Still redirect even if build fails
        router.push("/admin/dashboard")
      }
    } else {
      setError("Mật khẩu không chính xác")
      setPassword("")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">EcoGood Admin</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Mật khẩu</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError("")
              }}
              placeholder="Nhập mật khẩu"
              className="w-full"
              disabled={isLoading}
            />
          </div>

          {error && <div className="text-destructive text-sm font-medium">{error}</div>}

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : "Đăng nhập"}
          </Button>
        </form>
      </Card>
    </div>
  )
}
