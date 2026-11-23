import { SpkShell } from "@/components/spk/SpkShell";
import { SpkBackLink, SpkKriteriaSection } from "@/components/spk/sections";
import { DataActions } from "@/components/spk/DataActions";

export const dynamic = "force-dynamic";

export default function KosModuleKriteriaPage() {
  return (
    <SpkShell base="/kos" variant="publik">
      <div className="space-y-4">
        <SpkBackLink base="/kos" />
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <h1 className="font-display text-[22px] font-bold tracking-[-0.02em]">Kriteria</h1>
          <DataActions kriteria pulihkan />
        </div>
        <SpkKriteriaSection />
      </div>
    </SpkShell>
  );
}
