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
      <body className="min-h-screen relative">
        {/* Header com tema NFL */}
        <header className="border-b-4 border-[#00a651] bg-gradient-to-r from-[#0a1929] via-[#1a2f3f] to-[#0a1929] shadow-lg sticky top-0 z-50 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
            <Link
              href="/"
              className="text-3xl font-bold tracking-wider uppercase"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              <span className="bg-gradient-to-r from-[#ffd700] via-[#ff6b35] to-[#ffd700] bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                🏈 NFL Bolão
              </span>
            </Link>

            <nav className="flex items-center gap-4 text-sm font-semibold uppercase tracking-wide">
              {user ? (
                <>
                  <Link
                    href="/rodadas"
                    className="px-3 py-2 rounded hover:bg-[#00a651] hover:text-white transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,166,81,0.5)]"
                  >
                    Rodadas
                  </Link>
                  <Link
                    href="/ranking"
                    className="px-3 py-2 rounded hover:bg-[#00a651] hover:text-white transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,166,81,0.5)]"
                  >
                    Ranking
                  </Link>
                  {user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      className="px-3 py-2 rounded bg-gradient-to-r from-[#ff6b35] to-[#d64520] text-white hover:from-[#ff8555] hover:to-[#ff6b35] transition-all duration-300 shadow-lg"
                    >
                      Admin
                    </Link>
                  )}
                  <span className="text-[#00a651] text-lg">|</span>
                  <span className="text-[#ffd700] font-bold">{user.name}</span>
                  <Link
                    href="/trocar-senha"
                    className="rounded border-2 border-[#00a651] px-3 py-1 hover:bg-[#00a651] hover:text-white transition-all duration-300"
                  >
                    Trocar Senha
                  </Link>
                  <LogoutButton />
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-3 py-2 rounded hover:bg-[#00a651] hover:text-white transition-all duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-3 py-2 rounded bg-gradient-to-r from-[#ff6b35] to-[#d64520] text-white hover:from-[#ff8555] hover:to-[#ff6b35] transition-all duration-300 shadow-lg"
                  >
                    Cadastro
                  </Link>
                </>
              )}
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-6xl p-6 relative z-10">{children}</main>

        {/* Footer NFL Style */}
        <footer className="mt-12 border-t-4 border-[#00a651] bg-[#0a1929] py-6 text-center text-sm text-gray-400">
          <p
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            className="text-lg tracking-wider"
          >
            <span className="text-[#ffd700]">NFL Bolão</span> © 2026
          </p>
          <p className="mt-2">Faça suas apostas e torça pelo seu time! 🏈</p>
        </footer>
      </body>
    </html>
  );
}
