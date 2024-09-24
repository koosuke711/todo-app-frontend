import { useEffect } from 'react';

const useNotification = (): void => {
  useEffect(() => {
    if (!('Notification' in window)) {
      console.error("このブラウザはデスクトップ通知をサポートしていません。");
    } else if (Notification.permission  === 'granted') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log("通知の許可が得られました。");
        } else {
          console.log("通知の許可が拒否されました。");
        }
      });
    }
  }, []);
};

export default useNotification;
