import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const rounds = await prisma.round.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      games: { select: { startsAt: true, status: true } },
    },
  });

  const data = rounds.map((r: (typeof rounds)[number]) => {
    const nextGame = r.games
      .slice()
      .sort(
        (a: (typeof r.games)[number], b: (typeof r.games)[number]) =>
          +new Date(a.startsAt) - +new Date(b.startsAt)
      )[0];

    return {
      id: r.id,
      name: r.name,
      sortOrder: r.sortOrder,
      startsAt: r.startsAt,
      nextGameAt: nextGame?.startsAt ?? null,
      gamesCount: r.games.length,
    };
  });

  return NextResponse.json({ rounds: data });
}
