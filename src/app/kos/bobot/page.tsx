import { SpkShell } from "@/components/spk/SpkShell";
import { SpkBackLink, SpkBobotSection } from "@/components/spk/sections";
import { DataActions } from "@/components/spk/DataActions";

// Bobot bisa diubah kapan pun dari halaman ini
export const dynamic = "force-dynamic";

export default function KosModuleBobotPage() {
  return (
    <SpkShell base="/kos" variant="publik">
      <div className="space-y-4">
        <SpkBackLink base="/kos" />
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <h1 className="font-display text-[22px] font-bold tracking-[-0.02em]">Bobot Tiap Kriteria</h1>
          <DataActions bobot />
        </div>
        <SpkBobotSection />
      </div>
    </SpkShell>
  );
}
