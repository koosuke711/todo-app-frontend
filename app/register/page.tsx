// src/pages/register.tsx
"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import SignupPage from '@/components/SignupPage';

const Register: React.FC = () => {
  const [error, setError] = useState('');
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleRegister = async (username: string, password: string) => {
    const response = await fetch(`${backendUrl}/api/users/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      router.push('/login');  // 登録成功後、ログインページへリダイレクト
    } else {
      const data = await response.json();
      setError(data.detail || '登録に失敗しました。');
      console.log(error)
    }
  };

  return (
    <SignupPage
      onSubmit={handleRegister}
    />
  );
};

export default Register;
