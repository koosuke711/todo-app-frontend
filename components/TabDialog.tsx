import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tab } from "@/src/types"

interface TabDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number | undefined;
  tab: Tab | null;
  onAdd: (projectId: number | undefined, tabName: string) => void;
  onUpdate: (projectId:number | undefined, tabId: number, tabName: string) => void;
}

export function TabDialog({ isOpen, onClose, projectId, tab, onAdd, onUpdate }: TabDialogProps) {
  const [tabName, setTabName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (tab) {
      // 編集モードでプロジェクトが渡されている場合は更新処理
      onUpdate(projectId, tab.id, tabName)
    } else {
      // 新規作成モード
      onAdd(projectId, tabName)
    }
    setTabName("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{tab ? "タブ名を更新" : "新規タブ"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tabName" className="text-right">
                タブ名
              </Label>
              <Input
                id="tabName"
                value={tabName}
                onChange={(e) => setTabName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit">{tab ? "更新" : "作成"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}