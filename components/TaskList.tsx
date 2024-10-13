import React, { useContext, useState }  from "react"
import { TaskDialog } from "./Dialog/TaskDialog"
import { ReportDialog } from "./Dialog/ReportDialog"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Settings, Plus } from "lucide-react"
import { Task } from "@/src/types"
import { TaskContext } from "@/hooks/TaskContext"

interface TaskListProps {
  tasks: Task[];
  currentTab: number;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask:(id: number | undefined) => void;
  projectId: number;
}

export function TaskList({ tasks, currentTab, projectId }: TaskListProps) {

  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const { updateTask } = useContext(TaskContext);

  const handleAddTaskClick = () => {
    setTaskToEdit(undefined);
    setIsEditMode(false);
    setIsTaskDialogOpen(true);
  };

  const handleEditTaskClick = (task: Task) => {
    setTaskToEdit(task);
    setIsEditMode(true);
    setIsTaskDialogOpen(true);
  };

  const handleStartTask = (task: Task) => {
    const startDate = new Date();  // 現在の日時を開始時間とする
    const taskData = {
      ...task,
      status: '進行中',
      actual_start_time: startDate.toISOString(),
      tab: currentTab,
      project_id: projectId,
    }
    // console.log(`プロジェクト全体のタスク:${JSON.stringify(taskData, null, 2)}`);

    updateTask(taskData)
  };

  const handleCompleteTask = (task: Task) => {
    const completionDate = new Date();  // 現在の日時を完了時間とする
    let work_time = 0;  // 作業時間を初期化
  
    // 実際の開始時間が有効であるかを確認する
    if (task.actual_start_time) {
      const start_time = new Date(task.actual_start_time);
  
      // 開始時間が有効な日付の場合のみ作業時間を計算
      if (!isNaN(start_time.getTime())) {
        work_time = Math.round((completionDate.getTime() - start_time.getTime()) / (1000 * 60));  // 作業時間を分単位で計算
      }
    }
  
    let overtime = 0;
  
    // 締め切りが設定されている場合、完了時間との差で超過時間を計算
    if (task.due_date) {
      const dueDate = new Date(task.due_date);
      
      // 完了時間が締め切りを過ぎている場合に超過時間を計算（分単位）
      if (completionDate > dueDate) {
        overtime = Math.round((completionDate.getTime() - dueDate.getTime()) / (1000 * 60));  // 分単位で計算
      }
    }
  
    const taskData = {
      ...task,
      status: '完了',
      completion_date: completionDate.toISOString(),  // ISO形式で完了時間を設定
      actual_work_time: work_time,  // 実作業時間を設定
      overtime: overtime,  // 超過時間を設定
      tab: currentTab,
      project_id: projectId
    };
  
    console.log(`プロジェクト全体のタスク:${JSON.stringify(taskData, null, 2)}`);
  
    updateTask(taskData);  // タスクの更新処理
    setTaskToEdit(taskData);
    setIsReportDialogOpen(true);
  };
  


  return (
    <ScrollArea className="overflow-y-auto">
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {tasks.filter(task => task.tab === currentTab).map((task) => (
          <motion.div
            key={task.id}
            className="flex items-center space-x-2 p-2 rounded-lg transition-colors duration-200"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <div key={task.id} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100">
              <div>
                {task.status === "未着手" && (
                  <Button variant="outline" size="sm" onClick={() => handleStartTask(task)}>開始</Button>
                )}
                {task.status === "進行中" && (
                  <Button variant="outline" size="sm" onClick={() => handleCompleteTask(task)}>完了</Button>
                )}
                {task.status === "完了" && (
                  <span className="text-green-500 px-2 py-1 rounded-full bg-green-100">完了済み</span>
                )}
              </div>
              <label
                htmlFor={`task-${task.id}`}
                className={`flex-grow cursor-pointer ${task.status === '完了' ? "line-through text-gray-500" : ""}`}
              >
                <motion.span
                  className="block p-2 rounded-lg"
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(0,0,0,0.05)" }}
                >
                  {task.title}
                </motion.span>
              </label>
            </div>
            <Button variant="ghost" size="sm" onClick={() => handleEditTaskClick(task)}>
              <Settings className="h-4 w-4" />
            </Button>
          </motion.div>
        ))}
      </motion.div>
      <Button variant="outline" className="w-5/6 justify-start mt-4" onClick={() => handleAddTaskClick()}>
        <Plus className="mr-2 h-4 w-4" />
        新規タスク
      </Button>
      <TaskDialog
        isOpen={isTaskDialogOpen}
        onClose={() => setIsTaskDialogOpen(false)}
        task={taskToEdit}
        tabId={currentTab}
        projectId={projectId}
        isEditMode={isEditMode}
      />
      <ReportDialog
        isOpen={isReportDialogOpen}
        onClose={() => setIsReportDialogOpen(false)}
        task={taskToEdit}
      />
    </ScrollArea>
  )
}