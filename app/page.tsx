import Link from "next/link";
import { getUserFromSession } from "@/src/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getUserFromSession();
  if (user) redirect("/rodadas");

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center space-y-8 animate-slide-in">
        <div className="space-y-4">
          <h1
            className="text-7xl font-bold tracking-wider uppercase mb-4"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            <span className="bg-gradient-to-r from-[#ffd700] via-[#ff6b35] to-[#ffd700] bg-clip-text text-transparent drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
              🏈 Bolão NFL
            </span>
          </h1>
          <p
            className="text-3xl font-bold tracking-wide uppercase text-[#00a651]"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Playoffs 2026
          </p>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mt-4">
            Faça seus palpites nos jogos da NFL e dispute o ranking com seus
            amigos!
          </p>
        </div>

        <div className="flex gap-6 justify-center mt-8">
          <Link
            className="rounded-lg bg-gradient-to-r from-[#ff6b35] to-[#d64520] px-8 py-4 text-white font-bold text-xl uppercase tracking-wide hover:from-[#ff8555] hover:to-[#ff6b35] transition-all duration-300 shadow-[0_4px_15px_rgba(255,107,53,0.4)] hover:shadow-[0_6px_20px_rgba(255,107,53,0.6)] hover:-translate-y-1 border-2 border-white/20"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            href="/login"
          >
            🔐 Login
          </Link>
          <Link
            className="rounded-lg border-4 border-[#00a651] px-8 py-4 text-[#00a651] font-bold text-xl uppercase tracking-wide hover:bg-[#00a651] hover:text-white transition-all duration-300 shadow-[0_4px_15px_rgba(0,166,81,0.3)] hover:shadow-[0_6px_20px_rgba(0,166,81,0.5)] hover:-translate-y-1"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            href="/register"
          >
            📝 Cadastro
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="bg-gradient-to-b from-[#1a2f3f]/80 to-[#0a1929]/80 p-6 rounded-lg border-2 border-[#00a651]/30 hover:border-[#00a651] transition-all duration-300">
            <div className="text-4xl mb-2">🎯</div>
            <h3
              className="font-bold text-lg text-[#ffd700] uppercase tracking-wide mb-2"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Faça Palpites
            </h3>
            <p className="text-sm text-gray-300">
              Escolha os vencedores de cada jogo
            </p>
          </div>

          <div className="bg-gradient-to-b from-[#1a2f3f]/80 to-[#0a1929]/80 p-6 rounded-lg border-2 border-[#00a651]/30 hover:border-[#00a651] transition-all duration-300">
            <div className="text-4xl mb-2">🏆</div>
            <h3
              className="font-bold text-lg text-[#ffd700] uppercase tracking-wide mb-2"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Ganhe Pontos
            </h3>
            <p className="text-sm text-gray-300">Acerte e suba no ranking</p>
          </div>

          <div className="bg-gradient-to-b from-[#1a2f3f]/80 to-[#0a1929]/80 p-6 rounded-lg border-2 border-[#00a651]/30 hover:border-[#00a651] transition-all duration-300">
            <div className="text-4xl mb-2">👥</div>
            <h3
              className="font-bold text-lg text-[#ffd700] uppercase tracking-wide mb-2"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Dispute
            </h3>
            <p className="text-sm text-gray-300">Compita com seus amigos</p>
          </div>
        </div>
      </div>
    </div>
  );
}
