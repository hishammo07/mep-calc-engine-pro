import Link from "next/link";

const mods = [
  { href: "/hvac", name: "HVAC", ref: "ECP 401", out: "Cooling load, supply airflow, duct sizing" },
  { href: "/firefighting", name: "Fire Fighting", ref: "ECP 501", out: "Demand, pump head, tank volume, sprinkler pressure" },
  { href: "/plumbing", name: "Plumbing", ref: "ECP 301", out: "Fixture units, peak flow, tank, booster, drainage" },
  { href: "/pools", name: "Swimming Pools", ref: "ECP Sports Code", out: "Volume, turnover flow, filters, pump head, NPSHa, motor sizing" },
];

export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-white">MEP-Calc Engine Pro</h1>
      </header>
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {mods.map((m) => (
          <Link key={m.href} href={m.href} className="rounded-lg border border-[#1e3357] bg-[#111f38] p-5 hover:border-[#f5a623]">
            <div className="text-lg font-semibold text-white">{m.name}</div>
            <div className="mt-1 text-sm text-[#f5a623]">{m.ref}</div>
            <div className="mt-2 text-sm text-[#9fb2d1]">{m.out}</div>
          </Link>
        ))}
      </section>
      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[["Unit system", "Metric"], ["Governing code", "ECP"], ["Modules online", "4"], ["Input validation", "Zod"]].map(([k, val]) => (
          <div key={k} className="rounded-lg border border-[#1e3357] bg-[#111f38] p-4">
            <div className="text-xs text-[#9fb2d1]">{k}</div>
            <div className="text-xl font-semibold text-[#f5a623]">{val}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
