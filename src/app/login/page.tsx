"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const submit = async (e: any) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }), headers: { "Content-Type": "application/json" } });
    const data = await res.json();
    if (res.ok) {
      router.push("/");
    } else {
      setError(data.error || "Login failed");
    }
  };

  return (
    <div className="mx-auto max-w-md px-6 py-12">
      <h1 className="text-2xl font-semibold">Login</h1>
      <form onSubmit={submit} className="mt-6 rounded-lg bg-white p-6">
        <label className="block">
          <span className="text-sm">Email</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 block w-full rounded border px-3 py-2" />
        </label>
        <label className="block mt-4">
          <span className="text-sm">Password</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 block w-full rounded border px-3 py-2" />
        </label>
        <div className="mt-4">
          <button className="rounded-full bg-[var(--color-primary)] px-5 py-2 text-white">Login</button>
        </div>
        {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
      </form>
    </div>
  );
}
