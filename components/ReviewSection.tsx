import React, { useEffect, useState } from 'react';

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Task } from "@/src/types"
import { ReportDialog } from './Dialog/ReportDialog';


interface ReviewSectionProps {
  tasks: Task[];
}

export function ReviewSection({ tasks }: ReviewSectionProps) {
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task>();

  useEffect(() => {
    // タスクのステータスが"完了"のものを抽出
    const filteredTasks = tasks.filter(task => task.status === '完了');
    setCompletedTasks(filteredTasks);  // 完了タスクをステートにセット
  }, [tasks]);

  const handleCompleteTask = (task: Task) => {
    setTaskToEdit(task);
    setIsReportDialogOpen(true)
  };

  const renderReviewSection = (title: string, sortKey: keyof Task) => {
    const sortedTasks = [...completedTasks].sort((a, b) => {
      const aValue = typeof a[sortKey] === 'number' ? a[sortKey] : 0;  // a[sortKey] が number 型か確認
      const bValue = typeof b[sortKey] === 'number' ? b[sortKey] : 0;  // b[sortKey] が number 型か確認
      return bValue - aValue;
    });
    

    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <Card className='w-1/2'> 
          <CardContent className="p-4">
            {sortedTasks.map((task) => (
              <motion.div
                key={task.id}
                className="flex items-center justify-between py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                onClick={() => handleCompleteTask(task)}
              >
                <span>{task.title}</span>
                {/* ソートキーが存在しない場合は"未入力"を表示 */}
                <span className="text-sm text-gray-500">{task[sortKey] ? task[sortKey] : "未入力"}</span>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <ScrollArea className="overflow-y-auto">
      {renderReviewSection("難易度", "difficulty")}
      {renderReviewSection("達成度", "achievement")}
      {renderReviewSection("想定作業時間(分)", "expected_work_time")}
      {renderReviewSection("超過時間(分)", "overtime")}

      <ReportDialog
        isOpen={isReportDialogOpen}
        onClose={() => setIsReportDialogOpen(false)}
        task={taskToEdit}
      />
    </ScrollArea>
  )
}
