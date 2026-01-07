"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

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
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md space-y-6 animate-slide-in">
        <div className="text-center">
          <h1
            className="text-5xl font-bold tracking-wider uppercase mb-2"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >            
            <span className="bg-linear-to-r from-[#ffd700] via-[#ff6b35] to-[#ffd700] bg-clip-text text-transparent">
              🔐 Login
            </span>
          </h1>
          <p className="text-gray-400">Entre e faça seus palpites!</p>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-4 bg-linear-to-b from-[#1a2f3f]/95 to-[#0a1929]/95 rounded-lg border-2 border-[#00a651]/30 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
        >
          <div className="space-y-2">
            <label
              className="text-sm font-bold text-[#ffd700] uppercase tracking-wide"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Telefone
            </label>
            <input
              className="w-full rounded-md border-2 border-[#00a651]/30 bg-[#1a2f3f]/80 px-4 py-3 text-white focus:border-[#00a651] focus:outline-none focus:shadow-[0_0_15px_rgba(0,166,81,0.4)] transition-all duration-300"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-bold text-[#ffd700] uppercase tracking-wide"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Senha
            </label>
            <input
              type="password"
              className="w-full rounded-md border-2 border-[#00a651]/30 bg-[#1a2f3f]/80 px-4 py-3 text-white focus:border-[#00a651] focus:outline-none focus:shadow-[0_0_15px_rgba(0,166,81,0.4)] transition-all duration-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {err && (
            <div className="bg-red-900/30 border-2 border-red-500 rounded-md p-3">
              <p className="text-sm text-red-400 font-semibold">⚠️ {err}</p>
            </div>
          )}

          <button
            disabled={loading}
            className="w-full rounded-lg bg-linear-to-r from-[#ff6b35] to-[#d64520] px-6 py-3 text-white font-bold text-lg uppercase tracking-wide hover:from-[#ff8555] hover:to-[#ff6b35] transition-all duration-300 shadow-[0_4px_15px_rgba(255,107,53,0.4)] hover:shadow-[0_6px_20px_rgba(255,107,53,0.6)] disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1 disabled:hover:translate-y-0 border-2 border-white/20"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            {loading ? "🏈 Entrando..." : "⚡ Entrar"}
          </button>

          <div className="text-center pt-4 border-t border-[#00a651]/30">
            <p className="text-gray-400">
              Não tem conta?{" "}
              <Link
                href="/register"
                className="text-[#ffd700] font-bold hover:text-[#ff6b35] transition-colors duration-300 uppercase tracking-wide"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                Cadastre-se
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
