"use client"

import { useState } from "react"
import { useAdmin } from "@/lib/admin-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import JobForm from "./job-form"

export default function JobManagement() {
  const { jobs, deleteJob } = useAdmin()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  const handleDeleteConfirm = (id: number) => {
    deleteJob(id)
    setDeleteConfirm(null)
  }

  const handleAddClick = () => {
    setEditingId(null)
    setShowForm(!showForm)
    if (!showForm) {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleEditClick = (jobId: number) => {
    setEditingId(jobId)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Vị trí Tuyển dụng</h2>
        <Button onClick={handleAddClick} className="bg-primary text-primary-foreground hover:bg-primary/90">
          {showForm ? "Hủy" : "Thêm Vị trí"}
        </Button>
      </div>

      {showForm && <JobForm editingId={editingId} onClose={() => setShowForm(false)} />}

      <div className="space-y-4">
        {jobs.map((job) => (
          <Card key={job.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{job.title}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-foreground/70">
                  <span>{job.department}</span>
                  <span>{job.location}</span>
                  <span>{job.type}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">{job.salary}</p>
              </div>
            </div>

            <p className="text-foreground/80 mb-4">{job.description}</p>

            <div className="mb-4">
              <h4 className="font-semibold text-foreground mb-2">Yêu cầu:</h4>
              <ul className="list-disc list-inside space-y-1 text-foreground/70 text-sm">
                {job.requirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => handleEditClick(job.id)} variant="outline" className="flex-1">
                Sửa
              </Button>
              <AlertDialog open={deleteConfirm === job.id} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
                <Button
                  onClick={() => setDeleteConfirm(job.id)}
                  variant="outline"
                  className="flex-1 text-destructive hover:bg-destructive/10"
                >
                  Xóa
                </Button>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Xác nhận xóa vị trí</AlertDialogTitle>
                    <AlertDialogDescription>
                      Bạn có chắc chắn muốn xóa vị trí "{job.title}"? Hành động này không thể hoàn tác.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteConfirm(job.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Xóa
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
