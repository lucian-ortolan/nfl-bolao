"use client";

import { useEffect, useState } from "react";

type Round = { id: string; name: string; sortOrder: number; startsAt: string };

export default function AdminRoundsPage() {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [name, setName] = useState("Wildcard");
  const [sortOrder, setSortOrder] = useState(1);
  const [startsAt, setStartsAt] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const r = await fetch("/api/admin/rounds");
    const j = await r.json();
    setRounds(j.rounds ?? []);
    setLoading(false);
  }

  useEffect(() => {
    //eslint-disable-next-line react-hooks/exhaustive-deps
    load();
  }, []);

  async function create() {
    setMsg(null);
    if (!startsAt) {
      setMsg("Preencha a data/hora.");
      return;
    }

    const r = await fetch("/api/admin/rounds", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        sortOrder,
        startsAt: new Date(startsAt).toISOString(),
      }),
    });

    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      setMsg(j.error ?? "Erro ao criar rodada");
      return;
    }

    setMsg("Rodada criada.");
    load();
  }

  async function remove(id: string) {
    setMsg(null);
    const r = await fetch(`/api/admin/rounds/${id}`, { method: "DELETE" });
    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      setMsg(j.error ?? "Erro ao excluir");
      return;
    }
    setMsg("Rodada excluída.");
    load();
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-zinc-800 p-4">
        <div className="mb-2 font-medium">Criar rodada</div>

        <div className="grid gap-2 sm:grid-cols-4">
          <input
            className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2"
            placeholder="Nome (Wildcard, Divisional...)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="number"
            className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            min={1}
          />
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
        <div className="mb-2 font-medium">Rodadas</div>

        {loading ? (
          <p className="text-zinc-400">Carregando...</p>
        ) : rounds.length === 0 ? (
          <p className="text-zinc-400">Nenhuma rodada cadastrada.</p>
        ) : (
          <div className="space-y-2">
            {rounds.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between rounded-md border border-zinc-800 p-3"
              >
                <div>
                  <div className="font-medium">
                    #{r.sortOrder} {r.name}
                  </div>
                  <div className="text-sm text-zinc-400">
                    Início: {new Date(r.startsAt).toLocaleString()}
                  </div>
                </div>
                <button
                  onClick={() => remove(r.id)}
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
