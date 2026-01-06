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

  if (loading) return <p className="text-zinc-400">Carregando...</p>;

  return (
    <div className="space-y-3">
      {rounds.map((r) => (
        <div key={r.id} className="rounded-lg border border-zinc-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{r.name}</div>
              <div className="text-sm text-zinc-400">
                Jogos: {r.gamesCount}{" "}
                {r.nextGameAt
                  ? `• Próximo: ${new Date(r.nextGameAt).toLocaleString()}`
                  : ""}
              </div>
            </div>

            <Link
              href={`/rodada/${r.id}`}
              className="rounded-md border border-zinc-700 px-3 py-2 hover:bg-zinc-900"
            >
              Palpitar
            </Link>
          </div>
        </div>
      ))}
      {rounds.length === 0 && (
        <p className="text-zinc-400">Nenhuma rodada cadastrada ainda.</p>
      )}
    </div>
  );
}
