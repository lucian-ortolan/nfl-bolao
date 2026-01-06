import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { z } from "zod";
import { prisma } from "@/src/lib/prisma";
import { createSession } from "@/src/lib/auth";

export const runtime = "nodejs";

const Body = z.object({
  name: z.string().min(2),
  phone: z.string().min(8),
  password: z.string().min(4),
  inviteCode: z.string().min(1),
});

export async function POST(req: Request) {
  const body = Body.parse(await req.json());

  if (body.inviteCode !== process.env.INVITE_CODE) {
    return NextResponse.json({ error: "Código inválido" }, { status: 400 });
  }

  const exists = await prisma.user.findUnique({ where: { phone: body.phone } });
  if (exists)
    return NextResponse.json(
      { error: "Telefone já cadastrado" },
      { status: 400 }
    );

  const passwordHash = await bcrypt.hash(body.password, 10);

  const user = await prisma.user.create({
    data: { name: body.name, phone: body.phone, passwordHash, role: "PLAYER" },
    select: { id: true, name: true, role: true },
  });

  await createSession(user.id);
  return NextResponse.json({ user });
}
