import { SpkShell } from "@/components/spk/SpkShell";
import { SpkBackLink, SpkSubKriteriaSection } from "@/components/spk/sections";

export const dynamic = "force-dynamic";

export default function AppKosModuleSubKriteriaPage() {
  return (
    <SpkShell base="/app/kos" variant="auth">
      <div className="space-y-4">
        <SpkBackLink base="/app/kos" />
        <h1 className="font-display text-[22px] font-bold tracking-[-0.02em]">Sub Kriteria</h1>
        <SpkSubKriteriaSection />
      </div>
    </SpkShell>
  );
}
