import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/src/lib/prisma";
import { requireAdmin } from "@/src/lib/auth";
import { winner, distance } from "@/src/lib/scoring";

export const runtime = "nodejs";

const Body = z.object({
  homeScore: z.number().int().min(0),
  awayScore: z.number().int().min(0),
});

export async function PUT(req: Request, ctx: { params: { id: string } }) {
  await requireAdmin();
  const body = Body.parse(await req.json());

  const gameId = ctx.params.id;

  const game = await prisma.game.update({
    where: { id: gameId },
    data: {
      homeScore: body.homeScore,
      awayScore: body.awayScore,
      status: "FINAL",
    },
  });

  const picks = await prisma.pick.findMany({ where: { gameId } });
  const rh = body.homeScore;
  const ra = body.awayScore;
  const realWinner = winner(rh, ra);

  const exactWinners = picks.filter(
    (p) =>
      winner(p.predictedHome, p.predictedAway) === realWinner &&
      p.predictedHome === rh &&
      p.predictedAway === ra
  );

  const pointsByPickId = new Map<string, number>();

  if (exactWinners.length > 0) {
    for (const p of picks) {
      const win = winner(p.predictedHome, p.predictedAway) === realWinner;
      pointsByPickId.set(p.id, win ? 1 : 0);
    }
    for (const p of exactWinners) pointsByPickId.set(p.id, 3);
  } else {
    const winnerPicks = picks.filter(
      (p) => winner(p.predictedHome, p.predictedAway) === realWinner
    );
    for (const p of picks) pointsByPickId.set(p.id, 0);
    for (const p of winnerPicks) pointsByPickId.set(p.id, 1);

    if (winnerPicks.length > 0) {
      const best = Math.min(
        ...winnerPicks.map((p) =>
          distance(p.predictedHome, p.predictedAway, rh, ra)
        )
      );
      for (const p of winnerPicks) {
        if (distance(p.predictedHome, p.predictedAway, rh, ra) === best)
          pointsByPickId.set(p.id, 2);
      }
    }
  }

  await prisma.$transaction(
    picks.map((p) =>
      prisma.pick.update({
        where: { id: p.id },
        data: { points: pointsByPickId.get(p.id)! },
      })
    )
  );

  return NextResponse.json({ ok: true, game });
}
