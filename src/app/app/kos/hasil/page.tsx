import { SpkShell } from "@/components/spk/SpkShell";
import { SpkBackLink, SpkHasilSection } from "@/components/spk/sections";

export default async function AppKosModuleHasilPage({
  searchParams,
}: {
  searchParams: Promise<{ tipe?: string }>;
}) {
  const { tipe } = await searchParams;

  return (
    <SpkShell base="/app/kos" variant="auth">
      <div className="space-y-4">
        <SpkBackLink base="/app/kos" />
        <h1 className="font-display text-[22px] font-bold tracking-[-0.02em]">Hasil Perangkingan</h1>
        <SpkHasilSection base="/app/kos" tipe={tipe} />
      </div>
    </SpkShell>
  );
}
