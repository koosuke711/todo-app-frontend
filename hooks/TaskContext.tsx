"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Task } from '@/src/types';
import { fetchWithToken } from './authHooks';

// Context の型定義（null を許容しない）
interface TaskContextType {
    allTask: Task[];
    addTask: (task: Task) => Promise<void>;
    updateTask: (task: Task) => Promise<void>;
    deleteTask: (taskId: number | undefined) => Promise<void>;
  }
  
// Context 作成時にデフォルト値を設定することで null を避ける
export const TaskContext = createContext<TaskContextType>({
allTask: [],
addTask: async () => {},
updateTask: async () => {},
deleteTask: async () => {},
});

// Provider コンポーネント
export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [allTask, setAllTask] = useState<Task[]>([]);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = await fetchWithToken();
        const response = await fetch(`${backendUrl}/api/tasks/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setAllTask(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTask();
  }, []);

  // タスクの追加
  const addTask = async (task: Task) => {
    try {
      const token = await fetchWithToken();
      const response = await fetch(`${backendUrl}/api/tasks/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(task),
      });
      const newTask: Task = await response.json();
      setAllTask((prevTasks) => [...prevTasks, newTask]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // タスクの更新
  const updateTask = async (task: Task) => {
    try {
      const token = await fetchWithToken();
      const response = await fetch(`${backendUrl}/api/tasks/${task.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(task),
      });
      const updatedTask: Task = await response.json();
      setAllTask((prevTasks) =>
        prevTasks.map((prevTask) => (prevTask.id === updatedTask.id ? updatedTask : prevTask))
      );
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // タスクの削除
  const deleteTask = async (taskId: number | undefined) => {
    try {
      const token = await fetchWithToken();
      await fetch(`${backendUrl}/api/tasks/${taskId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setAllTask((prevTasks) => prevTasks.filter((prevTask) => prevTask.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <TaskContext.Provider value={{ allTask, addTask, updateTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
};
