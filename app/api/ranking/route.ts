import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const roundId = searchParams.get('roundId')

  const where = roundId ? { game: { roundId } } : undefined

  const grouped = await prisma.pick.groupBy({
    by: ['userId'],
    where,
    _sum: { points: true },
  })

  const users = await prisma.user.findMany({
    where: { id: { in: grouped.map(g => g.userId) } },
    select: { id: true, name: true },
  })

  const userMap = new Map(users.map(u => [u.id, u.name]))

  const ranking = grouped
    .map(g => ({ userId: g.userId, name: userMap.get(g.userId) ?? '???', points: g._sum.points ?? 0 }))
    .sort((a, b) => b.points - a.points)

  return NextResponse.json({ ranking })
}
