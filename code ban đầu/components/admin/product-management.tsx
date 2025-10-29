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
import ProductForm from "./product-form"

export default function ProductManagement() {
  const { products, deleteProduct } = useAdmin()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  const handleDeleteConfirm = (id: number) => {
    deleteProduct(id)
    setDeleteConfirm(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Sản phẩm</h2>
        <Button
          onClick={() => {
            setEditingId(null)
            setShowForm(!showForm)
          }}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {showForm ? "Hủy" : "Thêm Sản phẩm"}
        </Button>
      </div>

      {showForm && <ProductForm editingId={editingId} onClose={() => setShowForm(false)} />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-foreground mb-2">{product.name}</h3>
              <p className="text-primary font-bold mb-4">{product.price}</p>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setEditingId(product.id)
                    setShowForm(true)
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Sửa
                </Button>
                <AlertDialog
                  open={deleteConfirm === product.id}
                  onOpenChange={(open) => !open && setDeleteConfirm(null)}
                >
                  <Button
                    onClick={() => setDeleteConfirm(product.id)}
                    variant="outline"
                    className="flex-1 text-destructive hover:bg-destructive/10"
                  >
                    Xóa
                  </Button>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Xác nhận xóa sản phẩm</AlertDialogTitle>
                      <AlertDialogDescription>
                        Bạn có chắc chắn muốn xóa sản phẩm "{product.name}"? Hành động này không thể hoàn tác.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteConfirm(product.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Xóa
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
