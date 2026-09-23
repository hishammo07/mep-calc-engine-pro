"use client";
import Link from "next/link";
import { useStandard, StandardToggle } from "@/components/standard-provider";

const mods = [
  { href: "/hvac", name: "HVAC", INT: "ASHRAE Fundamentals / Carrier CLTD", ECP: "ECP 401", out: "Cooling load, supply airflow, duct sizing" },
  { href: "/firefighting", name: "Fire Fighting", INT: "NFPA 13 / NFPA 14 / NFPA 20", ECP: "ECP 501", out: "Demand, pump head, tank volume, sprinkler pressure" },
  { href: "/plumbing", name: "Plumbing", INT: "IPC / ASPE Hunter's curve", ECP: "ECP 301", out: "Fixture units, peak flow, tank, booster, drainage" },
  { href: "/pools", name: "Swimming Pools", INT: "ISPSC", ECP: "ECP Sports Code", out: "Volume, turnover flow, filters, pump, backwash" },
];

export default function Page() {
  const { std } = useStandard();
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">MEP-Calc Engine Pro</h1>
        <div className="w-80">
          <StandardToggle />
        </div>
      </header>
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {mods.map((m) => (
          <Link key={m.href} href={m.href} className="rounded-lg border border-[#1e3357] bg-[#111f38] p-5 hover:border-[#f5a623]">
            <div className="text-lg font-semibold text-white">{m.name}</div>
            <div className="mt-1 text-sm text-[#f5a623]">{m[std]}</div>
            <div className="mt-2 text-sm text-[#9fb2d1]">{m.out}</div>
          </Link>
        ))}
      </section>
      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[["Active standard", std === "INT" ? "International" : "ECP"], ["Unit system", std === "INT" ? "Imperial" : "Metric"], ["Modules online", "4"], ["Input validation", "Zod"]].map(([k, val]) => (
          <div key={k} className="rounded-lg border border-[#1e3357] bg-[#111f38] p-4">
            <div className="text-xs text-[#9fb2d1]">{k}</div>
            <div className="text-xl font-semibold text-[#f5a623]">{val}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
