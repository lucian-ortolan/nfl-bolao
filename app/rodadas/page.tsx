import RoundsList from "@/src/components/RoundsList";

export default function RodadasPage() {
  return (
    <div className="space-y-6 animate-slide-in">
      <div className="text-center">
        <h1
          className="text-6xl font-bold tracking-wider uppercase mb-2"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          <span className="bg-gradient-to-r from-[#ffd700] via-[#ff6b35] to-[#ffd700] bg-clip-text text-transparent drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
            🏈 Rodadas
          </span>
        </h1>
        <p
          className="text-xl text-[#00a651] font-bold uppercase tracking-wide"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          Escolha a Rodada e Faça seus Palpites
        </p>
      </div>
      <RoundsList />
    </div>
  );
}
