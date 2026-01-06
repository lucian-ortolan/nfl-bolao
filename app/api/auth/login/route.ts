import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { z } from "zod";
import { prisma } from "@/src/lib/prisma";
import { createSession } from "@/src/lib/auth";

export const runtime = "nodejs";

const Body = z.object({
  phone: z.string().min(8),
  password: z.string().min(4),
});

export async function POST(req: Request) {
  const body = Body.parse(await req.json());

  const user = await prisma.user.findUnique({ where: { phone: body.phone } });
  if (!user)
    return NextResponse.json({ error: "Login inválido" }, { status: 400 });

  const ok = await bcrypt.compare(body.password, user.passwordHash);
  if (!ok)
    return NextResponse.json({ error: "Login inválido" }, { status: 400 });

  await createSession(user.id);
  return NextResponse.json({
    user: { id: user.id, name: user.name, role: user.role },
  });
}
