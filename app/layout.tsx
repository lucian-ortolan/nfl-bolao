import "./globals.css";
import Link from "next/link";
import { getUserFromSession } from "@/src/lib/auth";
import LogoutButton from "@/src/components/LogoutButton";

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserFromSession();

  return (
    <html lang="pt-br">
      <body className="min-h-screen bg-zinc-950 text-zinc-100">
        <header className="border-b border-zinc-800">
          <div className="mx-auto flex max-w-3xl items-center justify-between p-4">
            <Link href="/" className="font-semibold">
              NFL Bolão
            </Link>

            <nav className="flex items-center gap-3 text-sm">
              {user ? (
                <>
                  <Link href="/rodadas" className="hover:underline">
                    Rodadas
                  </Link>
                  <Link href="/ranking" className="hover:underline">
                    Ranking
                  </Link>
                  {user.role === "ADMIN" && (
                    <Link href="/admin" className="hover:underline">
                      Admin
                    </Link>
                  )}
                  <span className="text-zinc-400">|</span>
                  <span className="text-zinc-300">{user.name}</span>
                  <Link
                    href="/trocar-senha"
                    className="rounded-md border border-zinc-700 px-2 py-1 hover:bg-zinc-900"
                  >
                    Trocar Senha
                  </Link>
                  <LogoutButton />
                </>
              ) : (
                <>
                  <Link href="/login" className="hover:underline">
                    Login
                  </Link>
                  <Link href="/register" className="hover:underline">
                    Cadastro
                  </Link>
                </>
              )}
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-3xl p-4">{children}</main>
      </body>
    </html>
  );
}
