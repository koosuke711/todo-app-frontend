"use client";
import ConfirmPage from "@/components/Account/ConfirmPage";
import { useSearchParams } from 'next/navigation'; 
import React from "react";

export default function PasswordReset() {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const searchParams = useSearchParams();
    const uid = searchParams.getAll("uid")
    const token = searchParams.getAll("token")
    
    // // const { uid, token } = router.query;

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

    return (
        <ConfirmPage
          onSubmit={handleResetRequest}
        />
    );
}