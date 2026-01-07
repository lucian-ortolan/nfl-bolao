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

  if (loading)
    return (
      <div className="text-center py-8">
        <p
          className="text-xl text-[#00a651] animate-pulse font-bold uppercase tracking-wide"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          Carregando Ranking... 🏈
        </p>
      </div>
    );

  return (
    <div className="bg-linear-to-b from-[#1a2f3f]/95 to-[#0a1929]/95 rounded-lg border-2 border-[#00a651]/30 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
      {rows.length === 0 ? (
        <p className="text-gray-400 text-center py-4">
          Sem pontos ainda. Faça seus palpites! 🎯
        </p>
      ) : (
        <div className="space-y-1">
          <div className="grid grid-cols-[60px_1fr_100px] gap-4 pb-3 border-b-2 border-[#00a651] mb-4">
            <span
              className="font-bold text-[#ffd700] uppercase tracking-wide"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Pos
            </span>
            <span
              className="font-bold text-[#ffd700] uppercase tracking-wide"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Jogador
            </span>
            <span
              className="font-bold text-[#ffd700] uppercase tracking-wide text-right"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Pontos
            </span>
          </div>
          {rows.map((r, i) => {
            const isTop3 = i < 3;
            const medals = ["🥇", "🥈", "🥉"];
            const bgColors = [
              "bg-gradient-to-r from-[#ffd700]/20 to-transparent border-l-4 border-[#ffd700]",
              "bg-gradient-to-r from-gray-400/20 to-transparent border-l-4 border-gray-400",
              "bg-gradient-to-r from-[#cd7f32]/20 to-transparent border-l-4 border-[#cd7f32]",
            ];

            return (
              <div
                key={r.userId}
                className={`grid grid-cols-[60px_1fr_100px] gap-4 py-3 px-4 rounded ${
                  isTop3 ? bgColors[i] : "hover:bg-[#00a651]/10"
                } transition-all duration-300`}
              >
                <span
                  className="font-bold text-lg"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  {isTop3 ? medals[i] : `#${i + 1}`}
                </span>
                <span
                  className={`${
                    isTop3 ? "font-bold text-white" : "text-gray-200"
                  } truncate`}
                >
                  {r.name}
                </span>
                <span
                  className={`text-right font-bold text-lg ${
                    isTop3 ? "text-[#ffd700]" : "text-[#00a651]"
                  }`}
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  {r.points}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
