// src/pages/login.tsx

"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginPage from '@/components/Account/LoginPage';

const Login: React.FC = () => {
  const [error, setError] = useState('');
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleLogin = async (username: string, password: string) => {
    const response = await fetch(`${backendUrl}/api/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('access', data.access);  // アクセストークンを保存
      localStorage.setItem('refresh', data.refresh);  // リフレッシュトークンを保存
      router.push('/');  // ログイン成功後、メインページへリダイレクト
    } else {
      const data = await response.json();
      setError(data.detail || 'ログインに失敗しました。ユーザー名またはパスワードを確認してください。');
      console.log(error)
    }
  };

  return (
      <LoginPage
        onSubmit={handleLogin}
      />
  );
};

export default Login;
