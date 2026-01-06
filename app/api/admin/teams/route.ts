import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/src/lib/prisma";
import { requireAdmin } from "@/src/lib/auth";

export const runtime = "nodejs";

const CreateBody = z.object({
  name: z.string().min(2),
  abbr: z.string().min(2).max(5),
});

export async function GET() {
  await requireAdmin();
  const teams = await prisma.team.findMany({ orderBy: { abbr: "asc" } });
  return NextResponse.json({ teams });
}

export async function POST(req: Request) {
  await requireAdmin();
  const body = CreateBody.parse(await req.json());

  const team = await prisma.team.create({
    data: { name: body.name.trim(), abbr: body.abbr.trim().toUpperCase() },
  });

  return NextResponse.json({ team });
}
