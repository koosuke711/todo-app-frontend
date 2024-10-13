import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function ConfirmPage() {
  const [newPassword, setnewPassword] = useState("")
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid")
  const token = searchParams.get("token")

  const handleResetRequest = async (new_password: string) => {
    const response = await fetch(`${backendUrl}/api/users/reset-password-confirm/`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid, token, new_password })
    });

    if (response.ok) {
        alert("パスワードが再設定されました")
        console.log(response)
    }
}

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleResetRequest(newPassword)
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