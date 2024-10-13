// components/TaskList.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Task } from "@/src/types";

interface TaskListProps {
  tasks: Task[];
  tabColors: { [key: string]: string };
  addTaskToTree: (task: Task) => void;
}

// タスク一覧表示用コンポーネント
export function TaskList({ tasks, tabColors, addTaskToTree }: TaskListProps) {
  return (
    <div className="w-1/4 border-r pr-4">
      <h3 className="text-lg font-semibold mb-2">タスク一覧</h3>
      <ScrollArea className="h-full">
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            className="flex items-center justify-between p-2 mb-2 rounded-lg cursor-pointer"
            style={{ backgroundColor: tabColors[task.tab] || '#E0E0E0' }}
            whileHover={{ scale: 1.05 }}
            onClick={() => addTaskToTree(task)}
          >
            <span>{task.title}</span>
            <span className="text-sm text-gray-600">{task.tab}</span>
          </motion.div>
        ))}
      </ScrollArea>
    </div>
  );
}
