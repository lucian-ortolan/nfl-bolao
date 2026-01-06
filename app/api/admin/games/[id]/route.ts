import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/src/lib/prisma";
import { requireAdmin } from "@/src/lib/auth";

export const runtime = "nodejs";

const UpdateBody = z.object({
  roundId: z.string().min(1),
  homeTeamId: z.string().min(1),
  awayTeamId: z.string().min(1),
  startsAt: z.string().datetime(),
});

export async function PUT(req: Request, ctx: { params: { id: string } }) {
  await requireAdmin();
  const body = UpdateBody.parse(await req.json());

  if (body.homeTeamId === body.awayTeamId) {
    return NextResponse.json(
      { error: "Time da casa e visitante não podem ser iguais" },
      { status: 400 }
    );
  }

  const game = await prisma.game.update({
    where: { id: ctx.params.id },
    data: {
      roundId: body.roundId,
      homeTeamId: body.homeTeamId,
      awayTeamId: body.awayTeamId,
      startsAt: new Date(body.startsAt),
    },
  });

  return NextResponse.json({ game });
}

export async function DELETE(_: Request, ctx: { params: { id: string } }) {
  await requireAdmin();
  await prisma.game.delete({ where: { id: ctx.params.id } });
  return NextResponse.json({ ok: true });
}
