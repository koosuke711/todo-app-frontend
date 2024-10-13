import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface ConfirmPageProps {
  onSubmit: (newPassword: string) => void;
}

export default function ConfirmPage({ onSubmit }: ConfirmPageProps) {
  const [newPassword, setnewPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(newPassword)
    // ここにログイン処理を実装
    console.log("Login attempt with:", { newPassword })
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
              <Label htmlFor="newPassword">新パスワード</Label>
              <Input
                id="newPassword"
                type="text"
                value={newPassword}
                onChange={(e) => setnewPassword(e.target.value)}
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