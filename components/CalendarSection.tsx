import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Task } from '@/src/types';

interface CalendarSectionProps {
  allTask: Task[];  // タスクの配列を受け取る
}

export function CalendarSection({ allTask }: CalendarSectionProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // 選択した日付に対するタスクをフィルタリング
  const tasksForSelectedDate = allTask.filter(task => {
    if (!task.scheduled_start_time) return false; // scheduled_start_time が存在しない場合はフィルタから除外

    const taskDateString = new Date(task.scheduled_start_time).toISOString().split('T')[0];
    const selectedDateString = selectedDate?.toISOString().split('T')[0];

    return selectedDateString === taskDateString;
  });


  // タスクがある日付をISOフォーマットで保持
  const datesWithTasks = allTask.reduce((acc, task) => {
    if (!task.scheduled_start_time) return acc; // scheduled_start_time が存在しない場合はスキップ

    const date = new Date(task.scheduled_start_time).toISOString().split('T')[0];
    if (!acc.includes(date)) {
      acc.push(date);
    }
    return acc;
  }, [] as string[]);


  return (
    <div className="flex w-full mb-4">
      <div className="pr-4">  
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border w-full"
          modifiers={{
            hasTask: (date) => datesWithTasks.includes(date.toISOString().split('T')[0])
          }}
          modifiersStyles={{
            hasTask: { backgroundColor: "rgba(59, 130, 246, 0.1)", fontWeight: "bold" }
          }}
        />
      </div>
      <div className="w-1/2 pl-4">  
        <h3 className="text-lg font-semibold mb-2">
          {selectedDate ? format(selectedDate, "yyyy年MM月dd日", { locale: ja }) : "日付未選択"}のタスク
        </h3>
        <ScrollArea className="h-[200px]">
          {tasksForSelectedDate.length > 0 ? (
            <ul className="space-y-2">
              {tasksForSelectedDate.map(task => (
                <li key={task.id} className="flex items-center justify-between bg-white p-2 rounded-md shadow-sm">
                  <span>{task.title}</span>
                  <span className="text-sm text-gray-500">
                    {task.scheduled_start_time ? format(new Date(task.scheduled_start_time), "HH:mm", { locale: ja }) : "時間未設定"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">この日のタスクはありません。</p>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
