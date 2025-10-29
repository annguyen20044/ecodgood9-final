"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAdmin } from "@/lib/admin-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"

interface JobFormProps {
  editingId: number | null
  onClose: () => void
}

export default function JobForm({ editingId, onClose }: JobFormProps) {
  const { jobs, addJob, updateJob } = useAdmin()
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    type: "",
    salary: "",
    description: "",
    requirements: [""],
  })

  useEffect(() => {
    if (editingId) {
      const job = jobs.find((j) => j.id === editingId)
      if (job) {
        setFormData({
          title: job.title,
          department: job.department,
          location: job.location,
          type: job.type,
          salary: job.salary,
          description: job.description,
          requirements: job.requirements,
        })
      }
    }
  }, [editingId, jobs])

  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...formData.requirements]
    newRequirements[index] = value
    setFormData({ ...formData, requirements: newRequirements })
  }

  const addRequirement = () => {
    setFormData({
      ...formData,
      requirements: [...formData.requirements, ""],
    })
  }

  const removeRequirement = (index: number) => {
    setFormData({
      ...formData,
      requirements: formData.requirements.filter((_, i) => i !== index),
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const filteredRequirements = formData.requirements.filter((req) => req.trim() !== "")
    if (filteredRequirements.length === 0) {
      alert("Phải có ít nhất một yêu cầu")
      return
    }

    const jobData = {
      title: formData.title,
      department: formData.department,
      location: formData.location,
      type: formData.type,
      salary: formData.salary,
      description: formData.description,
      requirements: filteredRequirements,
    }

    if (editingId) {
      updateJob(editingId, jobData)
    } else {
      addJob(jobData)
    }

    setFormData({
      title: "",
      department: "",
      location: "",
      type: "",
      salary: "",
      description: "",
      requirements: [""],
    })
    onClose()
  }

  return (
    <Card className="p-6 mb-6">
      <h3 className="text-xl font-semibold text-foreground mb-4">{editingId ? "Sửa Vị trí" : "Thêm Vị trí"}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Tiêu đề vị trí</label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Ví dụ: Nhân viên Bán hàng"
            required
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Phòng ban</label>
            <Input
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              placeholder="Ví dụ: Bán hàng"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Địa điểm</label>
            <Input
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Ví dụ: TP.HCM"
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Loại hình công việc</label>
            <Input
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              placeholder="Ví dụ: Toàn thời gian"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Mức lương</label>
            <Input
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              placeholder="Ví dụ: 8.000.000 - 12.000.000 đ"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Mô tả công việc</label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Nhập mô tả chi tiết công việc"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Yêu cầu</label>
          <div className="space-y-2">
            {formData.requirements.map((req, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={req}
                  onChange={(e) => handleRequirementChange(index, e.target.value)}
                  placeholder={`Yêu cầu ${index + 1}`}
                />
                {formData.requirements.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRequirement(index)}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <Button type="button" onClick={addRequirement} variant="outline" className="mt-2 w-full bg-transparent">
            Thêm Yêu cầu
          </Button>
        </div>

        <div className="flex gap-2">
          <Button type="submit" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
            {editingId ? "Cập nhật" : "Thêm"}
          </Button>
          <Button type="button" onClick={onClose} variant="outline" className="flex-1 bg-transparent">
            Hủy
          </Button>
        </div>
      </form>
    </Card>
  )
}
