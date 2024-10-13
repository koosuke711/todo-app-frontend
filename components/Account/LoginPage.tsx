import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface LoginPageProps {
  onSubmit: (username: string, password: string) => void;
}

export default function LoginPage({ onSubmit }: LoginPageProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(username, password)
    // ここにログイン処理を実装
    console.log("Login attempt with:", { username, password })
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">ログイン</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">ユーザー名</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">パスワード</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">ログイン</Button>
          </form>
          <div className="mt-4 text-center">
            <Link href="/register" className="text-sm text-blue-600 hover:underline">
              アカウントをお持ちでない場合はこちらをクリックしてください。
            </Link>
          </div>
          <div className="mt-4 text-center">
            <Link href="/password-reset" className="text-sm text-blue-600 hover:underline">
            パスワードを忘れた方はこちら
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}