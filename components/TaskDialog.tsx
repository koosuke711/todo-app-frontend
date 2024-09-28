import React, { useContext, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Slider } from "@/components/ui/slider"
import { format } from "date-fns"
import { Task } from "../src/types"
import { TaskContext } from "@/hooks/TaskContext"

interface TaskDialogProps {
  isOpen: boolean
  onClose: () => void
  task?: Task | null
  tabId: number   // タブID
  projectId: number // プロジェクトID
  isEditMode: boolean;
}

export function TaskDialog({ isOpen, onClose, task, tabId, projectId, isEditMode }: TaskDialogProps) {
  const { register, setValue, handleSubmit, control, reset } = useForm<Task>({
    defaultValues: task || {}  // 既存タスクがあればそれを初期値にする
  })
  const { addTask, updateTask, deleteTask } = useContext(TaskContext);
  

  // タスクが変わったときにフォームをリセットし、新しい値をセット
  useEffect(() => {
    if (isEditMode && task) {
      reset(task);  // 編集モードならタスクのデータをリセット
    } else {
      reset({
        title: "",
        status: "未着手",
        purpose: "",
        background: "",
        description: "",
        scheduled_start_time: undefined,
        due_date: null,
        difficulty: 0,
        expected_work_time: 0,
      });  // 新規作成の場合はフォームをリセット
    }
    console.log('タスクダイアログに渡されたタスク', task)
  }, [isEditMode, task, reset]);

  const onSubmitTask = (data: Task) => {
    const taskData = {
      ...data,
      tab: tabId,       // タブIDをセット
      project: projectId  // プロジェクトIDをセット
    }

    if (isEditMode) {
      // 編集モードでプロジェクトが渡されている場合は更新処理
      // onUpdate(taskData)
      updateTask(taskData)
    } else {
      // 新規作成モード
      addTask(taskData)
      console.log(`入力したタスク情報:${JSON.stringify(taskData, null, 2)}`);
    }
    // console.log(`入力したタスク情報:${JSON.stringify(taskData, null, 2)}`);
    reset()
    onClose()
  }

  const handleDelete = () => {
    deleteTask(task?.id)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] h-auto min-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{task ? "タスクを更新" : "新規タスク"}</DialogTitle> {/* 新規か更新かを区別 */}
        </DialogHeader>
        <ScrollArea className="max-h-[90vh]">
          <form onSubmit={handleSubmit(onSubmitTask)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  タイトル
                </Label>
                <Input
                  id="title"
                  className="col-span-3"
                  {...register("title", { required: true })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  ステータス
                </Label>
                <Select onValueChange={(value) => setValue("status", value)} defaultValue={task?.status || "未着手"}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="ステータスを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="未着手">未着手</SelectItem>
                    <SelectItem value="進行中">進行中</SelectItem>
                    <SelectItem value="完了">完了</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="purpose" className="text-right">
                  目的
                </Label>
                <Input
                  id="purpose"
                  className="col-span-3"
                  {...register("purpose")}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="background" className="text-right">
                  背景
                </Label>
                <Input
                  id="background"
                  className="col-span-3"
                  {...register("background")}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  詳細説明
                </Label>
                <Input
                  id="description"
                  className="col-span-3"
                  {...register("description")}
                />
              </div>            
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="scheduled_start_time" className="text-right">
                  開始日時
                </Label>
                <Controller
                  name="scheduled_start_time"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="scheduled_start_time"
                      type="datetime-local"
                      className="col-span-3"
                      value={field.value ? format(new Date(field.value), "yyyy-MM-dd'T'HH:mm") : ''}
                      onChange={(e) => field.onChange(new Date(e.target.value).toISOString())}
                    />
                  )}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="due_date" className="text-right">
                締め切り
                </Label>
                <Controller
                  name="due_date"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="due_date"
                      type="datetime-local"
                      className="col-span-3"
                      value={field.value ? format(new Date(field.value), "yyyy-MM-dd'T'HH:mm") : ''}
                      onChange={(e) => field.onChange(new Date(e.target.value).toISOString())}
                    />
                  )}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="difficulty" className="text-right">
                  難易度
                </Label>
                <Controller
                  name="difficulty"
                  control={control}
                  defaultValue={task?.difficulty || 0}
                  render={({ field: { value, onChange } }) => (
                    <div className="col-span-3">
                      <Slider
                        id="difficulty"
                        min={1}
                        max={10}
                        step={1}
                        value={[value]}
                        onValueChange={(newValue) => onChange(newValue[0])}
                      />
                      <div className="mt-2 text-center">{value}</div>
                    </div>
                  )}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="expected_work_time" className="text-right">
                  想定作業時間(分)
                </Label>
                <Input
                  id="expected_work_time"
                  type="number"
                  className="col-span-3"
                  {...register("expected_work_time", { valueAsNumber: true })}
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button type="submit">{task ? "更新" : "追加"}</Button> {/* ボタンのラベルを切り替え */}
              {isEditMode && (
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
