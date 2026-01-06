import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/src/lib/prisma";
import { requireAdmin } from "@/src/lib/auth";

export const runtime = "nodejs";

export async function GET(req: Request) {
  await requireAdmin();
  const { searchParams } = new URL(req.url);
  const roundId = searchParams.get("roundId") || undefined;

  const games = await prisma.game.findMany({
    where: roundId ? { roundId } : undefined,
    orderBy: { startsAt: "asc" },
    include: { round: true, homeTeam: true, awayTeam: true },
  });

  return NextResponse.json({ games });
}

const CreateBody = z.object({
  roundId: z.string().min(1),
  homeTeamId: z.string().min(1),
  awayTeamId: z.string().min(1),
  startsAt: z.string().datetime(),
});

export async function POST(req: Request) {
  await requireAdmin();
  const body = CreateBody.parse(await req.json());

  if (body.homeTeamId === body.awayTeamId) {
    return NextResponse.json(
      { error: "Time da casa e visitante não podem ser iguais" },
      { status: 400 }
    );
  }

  const game = await prisma.game.create({
    data: {
      roundId: body.roundId,
      homeTeamId: body.homeTeamId,
      awayTeamId: body.awayTeamId,
      startsAt: new Date(body.startsAt),
    },
  });

  return NextResponse.json({ game });
}
