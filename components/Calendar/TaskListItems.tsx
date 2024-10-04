import React from "react"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import { CalendarClock, Clock } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Task } from "@/src/types"

interface TaskListItemProps {
  task: Task
  onEditClick: (task: Task) => void
}

export function TaskListItem({ task, onEditClick }: TaskListItemProps) {
  return (
    <li className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center space-x-3">
        <span
          onClick={() => onEditClick(task)}
          className="font-medium text-primary hover:text-primary/80 cursor-pointer transition-colors duration-200"
        >
          {task.title}
        </span>
      </div>
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>
                  {task.scheduled_start_time
                    ? format(new Date(task.scheduled_start_time), "HH:mm", { locale: ja })
                    : "未設定"}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>開始時間</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex items-center space-x-1">
                <CalendarClock className="w-4 h-4" />
                <span>
                  {task.due_date
                    ? format(new Date(task.due_date), "MM/dd HH:mm", { locale: ja })
                    : "未設定"}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>締め切り</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </li>
  )
}