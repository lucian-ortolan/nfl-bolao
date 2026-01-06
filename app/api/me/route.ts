import { NextResponse } from "next/server";
import { getUserFromSession } from "@/src/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const user = await getUserFromSession();
  if (!user) return NextResponse.json({ user: null });
  return NextResponse.json({
    user: { id: user.id, name: user.name, role: user.role },
  });
}
