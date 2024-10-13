import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface ResetRequestPageProps {
  onSubmit: (username: string, email: string) => void;
}

export default function ResetRequestPage({ onSubmit }: ResetRequestPageProps) {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(username, email)
    // ここにログイン処理を実装
    console.log("Login attempt with:", { username, email })
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">パスワード再設定</CardTitle>
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
              <Label htmlFor="username">メールアドレス</Label>
              <Input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">再設定</Button>
          </form>
          <div className="mt-4 text-center">
            <Link href="/login" className="text-sm text-blue-600 hover:underline">
              ログイン画面へ
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}