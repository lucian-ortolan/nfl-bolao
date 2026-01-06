import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { z } from "zod";
import { prisma } from "@/src/lib/prisma";
import { requireUser } from "@/src/lib/auth";

export const runtime = "nodejs";

const Body = z.object({
  currentPassword: z.string().min(4),
  newPassword: z.string().min(4),
  confirmPassword: z.string().min(4),
});

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = Body.parse(await req.json());

    // Validar se a nova senha e confirmação são iguais
    if (body.newPassword !== body.confirmPassword) {
      return NextResponse.json(
        { error: "As senhas não coincidem" },
        { status: 400 }
      );
    }

    // Verificar se a senha atual está correta
    const userWithPassword = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!userWithPassword) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      body.currentPassword,
      userWithPassword.passwordHash
    );

    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: "Senha atual incorreta" },
        { status: 400 }
      );
    }

    // Hash da nova senha
    const newPasswordHash = await bcrypt.hash(body.newPassword, 10);

    // Atualizar senha no banco de dados
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newPasswordHash },
    });

    return NextResponse.json({
      message: "Senha alterada com sucesso",
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    console.error("Error changing password:", error);
    return NextResponse.json(
      { error: "Erro ao alterar senha" },
      { status: 500 }
    );
  }
}
