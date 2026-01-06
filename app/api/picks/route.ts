import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/src/lib/prisma'
import { requireUser } from '@/src/lib/auth'

export const runtime = 'nodejs'

const Body = z.object({
  gameId: z.string(),
  predictedHome: z.number().int().min(0),
  predictedAway: z.number().int().min(0),
})

export async function POST(req: Request) {
  const user = await requireUser()
  const body = Body.parse(await req.json())

  const game = await prisma.game.findUnique({ where: { id: body.gameId } })
  if (!game) return NextResponse.json({ error: 'Jogo não existe' }, { status: 404 })
  if (new Date() >= game.startsAt) return NextResponse.json({ error: 'Palpite fechado' }, { status: 400 })

  await prisma.pick.upsert({
    where: { userId_gameId: { userId: user.id, gameId: body.gameId } },
    create: { userId: user.id, gameId: body.gameId, predictedHome: body.predictedHome, predictedAway: body.predictedAway },
    update: { predictedHome: body.predictedHome, predictedAway: body.predictedAway },
  })

  return NextResponse.json({ ok: true })
}
