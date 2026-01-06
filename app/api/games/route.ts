import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { requireUser } from "@/src/lib/auth";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const user = await requireUser();

  const { searchParams } = new URL(req.url);
  const roundId = searchParams.get("roundId");
  if (!roundId)
    return NextResponse.json(
      { error: "roundId é obrigatório" },
      { status: 400 }
    );

  const games = await prisma.game.findMany({
    where: { roundId },
    orderBy: { startsAt: "asc" },
    include: {
      homeTeam: true,
      awayTeam: true,
      picks: {
        where: { userId: user.id },
        select: { predictedHome: true, predictedAway: true, points: true },
      },
    },
  });

  return NextResponse.json({
    games: games.map((g: (typeof games)[number]) => ({
      id: g.id,
      startsAt: g.startsAt,
      status: g.status,
      homeScore: g.homeScore,
      awayScore: g.awayScore,
      homeTeam: { abbr: g.homeTeam.abbr, name: g.homeTeam.name },
      awayTeam: { abbr: g.awayTeam.abbr, name: g.awayTeam.name },
      myPick: g.picks[0] ?? null,
    })),
  });
}
