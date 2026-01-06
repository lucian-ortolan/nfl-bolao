"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    setSuccess(false);
    setLoading(true);

    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword,
        newPassword,
        confirmPassword,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setErr(j.error ?? "Erro ao alterar senha");
      return;
    }

    setSuccess(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    // Redirecionar após 2 segundos
    setTimeout(() => {
      router.push("/rodadas");
      router.refresh();
    }, 2000);
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Alterar Senha</h1>

      <form
        onSubmit={onSubmit}
        className="space-y-3 rounded-lg border border-zinc-800 p-4"
      >
        <div className="space-y-1">
          <label className="text-sm text-zinc-300">Senha Atual</label>
          <input
            type="password"
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            minLength={4}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-zinc-300">Nova Senha</label>
          <input
            type="password"
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={4}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-zinc-300">Confirmar Nova Senha</label>
          <input
            type="password"
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={4}
          />
        </div>

        {err && <p className="text-sm text-red-400">{err}</p>}

        {success && (
          <p className="text-sm text-green-400">
            Senha alterada com sucesso! Redirecionando...
          </p>
        )}

        <button
          disabled={loading}
          className="rounded-md bg-zinc-100 px-3 py-2 text-zinc-900 disabled:opacity-60"
        >
          {loading ? "Alterando..." : "Alterar Senha"}
        </button>
      </form>
    </div>
  );
}
