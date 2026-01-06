import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/src/lib/prisma";
import { requireUser } from "@/src/lib/auth";

export const runtime = "nodejs";

const SinglePickBody = z.object({
  gameId: z.string(),
  predictedHome: z.number().int().min(0),
  predictedAway: z.number().int().min(0),
});

const MultiplePicksBody = z.object({
  picks: z.array(SinglePickBody),
});

const Body = z.union([SinglePickBody, MultiplePicksBody]);

export async function POST(req: Request) {
  const user = await requireUser();
  const body = Body.parse(await req.json());

  // Salvar múltiplos palpites
  if ("picks" in body) {
    const now = new Date();
    const gameIds = body.picks.map((p) => p.gameId);

    // Buscar todos os jogos de uma vez
    const games = await prisma.game.findMany({
      where: { id: { in: gameIds } },
    });

    const gamesMap = new Map(games.map((g) => [g.id, g]));

    // Validar todos os palpites
    const errors: string[] = [];
    const validPicks = body.picks.filter((pick) => {
      const game = gamesMap.get(pick.gameId);
      if (!game) {
        errors.push(`Jogo ${pick.gameId} não existe`);
        return false;
      }
      if (now >= game.startsAt) {
        errors.push(`Palpite para ${pick.gameId} já fechado`);
        return false;
      }
      return true;
    });

    if (errors.length > 0 && validPicks.length === 0) {
      return NextResponse.json({ error: errors.join(", ") }, { status: 400 });
    }

    // Salvar todos os palpites válidos
    await Promise.all(
      validPicks.map((pick) =>
        prisma.pick.upsert({
          where: { userId_gameId: { userId: user.id, gameId: pick.gameId } },
          create: {
            userId: user.id,
            gameId: pick.gameId,
            predictedHome: pick.predictedHome,
            predictedAway: pick.predictedAway,
          },
          update: {
            predictedHome: pick.predictedHome,
            predictedAway: pick.predictedAway,
          },
        })
      )
    );

    return NextResponse.json({
      ok: true,
      saved: validPicks.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  }

  // Salvar palpite único (compatibilidade com versão antiga)
  const game = await prisma.game.findUnique({ where: { id: body.gameId } });
  if (!game)
    return NextResponse.json({ error: "Jogo não existe" }, { status: 404 });
  if (new Date() >= game.startsAt)
    return NextResponse.json({ error: "Palpite fechado" }, { status: 400 });

  await prisma.pick.upsert({
    where: { userId_gameId: { userId: user.id, gameId: body.gameId } },
    create: {
      userId: user.id,
      gameId: body.gameId,
      predictedHome: body.predictedHome,
      predictedAway: body.predictedAway,
    },
    update: {
      predictedHome: body.predictedHome,
      predictedAway: body.predictedAway,
    },
  });

  return NextResponse.json({ ok: true });
}
