import { useState, useEffect } from 'react';
import { Task, Project } from '../src/types';
import { fetchWithToken } from './authHooks';

export const useTasks = (selectedProject: Project | null) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // 選んだプロジェクトのタスク取得
  useEffect(() => {
    const fetchTask = async () => {
      if (selectedProject) {
        const token = await fetchWithToken();
        fetch(`${backendUrl}/api/projects/${selectedProject.id}/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
          .then((response) => response.json())
          .then((data: Project) => setTasks(data.tasks))
          .catch((error) => console.error('Error fetching tasks:', error));
      }
    }

    fetchTask();
  }, [selectedProject]);

  // タスク更新、追加
  const saveTask = async (task: Task) => {
    const token = await fetchWithToken();
    // タスク追加
    if (task.id === 0) {
      console.log(JSON.stringify({ ...task, project: selectedProjectId }));
      fetch(`${backendUrl}/api/tasks/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ ...task, project: selectedProjectId }),
      })
        .then((response) => response.json())
        .then((newTask: Task) => setTasks((prevTasks) => [...prevTasks, newTask]))
        .catch((error) => console.error('Error adding task:', error));
    } else {
      // タスク更新
      fetch(`${backendUrl}/api/tasks/${task.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(task),
      })
        .then((response) => response.json())
        .then((updatedTask: Task) => {
          setTasks((prevTasks) =>
            prevTasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
          );
        })
        .catch((error) => console.error('Error updating task:', error));
    }
  };
  
  // タスクステータス変更
  const toggleComplete = async (taskId: number, status: '未着手' | '進行中' | '完了') => {
    const token = await fetchWithToken();
    fetch(`${backendUrl}/api/tasks/${taskId}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    })
      .then((response) => response.json())
      .then((updatedTask: Task) => {
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
        );
      })
      .catch((error) => console.error('Error updating task:', error));
  };

  return {
    tasks,
    saveTask,
    toggleComplete
  };
};
