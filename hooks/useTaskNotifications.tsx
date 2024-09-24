import { useEffect } from 'react';
import { fetchWithToken } from './authHooks';

interface NotifyTask {
  id: number;
  title: string;
  start_time: string; // ISO形式の日時文字列
}

const useTaskNotifications = (): void => {
  useEffect(() => {
    const fetchNotifications = async () => {
        // トークンをローカルストレージから取得（保存場所に応じて変更）
        const token = await fetchWithToken(); // トークンを取得

        if (!token) {
            console.error("認証トークンが見つかりません。ログインしてください。");
            return;
        }

        fetch('http://localhost:8000/api/task-notifications', {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,  // トークンをAuthorizationヘッダーに追加
            },
        })
        .then(response => {
            if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data: { tasks: NotifyTask[] }) => {
            if (data.tasks && data.tasks.length > 0) {
                data.tasks.forEach((task: NotifyTask) => {
                    showNotification(task);
            });
            } else {
                console.log("通知するタスクがありません。");
            }
        })
        .catch(error => {
            console.error("タスク通知の取得中にエラーが発生しました:", error);
        });
    };


    const showNotification = (task: NotifyTask) => {
      if (Notification.permission === 'granted') {
        const notification = new Notification("Task Reminder", {
          body: `タスク「${task.title}」がもうすぐ始まります！`,
        });

        // 通知がクリックされたときのアクション
        notification.onclick = () => {
          window.focus();
          window.location.href = `/tasks/${task.id}`; // タスク詳細ページに遷移
        };
      }
    };

    // 初回実行
    fetchNotifications();

    // 60秒ごとにタスク通知をチェック
    const intervalId = setInterval(fetchNotifications, 60000); // 60000ミリ秒 = 60秒

    // クリーンアップ関数
    return () => clearInterval(intervalId);
  }, []);
};

export default useTaskNotifications;
