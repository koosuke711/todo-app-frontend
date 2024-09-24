
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// routerが変わるたびにログインをチェックしているが、fetchWithTokenで勝手にログインページに行くので不要
export const useAuthCheck = (router: ReturnType<typeof useRouter>) => {
  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) {
      router.push('/login'); // Redirect to login if not authenticated
    }
  }, [router]);
};

// アクセストークンが期限切れかどうかを確認する関数
export function isTokenExpired(token: string): boolean {
  const payload = JSON.parse(atob(token.split('.')[1]));
  const expiry = payload.exp * 1000;  // 有効期限をミリ秒に変換
  return Date.now() >= expiry;
}

// リフレッシュトークンで新しいアクセストークンを取得する関数
export async function refreshAccessToken(refreshToken: string | null): Promise<string | null> {
  if (!refreshToken) return null;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const response = await fetch(`${backendUrl}/api/token/refresh/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (response.ok) {
    const data = await response.json();
    return data.access;  // 新しいアクセストークンを返す
  } else {
    console.error('Error refreshing access token');
    return null;  // リフレッシュ失敗
  }
}

// アクセストークンを返すための関数
export async function fetchWithToken(): Promise<string | null> {
  let accessToken = localStorage.getItem('access');
  const refreshToken = localStorage.getItem('refresh');

  // アクセストークンが存在しない、もしくは期限切れの場合リフレッシュを行う
  if (!accessToken || isTokenExpired(accessToken)) {
    accessToken = await refreshAccessToken(refreshToken);
    if (!accessToken) {
      // リフレッシュトークンも無効ならログアウト処理
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      // alert('セッションが切れました。再ログインしてください。');
      window.location.href = '/login';  // ログインページにリダイレクト
      return null;
    }
    // 新しいアクセストークンをローカルストレージに保存
    localStorage.setItem('access', accessToken);
  }

  // 利用可能なアクセストークンを返す
  return accessToken;
}

// Hook to handle account deletion
export const useDeleteAccount = (user_id: number | null) => {
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  
  const handleDeleteAccount = async () => {
    const token = await fetchWithToken();
    const response = await fetch(`${backendUrl}/api/users/${user_id}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
    
    if (response.ok) {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      router.push('/register');
    } else {
      console.error('Error deleting account');
    }
  };

  return handleDeleteAccount;
};

// Hook to handle logout
export const useLogout = () => {
  const router = useRouter();
  
  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    router.push('/login');
  };

  return handleLogout;
};
