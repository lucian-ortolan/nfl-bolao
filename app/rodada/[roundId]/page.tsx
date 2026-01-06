import RoundPicks from "@/src/components/RoundPicks";

export default async function RodadaPage({
  params,
}: {
  params: Promise<{ roundId: string }>;
}) {
  const { roundId } = await params;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Palpites</h1>
      <RoundPicks roundId={roundId} />
    </div>
  );
}
