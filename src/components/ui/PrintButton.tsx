"use client";

import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export function PrintButton() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Button onClick={handlePrint} className="flex items-center gap-2 rounded-xl h-10 px-5 shadow-md">
      <Printer className="w-4 h-4" /> Cetak Laporan
    </Button>
  );
}
