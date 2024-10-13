"use client";
import ResetRequestPage from "@/components/Account/ResetRequestPage";
import React from "react";


export default function ResetRequest() {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const handleResetRequest = async (username: string, email: string) => {
        const response = await fetch(`${backendUrl}/api/users/password-reset/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email })
        });

        if (response.ok) {
            alert("入力されたメールアドレスに送信されました")
        }
    }

    return (
        <ResetRequestPage
          onSubmit={handleResetRequest}
        />
    );
}