"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import type { Std } from "@/lib/unit-converter";

const Ctx = createContext<{ std: Std; setStd: (s: Std) => void }>({ std: "INT", setStd: () => {} });
export const useStandard = () => useContext(Ctx);

export function StandardProvider({ children }: { children: ReactNode }) {
  const [std, setStd] = useState<Std>("INT");
  return <Ctx.Provider value={{ std, setStd }}>{children}</Ctx.Provider>;
}

export function StandardToggle() {
  const { std, setStd } = useStandard();
  const b = (s: Std, l: string) => (
    <button
      onClick={() => setStd(s)}
      className={`flex-1 px-3 py-2 text-sm font-semibold transition ${std === s ? "bg-[#f5a623] text-[#0a1628]" : "bg-[#111f38] text-[#9fb2d1] hover:text-white"}`}
    >
      {l}
    </button>
  );
  return (
    <div className="no-print flex overflow-hidden rounded-md border border-[#f5a623]/60">
      {b("INT", "International Codes")}
      {b("ECP", "Egyptian Code (ECP)")}
    </div>
  );
}
