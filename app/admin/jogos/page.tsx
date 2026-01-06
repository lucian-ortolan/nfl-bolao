"use client";

import { useEffect, useState } from "react";

type Team = { id: string; name: string; abbr: string };
type Round = { id: string; name: string; sortOrder: number };
type Game = {
  id: string;
  startsAt: string;
  round: Round;
  homeTeam: Team;
  awayTeam: Team;
};

export default function AdminGamesPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [games, setGames] = useState<Game[]>([]);

  const [roundId, setRoundId] = useState("");
  const [homeTeamId, setHomeTeamId] = useState("");
  const [awayTeamId, setAwayTeamId] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  async function loadAll() {
    const [t, r, g] = await Promise.all([
      fetch("/api/admin/teams").then((x) => x.json()),
      fetch("/api/admin/rounds").then((x) => x.json()),
      fetch("/api/admin/games").then((x) => x.json()),
    ]);

    setTeams(t.teams ?? []);
    setRounds(r.rounds ?? []);
    setGames(g.games ?? []);

    // presets
    if (!roundId && r.rounds?.[0]?.id) setRoundId(r.rounds[0].id);
    if (!homeTeamId && t.teams?.[0]?.id) setHomeTeamId(t.teams[0].id);
    if (!awayTeamId && t.teams?.[1]?.id) setAwayTeamId(t.teams[1].id);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundId, homeTeamId, awayTeamId]);

  async function create() {
    setMsg(null);
    if (!roundId || !homeTeamId || !awayTeamId || !startsAt) {
      setMsg("Preencha tudo.");
      return;
    }

    const r = await fetch("/api/admin/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roundId,
        homeTeamId,
        awayTeamId,
        startsAt: new Date(startsAt).toISOString(),
      }),
    });

    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      setMsg(j.error ?? "Erro ao criar jogo");
      return;
    }

    setMsg("Jogo criado.");
    loadAll();
  }

  async function remove(id: string) {
    setMsg(null);
    const r = await fetch(`/api/admin/games/${id}`, { method: "DELETE" });
    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      setMsg(j.error ?? "Erro ao excluir jogo");
      return;
    }
    setMsg("Jogo excluído.");
    loadAll();
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-zinc-800 p-4">
        <div className="mb-2 font-medium">Criar jogo</div>

        <div className="grid gap-2 sm:grid-cols-5">
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

          <select
            className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2"
            value={awayTeamId}
            onChange={(e) => setAwayTeamId(e.target.value)}
          >
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.abbr} (visitante)
              </option>
            ))}
          </select>

          <select
            className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2"
            value={homeTeamId}
            onChange={(e) => setHomeTeamId(e.target.value)}
          >
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.abbr} (casa)
              </option>
            ))}
          </select>

          <input
            type="datetime-local"
            className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2"
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
          />

          <button
            onClick={create}
            className="rounded-md bg-zinc-100 px-3 py-2 text-zinc-900"
          >
            Criar
          </button>
        </div>

        {msg && <p className="mt-2 text-sm text-zinc-300">{msg}</p>}
      </div>

      <div className="rounded-lg border border-zinc-800 p-4">
        <div className="mb-2 font-medium">Jogos</div>

        {games.length === 0 ? (
          <p className="text-zinc-400">Nenhum jogo cadastrado.</p>
        ) : (
          <div className="space-y-2">
            {games.map((g) => (
              <div
                key={g.id}
                className="flex items-center justify-between rounded-md border border-zinc-800 p-3"
              >
                <div>
                  <div className="font-medium">
                    #{g.round.sortOrder} {g.round.name} • {g.awayTeam.abbr} @{" "}
                    {g.homeTeam.abbr}
                  </div>
                  <div className="text-sm text-zinc-400">
                    {new Date(g.startsAt).toLocaleString()}
                  </div>
                </div>
                <button
                  onClick={() => remove(g.id)}
                  className="rounded-md border border-zinc-700 px-3 py-2 hover:bg-zinc-900"
                >
                  Excluir
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
