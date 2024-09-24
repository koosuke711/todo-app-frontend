import React, { useState } from "react"
import { Project } from "@/src/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string) => void;
  onUpdate: (id: number, name: string) => void;
  onDelete?: (id: number) => void;
  selectedProject: Project | null;
  isEditMode: boolean;
}

export function ProjectDialog({
  isOpen, 
  onClose, 
  onAdd, 
  onUpdate, 
  onDelete, 
  selectedProject, 
  isEditMode 
}: ProjectDialogProps) {
  const [projectName, setProjectName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEditMode && selectedProject) {
      // 編集モードでプロジェクトが渡されている場合は更新処理
      onUpdate(selectedProject.id, projectName)
    } else {
      // 新規作成モード
      onAdd(projectName)
    }
    setProjectName("")
    onClose()
  }

  const handleDelete = () => {
    if (selectedProject && onDelete) {
      onDelete(selectedProject.id)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? "プロジェクト名を更新" : "新規プロジェクト"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="projectName" className="text-right">
                プロジェクト名
              </Label>
              <Input
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button type="submit">{isEditMode ? "更新" : "作成"}</Button>
            {isEditMode && selectedProject && onDelete && (
              <Button
                type="button"
                variant="destructive"
                className="ml-2"
                onClick={handleDelete}
              >
                削除
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}