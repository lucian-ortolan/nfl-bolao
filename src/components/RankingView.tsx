"use client";

import { useEffect, useState } from "react";

type Row = { userId: string; name: string; points: number };

export default function RankingView() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/ranking")
      .then((r) => r.json())
      .then((j) => setRows(j.ranking ?? []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-zinc-400">Carregando...</p>;

  return (
    <div className="rounded-lg border border-zinc-800 p-4">
      {rows.length === 0 ? (
        <p className="text-zinc-400">Sem pontos ainda.</p>
      ) : (
        <ol className="space-y-2">
          {rows.map((r, i) => (
            <li key={r.userId} className="flex items-center justify-between">
              <span className="text-zinc-200">
                #{i + 1} {r.name}
              </span>
              <span className="text-zinc-300">{r.points}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
