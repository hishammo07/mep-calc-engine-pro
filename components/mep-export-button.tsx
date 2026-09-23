"use client";
import { Printer } from "lucide-react";

export function MepExportButton({ title }: { title: string }) {
  return (
    <button
      onClick={() => {
        const t = document.title;
        document.title = `${title} — CES`;
        window.print();
        document.title = t;
      }}
      className="no-print flex items-center gap-2 rounded-md bg-[#f5a623] px-4 py-2 text-sm font-semibold text-[#0a1628] hover:brightness-110"
    >
      <Printer size={16} />
      Export submission sheet
    </button>
  );
}
