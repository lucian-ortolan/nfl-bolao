import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/src/lib/prisma";
import { requireAdmin } from "@/src/lib/auth";

export const runtime = "nodejs";

const UpdateBody = z.object({
  name: z.string().min(2),
  sortOrder: z.number().int().min(1),
  startsAt: z.string().datetime(),
});

export async function PUT(req: Request, ctx: { params: { id: string } }) {
  await requireAdmin();
  const body = UpdateBody.parse(await req.json());

  const round = await prisma.round.update({
    where: { id: ctx.params.id },
    data: {
      name: body.name.trim(),
      sortOrder: body.sortOrder,
      startsAt: new Date(body.startsAt),
    },
  });

  return NextResponse.json({ round });
}

export async function DELETE(_: Request, ctx: { params: { id: string } }) {
  await requireAdmin();
  await prisma.round.delete({ where: { id: ctx.params.id } });
  return NextResponse.json({ ok: true });
}
