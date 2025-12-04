"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import Link from "next/link";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.login(form);
      login(res.access_token);
      router.push("/profile");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-12">
      <Link href="/" className="text-gray-500 mb-8">← Back</Link>
      <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
      <p className="text-gray-500 mb-8">Sign in to continue</p>
      
      {error && <p className="text-red-500 text-sm mb-4 p-3 bg-red-50 rounded-xl">{error}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" placeholder="Email" className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input type="text" placeholder="Username" className="input-field" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
        <input type="password" placeholder="Password" className="input-field" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <button type="submit" className="btn-primary" disabled={loading}>{loading ? "Signing in..." : "Login"}</button>
      </form>
      
      <p className="text-center mt-6 text-gray-500">
        Don&apos;t have an account? <Link href="/register" className="text-primary font-semibold">Register</Link>
      </p>
    </div>
  );
}
