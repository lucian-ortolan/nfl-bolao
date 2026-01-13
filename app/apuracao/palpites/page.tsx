import { prisma } from "@/src/lib/prisma";
import { requireUser } from "@/src/lib/auth";
import { Prisma } from "@prisma/client";

export const revalidate = 0;

type Props = { searchParams?: { roundId?: string } };

export default async function Page({ searchParams }: Props) {
  // Somente participantes autenticados podem ver os palpites
  await requireUser();
  const where: Prisma.GameWhereInput = {
    status: "FINAL",
    AND: [{ homeScore: { not: null } }, { awayScore: { not: null } }],
  };

  if (searchParams?.roundId) where.roundId = searchParams.roundId;

  const games = await prisma.game.findMany({
    where,
    orderBy: { startsAt: "asc" },
    include: {
      homeTeam: true,
      awayTeam: true,
      picks: { include: { user: true } },
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Palpites - Jogos Apurados</h1>
      <p className="text-sm text-zinc-400">
        Aqui você confere os palpites de todos os participantes para os jogos já
        encerrados e apurados.
      </p>

      <div className="space-y-4">
        {games.length === 0 && (
          <p className="text-zinc-400">Nenhum jogo apurado encontrado.</p>
        )}

        {games.map((g) => (
          <div key={g.id} className="rounded-lg border border-zinc-800 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">
                  {g.awayTeam.abbr} @ {g.homeTeam.abbr}
                </div>
                <div className="text-sm text-zinc-400">
                  {new Date(g.startsAt).toLocaleString()} • Final: {g.awayScore}
                  -{g.homeScore}
                </div>
              </div>
            </div>

            <div className="mt-3 overflow-auto">
              <table className="w-full table-fixed text-left text-sm">
                <thead className="text-zinc-500">
                  <tr>
                    <th className="w-1/3">Participante</th>
                    <th className="w-1/3">Palpite</th>
                    <th className="w-1/3">Pontos</th>
                  </tr>
                </thead>
                <tbody>
                  {g.picks.length === 0 && (
                    <tr>
                      <td colSpan={3} className="text-zinc-400 py-2">
                        Nenhum palpite registrado.
                      </td>
                    </tr>
                  )}
                  {g.picks.map((p) => (
                    <tr key={p.id} className="border-t border-zinc-800">
                      <td className="py-2">{p.user.name}</td>
                      <td className="py-2">
                        {p.predictedAway} x {p.predictedHome}
                      </td>
                      <td className="py-2">{p.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
