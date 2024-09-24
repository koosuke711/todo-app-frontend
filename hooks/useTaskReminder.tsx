import { useEffect, useState, useRef } from 'react';
import { Task } from '@/src/types';

export const useTaskReminder = (allTask: Task[]) => {
  const [notifications, setNotifications] = useState<{ [key: number]: NodeJS.Timeout }>({});
  const allTaskRef = useRef(allTask);  // 最新のallTaskを保持するuseRef

  // useEffectで最新のallTaskを更新する
  useEffect(() => {
    allTaskRef.current = allTask;  // allTaskが変わるたびに最新の値を保持
  }, [allTask]);

  useEffect(() => {
    // 1分ごとにチェック
    const checkInterval = setInterval(() => {
      const now = new Date();

      // タスク開始5分前のタスクをフィルタリング
      const upcomingTasks = allTaskRef.current.filter(task => {
        if (task.scheduled_start_time && task.status === '未着手') {
          const scheduledStart = new Date(task.scheduled_start_time).getTime();
          const fiveMinutesBeforeStart = scheduledStart - 5 * 60 * 1000;
          return now.getTime() >= fiveMinutesBeforeStart && now.getTime() <= scheduledStart;
        }
        return false;
      });

      // すでに通知をセットしているタスクはスキップ
      const newTasks = upcomingTasks.filter(task => !(task.id in notifications));

      newTasks.forEach(task => {
        // 5分前に最初の通知を送信
        const notification = new Notification("Task Reminder", {
          body: `タスク「${task.title}」が始まります！`,
        });

        // ステータスが「進行中」になるまで5分ごとにチェック
        const intervalId = setInterval(() => {
          const updatedTask = allTaskRef.current.find(t => t.id === task.id);  // 最新のallTaskを参照

          if (updatedTask?.status === '進行中') {
            // ステータスが進行中なら通知停止
            clearInterval(intervalId);
            const newNotifications = { ...notifications };
            delete newNotifications[task.id];
            setNotifications(newNotifications);
          } else {
            // 5分ごとに通知を再送
            const notification = new Notification("Task Reminder", {
              body: `タスク「${task.title}」が開始されていません。進行中にしてください！`,
            });
          }
        }, 1 * 60 * 1000); // 5分ごとに通知を送る

        // 30分後に自動で通知を停止
        setTimeout(() => {
          clearInterval(intervalId);
          const newNotifications = { ...notifications };
          delete newNotifications[task.id];
          setNotifications(newNotifications);
        }, 30 * 60 * 1000); // 30分後に通知を停止

        setNotifications(prev => ({
          ...prev,
          [task.id]: intervalId, // タスクIDごとに通知タイマーを管理
        }));
      });
    }, 1 * 60 * 1000);  // 1分ごとにチェック

    // クリーンアップ処理
    return () => {
      clearInterval(checkInterval);  // インターバルをクリア
      Object.values(notifications).forEach(clearInterval);  // すべてのタイマーをクリア
    };
  }, [notifications]);

  return notifications;
};
