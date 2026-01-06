"use client";

import { useEffect, useMemo, useState } from "react";

type Round = { id: string; name: string; sortOrder: number; startsAt: string };

type Team = { id: string; name: string; abbr: string };

type Game = {
  id: string;
  startsAt: string;
  status: "SCHEDULED" | "FINAL";
  homeScore: number | null;
  awayScore: number | null;
  round: Round;
  homeTeam: Team;
  awayTeam: Team;
};

type RankingRow = { userId: string; name: string; points: number };

export default function AdminApuracao() {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [roundId, setRoundId] = useState<string>("");

  const [games, setGames] = useState<Game[]>([]);
  const [scores, setScores] = useState<
    Record<string, { home: string; away: string }>
  >({});

  const [ranking, setRanking] = useState<RankingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);
  const [apuringId, setApuringId] = useState<string | null>(null);

  async function loadRounds() {
    const r = await fetch("/api/admin/rounds");
    const j = await r.json();
    const list: Round[] = j.rounds ?? [];
    setRounds(list);

    if (!roundId && list[0]?.id) setRoundId(list[0].id);
  }

  async function loadGames(id: string) {
    const r = await fetch(`/api/admin/games?roundId=${id}`);
    const j = await r.json();
    const list: Game[] = j.games ?? [];
    setGames(list);

    // inicializa inputs com placar existente (se tiver)
    setScores((prev) => {
      const next = { ...prev };
      for (const g of list) {
        if (!next[g.id]) {
          next[g.id] = {
            home: g.homeScore != null ? String(g.homeScore) : "",
            away: g.awayScore != null ? String(g.awayScore) : "",
          };
        }
      }
      return next;
    });
  }

  async function loadRanking(id: string) {
    const r = await fetch(`/api/ranking?roundId=${id}`);
    const j = await r.json();
    setRanking(j.ranking ?? []);
  }

  async function refreshAll(id: string) {
    setLoading(true);
    await Promise.all([loadGames(id), loadRanking(id)]);
    setLoading(false);
  }

  useEffect(() => {
    (async () => {
      await loadRounds();
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!roundId) return;
    refreshAll(roundId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundId]);

  function setScore(gameId: string, side: "home" | "away", value: string) {
    setScores((prev) => ({
      ...prev,
      [gameId]: { ...(prev[gameId] ?? { home: "", away: "" }), [side]: value },
    }));
  }

  const roundLabel = useMemo(() => {
    const r = rounds.find((x) => x.id === roundId);
    return r ? `#${r.sortOrder} ${r.name}` : "";
  }, [roundId, rounds]);

  async function apurar(gameId: string) {
    setMsg(null);
    setApuringId(gameId);

    const s = scores[gameId] ?? { home: "", away: "" };
    const home = Number(s.home);
    const away = Number(s.away);

    if (
      !Number.isInteger(home) ||
      !Number.isInteger(away) ||
      home < 0 ||
      away < 0
    ) {
      setApuringId(null);
      setMsg("Preencha um placar válido (inteiro >= 0).");
      return;
    }

    const r = await fetch(`/api/admin/games/${gameId}/result`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ homeScore: home, awayScore: away }),
    });

    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      setApuringId(null);
      setMsg(j.error ?? "Erro ao apurar.");
      return;
    }

    // Atualiza lista e ranking na hora
    await refreshAll(roundId);
    setApuringId(null);
    setMsg("Apurado. Ranking atualizado.");
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-zinc-800 p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="font-medium">Apuração</div>
          <span className="text-zinc-400">•</span>
          <span className="text-zinc-300">{roundLabel}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2"
            value={roundId}
            onChange={(e) => setRoundId(e.target.value)}
          >
            {rounds.map((r) => (
              <option key={r.id} value={r.id}>
                #{r.sortOrder} {r.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => roundId && refreshAll(roundId)}
            className="rounded-md border border-zinc-700 px-3 py-2 hover:bg-zinc-900"
          >
            Recarregar
          </button>
        </div>

        {msg && <p className="text-sm text-zinc-300">{msg}</p>}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Jogos */}
        <div className="rounded-lg border border-zinc-800 p-4 space-y-3">
          <div className="font-medium">Jogos da rodada</div>

          {loading ? (
            <p className="text-zinc-400">Carregando...</p>
          ) : games.length === 0 ? (
            <p className="text-zinc-400">
              Nenhum jogo cadastrado nessa rodada.
            </p>
          ) : (
            <div className="space-y-2">
              {games.map((g) => {
                const locked = false; // admin pode corrigir placar se precisar
                const s = scores[g.id] ?? { home: "", away: "" };

                return (
                  <div
                    key={g.id}
                    className="rounded-md border border-zinc-800 p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-medium">
                          {g.awayTeam.abbr} @ {g.homeTeam.abbr}
                        </div>
                        <div className="text-sm text-zinc-400">
                          {new Date(g.startsAt).toLocaleString()} • {g.status}
                          {g.status === "FINAL" &&
                          g.awayScore != null &&
                          g.homeScore != null
                            ? ` • Final: ${g.awayScore}-${g.homeScore}`
                            : ""}
                        </div>
                      </div>

                      <button
                        disabled={apuringId === g.id}
                        onClick={() => apurar(g.id)}
                        className="rounded-md bg-zinc-100 px-3 py-2 text-zinc-900 disabled:opacity-60"
                      >
                        {apuringId === g.id ? "Apurando..." : "Apurar"}
                      </button>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-sm text-zinc-400">
                        {g.awayTeam.abbr}
                      </span>
                      <input
                        type="number"
                        min={0}
                        disabled={locked}
                        value={s.away}
                        onChange={(e) => setScore(g.id, "away", e.target.value)}
                        className="w-20 rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1 text-center"
                      />
                      <span className="text-sm text-zinc-400">x</span>
                      <input
                        type="number"
                        min={0}
                        disabled={locked}
                        value={s.home}
                        onChange={(e) => setScore(g.id, "home", e.target.value)}
                        className="w-20 rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1 text-center"
                      />
                      <span className="text-sm text-zinc-400">
                        {g.homeTeam.abbr}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Ranking */}
        <div className="rounded-lg border border-zinc-800 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="font-medium">Ranking (rodada)</div>
            <button
              onClick={() => roundId && loadRanking(roundId)}
              className="rounded-md border border-zinc-700 px-3 py-2 hover:bg-zinc-900"
            >
              Atualizar
            </button>
          </div>

          {loading ? (
            <p className="text-zinc-400">Carregando...</p>
          ) : ranking.length === 0 ? (
            <p className="text-zinc-400">Sem pontos nessa rodada ainda.</p>
          ) : (
            <ol className="space-y-2">
              {ranking.map((r, i) => (
                <li
                  key={r.userId}
                  className="flex items-center justify-between"
                >
                  <span className="text-zinc-200">
                    #{i + 1} {r.name}
                  </span>
                  <span className="text-zinc-300">{r.points}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}
