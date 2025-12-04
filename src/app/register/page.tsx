"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({ email: "", username: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.register({ email: form.email, username: form.username, password: form.password });
      router.push("/login");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-12">
      <Link href="/" className="text-gray-500 mb-8">← Back</Link>
      <h1 className="text-2xl font-bold mb-2">Create Account</h1>
      <p className="text-gray-500 mb-8">Find your perfect match</p>
      
      {error && <p className="text-red-500 text-sm mb-4 p-3 bg-red-50 rounded-xl">{error}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" placeholder="Email" className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input type="text" placeholder="Username" className="input-field" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
        <input type="password" placeholder="Password" className="input-field" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <input type="password" placeholder="Confirm Password" className="input-field" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required />
        <button type="submit" className="btn-primary" disabled={loading}>{loading ? "Creating..." : "Register"}</button>
      </form>
      
      <p className="text-center mt-6 text-gray-500">
        Already have an account? <Link href="/login" className="text-primary font-semibold">Login</Link>
      </p>
    </div>
  );
}
