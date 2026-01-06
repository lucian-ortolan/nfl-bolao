import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/src/lib/prisma";
import { requireAdmin } from "@/src/lib/auth";

export const runtime = "nodejs";

const CreateBody = z.object({
  name: z.string().min(2),
  sortOrder: z.number().int().min(1),
  startsAt: z.string().datetime(), // ISO
});

export async function GET() {
  await requireAdmin();
  const rounds = await prisma.round.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ rounds });
}

export async function POST(req: Request) {
  await requireAdmin();
  const body = CreateBody.parse(await req.json());

  const round = await prisma.round.create({
    data: {
      name: body.name.trim(),
      sortOrder: body.sortOrder,
      startsAt: new Date(body.startsAt),
    },
  });

  return NextResponse.json({ round });
}
