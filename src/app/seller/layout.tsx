import { SellerSidebar } from "@/components/layout/SellerSidebar";

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <SellerSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
