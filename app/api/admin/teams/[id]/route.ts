import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/src/lib/prisma";
import { requireAdmin } from "@/src/lib/auth";

export const runtime = "nodejs";

const UpdateBody = z.object({
  name: z.string().min(2),
  abbr: z.string().min(2).max(5),
});

export async function PUT(req: Request, ctx: { params: { id: string } }) {
  await requireAdmin();
  const body = UpdateBody.parse(await req.json());

  const team = await prisma.team.update({
    where: { id: ctx.params.id },
    data: { name: body.name.trim(), abbr: body.abbr.trim().toUpperCase() },
  });

  return NextResponse.json({ team });
}

export async function DELETE(_: Request, ctx: { params: { id: string } }) {
  await requireAdmin();
  await prisma.team.delete({ where: { id: ctx.params.id } });
  return NextResponse.json({ ok: true });
}
