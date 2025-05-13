"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, pass);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4">
      <h2 className="text-xl font-semibold">Login</h2>
      {error && <p className="text-red-600">{error}</p>}
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
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
        Log In
      </button>
      <p>
        Don’t have an account? <a href="/signup" className="text-blue-500">Sign up</a>
      </p>
    </form>
  );
}
