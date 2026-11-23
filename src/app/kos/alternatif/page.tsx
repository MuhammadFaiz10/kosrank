import { SpkShell } from "@/components/spk/SpkShell";
import { SpkBackLink, SpkAlternatifSection } from "@/components/spk/sections";

// Data live: daftar alternatif berubah lewat CRUD
export const dynamic = "force-dynamic";

export default function KosModuleAlternatifPage() {
  return (
    <SpkShell base="/kos" variant="publik">
      <div className="space-y-4">
        <SpkBackLink base="/kos" />
        <h1 className="font-display text-[22px] font-bold tracking-[-0.02em]">Alternatif Pilihan</h1>
        <SpkAlternatifSection />
      </div>
    </SpkShell>
  );
}
