"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { List, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { fetchWithToken, useDeleteAccount, useLogout } from "@/hooks/authHooks"

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState({
    id: null,
    name: "",
  })
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [activeTab, setActiveTab] = useState("profile") // タブの状態管理
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    // 初期のユーザー情報を取得する
    const fetchUserData = async () => {
      try {
        const token = await fetchWithToken()
        const response = await fetch(`${backendUrl}/api/users/me/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        })
        const data = await response.json()
        // ユーザーIDと名前をセット
        setUser({ id: data.id, name: data.username })
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchUserData()
  }, [])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, name: e.target.value })
  }

  const handleSaveName = async () => {
    if (!user.id) {
      console.error("ユーザーIDが取得できていません")
      return
    }

    try {
      const token = await fetchWithToken()
      const response = await fetch(`${backendUrl}/api/users/${user.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ username: user.name }),
      })

      if (response.ok) {
        console.log("ユーザー名が正常に更新されました")
      } else {
        console.error("ユーザー名の更新に失敗しました")
      }
    } catch (error) {
      console.error("Error updating user name:", error)
    }
  }

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      console.error("新しいパスワードが一致しません")
      return
    }

    try {
      const token = await fetchWithToken()
      const response = await fetch(`${backendUrl}/api/users/change-password/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          old_password: currentPassword,
          new_password: newPassword,
        }),
      })

      if (response.ok) {
        console.log("パスワードが正常に変更されました")
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
        setActiveTab("profile") // プロフィールタブに切り替え
      } else {
        console.error("パスワードの変更に失敗しました")
        console.error(response)
      }
    } catch (error) {
      console.error("Error changing password:", error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">アカウント管理</h1>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => router.push('/')}>
            <List className="mr-2 h-4 w-4" />
            タスク一覧
          </Button>
          <Button variant="outline" onClick={useLogout()}>
            <LogOut className="mr-2 h-4 w-4" />
            ログアウト
          </Button>
        </div>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="profile">プロフィール</TabsTrigger>
          <TabsTrigger value="security">セキュリティ</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>プロフィール</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">ユーザー名</Label>
                <Input id="name" value={user.name} onChange={handleNameChange} />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveName}>変更を保存</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>セキュリティ</CardTitle>
              <CardDescription>パスワードを変更します。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">現在のパスワード</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">新しいパスワード</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">新しいパスワード（確認）</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handlePasswordChange}>パスワードを変更</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      <div className="mt-8">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">アカウントを削除</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>本当にアカウントを削除しますか？</AlertDialogTitle>
              <AlertDialogDescription>
                この操作は取り消せません。すべてのデータが永久に削除されます。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>キャンセル</AlertDialogCancel>
              <AlertDialogAction onClick={useDeleteAccount(user.id)}>削除する</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
