// src/pages/_app.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { fetchWithToken } from '../hooks/authHooks'

const App = ({ Component, pageProps }: any) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
        const token = await fetchWithToken();
        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
            if (router.pathname !== '/login' && router.pathname !== '/register') {
                router.push('/login');  // 認証されていない場合はログインページへリダイレクト
            }
        }
    }
    checkToken();
  }, [router]);

  return isAuthenticated || router.pathname === '/login' || router.pathname === '/register' ? (
    <Component {...pageProps} />
  ) : null;
};

export default App;
