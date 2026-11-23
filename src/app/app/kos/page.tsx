import { SpkShell } from "@/components/spk/SpkShell";
import { SpkBerandaContent } from "@/components/spk/sections";

export default function AppKosModuleBerandaPage() {
  return (
    <SpkShell base="/app/kos" variant="auth">
      <SpkBerandaContent base="/app/kos" />
    </SpkShell>
  );
}
