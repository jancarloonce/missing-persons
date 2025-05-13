// app/signup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [pass, setPass]         = useState("");
  const [error, setError]       = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(email, pass, username);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 space-y-4 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold">Sign Up</h2>
      {error && <p className="text-red-600">{error}</p>}
      <input
        type="text"
        placeholder="Username"
        className="w-full p-2 border rounded"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 border rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 border rounded"
        value={pass}
        onChange={(e) => setPass(e.target.value)}
        required
      />
      <button
        type="submit"
        className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        Create Account
      </button>
    </form>
  );
}
