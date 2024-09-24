// src/pages/login.tsx

"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import AccountPage from '@/components/AccountPage';
import { useAuthCheck } from '@/hooks/authHooks';

const Account: React.FC = () => {
  const router = useRouter();

  useAuthCheck(router);

  return (
      <AccountPage/>
  );
};

export default Account;
