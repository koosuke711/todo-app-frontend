// src/components/AuthForm.tsx
import React, { useState } from 'react';

interface AuthFormProps {
  onSubmit: (username: string, password: string) => void;
  errorMessage: string;
  buttonText: string;
  toggleAuthModeText: string;
  toggleAuthModeLink: string
}

const AuthForm: React.FC<AuthFormProps> = ({ onSubmit, errorMessage, buttonText, toggleAuthModeText, toggleAuthModeLink }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(username, password);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl mb-4">{buttonText}</h2>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col">
        <input
          type="text"
          placeholder="ユーザー名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 mb-2"
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 mb-4"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {buttonText}
        </button>
      </form>
      <p>
        {toggleAuthModeText} <a href={toggleAuthModeLink} className="text-blue-500 underline">こちら</a> をクリックしてください。
      </p>
    </div>
  );
};

export default AuthForm;
