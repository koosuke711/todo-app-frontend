import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { format } from "date-fns";
import { Task } from "../src/types";
import { ScrollArea } from "./ui/scroll-area";

interface ReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (task: Task) => void;
  task: Task | undefined;
}

export function ReportDialog({ isOpen, onClose, onUpdate, task }: ReportDialogProps) {
  const { register, handleSubmit, control, reset } = useForm<Task>({
    defaultValues: task, // 既存タスクのデータを初期値に
  });

  useEffect(() => {
    if (task) {
      reset(task); // タスクのデータをフォームにセット
    }
  }, [task, reset]);

  const handleSubmitTask = (data: Task) => {
    onUpdate(data); // レポートデータを送信
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] h-auto min-h-[80vh]">
        <DialogHeader>
          <DialogTitle>タスク完了レポート</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh]">
            <form onSubmit={handleSubmit(handleSubmitTask)}>
            <div className="grid gap-4 py-4">
                {/* 達成度（10段階） */}
                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="achievement" className="text-right">
                    達成度（10段階）
                </Label>
                <Controller
                    name="achievement"
                    control={control}
                    defaultValue={task?.achievement || 0}
                    render={({ field: { value, onChange } }) => (
                    <div className="col-span-3">
                        <Slider
                        id="achievement"
                        min={0}
                        max={10}
                        step={1}
                        value={[value]}
                        onValueChange={(newValue) => onChange(newValue[0])}
                        />
                        <div className="mt-2 text-center">{value} / 10</div>
                    </div>
                    )}
                />
                </div>

                {/* コメント */}
                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="comment" className="text-right">
                    コメント
                </Label>
                <Input
                    id="comment"
                    className="col-span-3"
                    {...register("comment")}
                />
                </div>

                {/* 実際の開始時、完了時、超過時間 */}
                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="actual_start_time" className="text-right">
                    実際の開始時
                </Label>
                <Input
                    id="actual_start_time"
                    type="datetime-local"
                    value={task?.actual_start_time ? format(new Date(task?.actual_start_time), "yyyy-MM-dd'T'HH:mm") : ""}
                    readOnly
                    className="col-span-3"
                />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="completion_date" className="text-right">
                    完了時
                </Label>
                <Input
                    id="completion_date"
                    type="datetime-local"
                    value={task?.completion_date ? format(new Date(task?.completion_date), "yyyy-MM-dd'T'HH:mm") : ""}
                    readOnly
                    className="col-span-3"
                />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="overtime" className="text-right">
                    超過時間(分)
                </Label>
                <Input
                    id="overtime"
                    type="number"
                    value={task?.overtime?.toString()}
                    readOnly
                    className="col-span-3"
                />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="actual_work_time" className="text-right">
                    実際の作業時間(分)
                </Label>
                <Input
                    id="actual_work_time"
                    type="number"
                    value={task?.actual_work_time?.toString()}
                    readOnly
                    className="col-span-3"
                />
                </div>

                {/* その他のタスク情報 */}
                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                    タイトル
                </Label>
                <Input
                    id="title"
                    value={task?.title}
                    readOnly
                    className="col-span-3"
                />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="purpose" className="text-right">
                    目的
                </Label>
                <Input
                    id="purpose"
                    value={task?.purpose || ""}
                    readOnly
                    className="col-span-3"
                />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="background" className="text-right">
                    背景
                </Label>
                <Input
                    id="background"
                    value={task?.background || ""}
                    readOnly
                    className="col-span-3"
                />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                    詳細説明
                </Label>
                <Input
                    id="description"
                    value={task?.description || ""}
                    readOnly
                    className="col-span-3"
                />
                </div>

                {/* スケジュール開始時、締め切り、難易度、想定作業時間 */}
                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="scheduled_start_time" className="text-right">
                    開始日時
                </Label>
                <Input
                    id="scheduled_start_time"
                    type="datetime-local"
                    value={task?.scheduled_start_time ? format(new Date(task?.scheduled_start_time), "yyyy-MM-dd'T'HH:mm") : ""}
                    readOnly
                    className="col-span-3"
                />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="due_date" className="text-right">
                    締め切り
                </Label>
                <Input
                    id="due_date"
                    type="datetime-local"
                    value={task?.due_date ? format(new Date(task?.due_date), "yyyy-MM-dd'T'HH:mm") : ""}
                    readOnly
                    className="col-span-3"
                />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="difficulty" className="text-right">
                    難易度
                </Label>
                <Input
                    id="difficulty"
                    type="number"
                    value={task?.difficulty.toString()}
                    readOnly
                    className="col-span-3"
                />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="expected_work_time" className="text-right">
                    想定作業時間(分)
                </Label>
                <Input
                    id="expected_work_time"
                    type="number"
                    value={task?.expected_work_time?.toString()}
                    readOnly
                    className="col-span-3"
                />
                </div>
            </div>

            <div className="flex justify-end mt-4">
                <Button type="submit">完了</Button>
            </div>
            </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
