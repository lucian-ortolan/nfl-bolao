"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Round = {
  id: string;
  name: string;
  sortOrder: number;
  nextGameAt: string | null;
  gamesCount: number;
};

export default function RoundsList() {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/rounds")
      .then((r) => r.json())
      .then((j) => setRounds(j.rounds ?? []))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="text-center py-8">
        <p
          className="text-xl text-[#00a651] animate-pulse font-bold uppercase tracking-wide"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          Carregando Rodadas... 🏈
        </p>
      </div>
    );

  return (
    <div className="space-y-4">
      {rounds.map((r) => (
        <div
          key={r.id}
          className="bg-linear-to-b from-[#1a2f3f]/95 to-[#0a1929]/95 rounded-lg border-2 border-[#00a651]/30 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:border-[#00a651] hover:shadow-[0_12px_48px_rgba(0,0,0,0.6),0_0_30px_rgba(0,166,81,0.2)] transition-all duration-300 hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div
                className="font-bold text-2xl uppercase tracking-wide text-[#ffd700]"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                {r.name}
              </div>
              <div className="text-sm text-gray-300 flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <span className="text-[#00a651] font-bold">🏈</span>
                  {r.gamesCount} {r.gamesCount === 1 ? "Jogo" : "Jogos"}
                </span>
                {r.nextGameAt && (
                  <span className="flex items-center gap-1">
                    <span className="text-[#ff6b35] font-bold">⏰</span>
                    Próximo:{" "}
                    {new Date(r.nextGameAt).toLocaleString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/apuracao/palpites/${r.id}`}
                className="rounded-md border border-zinc-700 px-3 py-2 hover:bg-zinc-900 text-sm text-zinc-100"
                title="Ver palpites desta rodada"
              >
                👀 Palpites
              </Link>

              <Link
                href={`/rodada/${r.id}`}
                className="rounded-lg bg-linear-to-r from-[#ff6b35] to-[#d64520] px-6 py-3 text-white font-bold text-lg uppercase tracking-wide hover:from-[#ff8555] hover:to-[#ff6b35] transition-all duration-300 shadow-[0_4px_15px_rgba(255,107,53,0.4)] hover:shadow-[0_6px_20px_rgba(255,107,53,0.6)] border-2 border-white/20 hover:-translate-y-1"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                🎯 Palpitar
              </Link>
            </div>
          </div>
        </div>
      ))}
      {rounds.length === 0 && (
        <div className="text-center py-12 bg-linear-to-b from-[#1a2f3f]/50 to-[#0a1929]/50 rounded-lg border-2 border-[#00a651]/20">
          <p className="text-gray-400 text-lg">
            Nenhuma rodada cadastrada ainda. 🏈
          </p>
        </div>
      )}
    </div>
  );
}
