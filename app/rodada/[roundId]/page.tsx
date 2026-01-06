import RoundPicks from "@/src/components/RoundPicks";

export default function RodadaPage({
  params,
}: {
  params: { roundId: string };
}) {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Palpites</h1>
      <RoundPicks roundId={params.roundId} />
    </div>
  );
}
