"use client";

import { useEffect, useState } from "react";

type Game = {
  id: string;
  startsAt: string;
  status: "SCHEDULED" | "FINAL";
  homeScore: number | null;
  awayScore: number | null;
  homeTeam: { abbr: string; name: string };
  awayTeam: { abbr: string; name: string };
  myPick: {
    predictedHome: number;
    predictedAway: number;
    points: number;
  } | null;
};

export default function RoundPicks({ roundId }: { roundId: string }) {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savingAll, setSavingAll] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/games?roundId=${roundId}`)
      .then((r) => r.json())
      .then((j) => setGames(j.games ?? []))
      .finally(() => setLoading(false));
  }, [roundId]);

  function setPick(gameId: string, side: "home" | "away", value: string) {
    setGames((prev) =>
      prev.map((g) => {
        if (g.id !== gameId) return g;
        const cur = g.myPick ?? {
          predictedHome: 0,
          predictedAway: 0,
          points: 0,
        };
        const n = Number(value);
        const next = {
          ...cur,
          predictedHome:
            side === "home" ? (Number.isFinite(n) ? n : 0) : cur.predictedHome,
          predictedAway:
            side === "away" ? (Number.isFinite(n) ? n : 0) : cur.predictedAway,
        };
        return { ...g, myPick: next };
      })
    );
  }

  async function save(gameId: string) {
    setMsg(null);
    setSavingId(gameId);

    const game = games.find((g) => g.id === gameId);
    if (!game?.myPick) {
      setSavingId(null);
      setMsg("Preencha o placar antes de salvar.");
      return;
    }

    const res = await fetch("/api/picks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gameId,
        predictedHome: game.myPick.predictedHome,
        predictedAway: game.myPick.predictedAway,
      }),
    });

    setSavingId(null);

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setMsg(j.error ?? "Erro ao salvar palpite");
      return;
    }

    setMsg("Palpite salvo.");
  }

  async function saveAll() {
    setMsg(null);
    setSavingAll(true);

    const now = new Date();
    const openGames = games.filter((g) => new Date(g.startsAt) > now);

    if (openGames.length === 0) {
      setSavingAll(false);
      setMsg("Não há jogos abertos para salvar.");
      return;
    }

    const picks = openGames
      .filter((g) => g.myPick)
      .map((g) => ({
        gameId: g.id,
        predictedHome: g.myPick!.predictedHome,
        predictedAway: g.myPick!.predictedAway,
      }));

    if (picks.length === 0) {
      setSavingAll(false);
      setMsg("Preencha pelo menos um palpite antes de salvar.");
      return;
    }

    const res = await fetch("/api/picks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ picks }),
    });

    setSavingAll(false);

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setMsg(j.error ?? "Erro ao salvar palpites");
      return;
    }

    const result = await res.json();
    if (result.errors && result.errors.length > 0) {
      setMsg(
        `${result.saved} palpites salvos. Avisos: ${result.errors.join(", ")}`
      );
    } else {
      setMsg(`${result.saved} palpite(s) salvo(s) com sucesso!`);
    }
  }

  if (loading) return <p className="text-zinc-400">Carregando...</p>;

  const hasOpenGames = games.some((g) => new Date() < new Date(g.startsAt));

  return (
    <div className="space-y-3">
      {msg && <p className="text-sm text-zinc-300">{msg}</p>}

      {hasOpenGames && (
        <div className="flex justify-end">
          <button
            disabled={savingAll}
            onClick={saveAll}
            className="rounded-md bg-blue-600 px-4 py-2 font-medium hover:bg-blue-700 disabled:opacity-60"
          >
            {savingAll ? "Salvando..." : "Salvar Todos os Palpites"}
          </button>
        </div>
      )}

      {games.map((g) => {
        const locked = new Date() >= new Date(g.startsAt);
        const ph = g.myPick?.predictedHome ?? 0;
        const pa = g.myPick?.predictedAway ?? 0;

        return (
          <div key={g.id} className="rounded-lg border border-zinc-800 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="font-medium">
                  {g.awayTeam.abbr} @ {g.homeTeam.abbr}
                </div>
                <div className="text-sm text-zinc-400">
                  {new Date(g.startsAt).toLocaleString()} •{" "}
                  {locked ? "Fechado" : "Aberto"}
                  {g.status === "FINAL" &&
                  g.homeScore != null &&
                  g.awayScore != null
                    ? ` • Final: ${g.awayScore}-${g.homeScore}`
                    : ""}
                </div>
                {g.status === "FINAL" && g.myPick && (
                  <div className="text-sm text-zinc-300">
                    Pontos: {g.myPick.points}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-zinc-400">
                    {g.awayTeam.abbr}
                  </span>
                  <input
                    type="number"
                    min={0}
                    disabled={locked}
                    value={pa}
                    onChange={(e) => setPick(g.id, "away", e.target.value)}
                    className="w-16 rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1 text-center disabled:opacity-60"
                  />
                  <span className="text-sm text-zinc-400">x</span>
                  <input
                    type="number"
                    min={0}
                    disabled={locked}
                    value={ph}
                    onChange={(e) => setPick(g.id, "home", e.target.value)}
                    className="w-16 rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1 text-center disabled:opacity-60"
                  />
                  <span className="text-sm text-zinc-400">
                    {g.homeTeam.abbr}
                  </span>
                </div>

                <button
                  disabled={locked || savingId === g.id}
                  onClick={() => save(g.id)}
                  className="rounded-md border border-zinc-700 px-3 py-2 hover:bg-zinc-900 disabled:opacity-60"
                >
                  {savingId === g.id ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {games.length === 0 && (
        <p className="text-zinc-400">Nenhum jogo nessa rodada ainda.</p>
      )}
    </div>
  );
}
