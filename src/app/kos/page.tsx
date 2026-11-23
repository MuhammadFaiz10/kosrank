import { SpkShell } from "@/components/spk/SpkShell";
import { SpkBerandaContent } from "@/components/spk/sections";

export default function KosModuleBerandaPage() {
  return (
    <SpkShell base="/kos" variant="publik">
      <SpkBerandaContent base="/kos" />
    </SpkShell>
  );
}
