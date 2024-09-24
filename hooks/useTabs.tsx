"use client";

import { useState, useEffect } from 'react';
import { Tab } from '../src/types';
import { fetchWithToken } from './authHooks';

// プロジェクト関連のロジックをカスタムフックにまとめる
export const useTabs = () => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // ユーザーの全タブを取得
  useEffect(() => {
    const getTabs = async () => {
      const token = await fetchWithToken();
      if (token) {
        fetch(`${backendUrl}/api/tabs/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
          .then((response) => response.json())
          .then((data: Tab[]) => setTabs(data))
          .catch((error) => console.error('Error fetching Tabs:', error));
      }
    }


    getTabs();
  }, []);

  // 新しいプロジェクトを追加（渡すのは新しいプロジェクト名）
  const addTab = async (projectId: number | undefined, newTabName: string) => {
    const token = await fetchWithToken();
    fetch(`${backendUrl}/api/tabs/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ project: projectId, name: newTabName }),
    })
      .then((response) => response.json())
      .then((newTab: Tab) => setTabs((prevTabs) => [...prevTabs, newTab]))
      .catch((error) => console.error('Error adding Tab:', error));
  };

  // タブ名を更新
  const updateTab = async (projectId: number | undefined, tabId: number, updatedTabName: string) => {
    console.log(tabId)
    console.log(updatedTabName)
    const token = await fetchWithToken();
    fetch(`${backendUrl}/api/tabs/${tabId}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ project: projectId, name: updatedTabName }),
    })
      .then((response) => response.json())
      .then((updatedTab: Tab) => {
        setTabs((prevTabs) =>
          prevTabs.map((tab) => (tab.id === updatedTab.id ? updatedTab : tab))
        );
      })
      .catch((error) => console.error('Error updating Tab:', error));
  };

  // タブを削除
  const deleteTab = async (tabId: number) => {
    const token = await fetchWithToken();
    fetch(`${backendUrl}/api/tabs/${tabId}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(() => {
        setTabs((prevTabs) => prevTabs.filter((tab) => tab.id !== tabId));
      })
      .catch((error) => console.error('Error deleting Tab:', error));
  };

  return {
    tabs,
    addTab,
    updateTab,
    deleteTab,
  };
};
