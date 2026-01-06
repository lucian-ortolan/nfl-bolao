"use client";

import { useEffect, useState } from "react";

type Team = { id: string; name: string; abbr: string };

export default function AdminTeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [name, setName] = useState("");
  const [abbr, setAbbr] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const r = await fetch("/api/admin/teams");
    const j = await r.json();
    setTeams(j.teams ?? []);
    setLoading(false);
  }

  useEffect(() => {
    async function fetchTeams() {
      setLoading(true);
      const r = await fetch("/api/admin/teams");
      const j = await r.json();
      setTeams(j.teams ?? []);
      setLoading(false);
    }
    fetchTeams();
  }, []);

  async function create() {
    setMsg(null);
    const r = await fetch("/api/admin/teams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, abbr }),
    });
    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      setMsg(j.error ?? "Erro ao criar time");
      return;
    }
    setName("");
    setAbbr("");
    setMsg("Time criado.");
    load();
  }

  async function remove(id: string) {
    setMsg(null);
    const r = await fetch(`/api/admin/teams/${id}`, { method: "DELETE" });
    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      setMsg(j.error ?? "Erro ao excluir");
      return;
    }
    setMsg("Time excluído.");
    load();
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-zinc-800 p-4">
        <div className="mb-2 font-medium">Criar time</div>

        <div className="grid gap-2 sm:grid-cols-3">
          <input
            className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2"
            placeholder="Nome (ex: Kansas City Chiefs)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2"
            placeholder="Sigla (ex: KC)"
            value={abbr}
            onChange={(e) => setAbbr(e.target.value)}
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
        <div className="mb-2 font-medium">Times</div>

        {loading ? (
          <p className="text-zinc-400">Carregando...</p>
        ) : teams.length === 0 ? (
          <p className="text-zinc-400">Nenhum time cadastrado.</p>
        ) : (
          <div className="space-y-2">
            {teams.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-md border border-zinc-800 p-3"
              >
                <div>
                  <div className="font-medium">{t.abbr}</div>
                  <div className="text-sm text-zinc-400">{t.name}</div>
                </div>
                <button
                  onClick={() => remove(t.id)}
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
