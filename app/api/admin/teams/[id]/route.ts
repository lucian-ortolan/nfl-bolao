import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/src/lib/prisma";
import { requireAdmin } from "@/src/lib/auth";

export const runtime = "nodejs";

const UpdateBody = z.object({
  name: z.string().min(2),
  abbr: z.string().min(2).max(5),
});

export async function PUT(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  await requireAdmin();
  const { id } = await ctx.params;

  const body = UpdateBody.parse(await req.json());

  const team = await prisma.team.update({
    where: { id },
    data: {
      name: body.name.trim(),
      abbr: body.abbr.trim().toUpperCase(),
    },
  });

  return NextResponse.json({ team });
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  await requireAdmin();
  const { id } = await ctx.params;

  await prisma.team.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
