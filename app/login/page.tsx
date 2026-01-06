"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, password }),
    });

    setLoading(false);

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setErr(j.error ?? "Erro no login");
      return;
    }

    router.push("/rodadas");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Login</h1>

      <form
        onSubmit={onSubmit}
        className="space-y-3 rounded-lg border border-zinc-800 p-4"
      >
        <div className="space-y-1">
          <label className="text-sm text-zinc-300">Telefone</label>
          <input
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(DDD) 99999-9999"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-zinc-300">Senha</label>
          <input
            type="password"
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {err && <p className="text-sm text-red-400">{err}</p>}

        <button
          disabled={loading}
          className="rounded-md bg-zinc-100 px-3 py-2 text-zinc-900 disabled:opacity-60"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
