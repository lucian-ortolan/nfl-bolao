import { requireAdmin } from "@/src/lib/auth";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-lg border border-zinc-800 p-4">
        <div>
          <div className="text-lg font-semibold">Admin</div>
          <div className="text-sm text-zinc-400">
            Cadastre times, rodadas e jogos
          </div>
        </div>

        <div className="flex gap-2 text-sm">
          <Link
            className="rounded-md border border-zinc-700 px-3 py-2 hover:bg-zinc-900"
            href="/admin/times"
          >
            Times
          </Link>
          <Link
            className="rounded-md border border-zinc-700 px-3 py-2 hover:bg-zinc-900"
            href="/admin/rodadas"
          >
            Rodadas
          </Link>
          <Link
            className="rounded-md border border-zinc-700 px-3 py-2 hover:bg-zinc-900"
            href="/admin/jogos"
          >
            Jogos
          </Link>
          <Link
            className="rounded-md border border-zinc-700 px-3 py-2 hover:bg-zinc-900"
            href="/admin/apuracao"
          >
            Apuração
          </Link>
        </div>
      </div>

      {children}
    </div>
  );
}
