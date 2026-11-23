import { SpkShell } from "@/components/spk/SpkShell";
import { SpkBackLink, SpkBobotSection } from "@/components/spk/sections";

// Bobot bisa diubah kapan pun dari halaman ini
export const dynamic = "force-dynamic";

export default function AppKosModuleBobotPage() {
  return (
    <SpkShell base="/app/kos" variant="auth">
      <div className="space-y-4">
        <SpkBackLink base="/app/kos" />
        <h1 className="font-display text-[22px] font-bold tracking-[-0.02em]">Bobot Tiap Kriteria</h1>
        <SpkBobotSection />
      </div>
    </SpkShell>
  );
}
