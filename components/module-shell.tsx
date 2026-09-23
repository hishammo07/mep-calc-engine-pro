"use client";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { Info } from "lucide-react";
import { Dim, Result, Std, V } from "@/lib/unit-converter";
import { StandardToggle, useStandard } from "./standard-provider";
import { MepUnitInput } from "./mep-unit-input";
import { MepExportButton } from "./mep-export-button";

export type Field = {
  key: string;
  label: string;
  dim?: Dim;
  def: [number, number];
  min?: number;
  max?: number;
  opts?: Record<Std, { v: string; l: string }[]>;
  only?: Std;
};

const build = (fields: Field[]) =>
  z.object(
    Object.fromEntries(
      fields.map((f) => [
        f.key,
        f.opts
          ? z.string().min(1)
          : z.number({ invalid_type_error: `${f.label} is required`, required_error: `${f.label} is required` }).finite().min(f.min ?? 0, `Minimum ${f.min ?? 0}`).max(f.max ?? 1e9, `Maximum ${f.max ?? 1e9}`),
      ])
    )
  );

export function ModuleShell({ title, fields, run, check }: { title: string; fields: Field[]; run: (s: Std, v: V) => Result[]; check?: (s: Std, v: V) => string | null }) {
  const { std } = useStandard();
  const active = useMemo(() => fields.filter((f) => !f.only || f.only === std), [fields, std]);
  const init = (s: Std): V => Object.fromEntries(fields.map((f) => [f.key, f.opts ? f.opts[s][0].v : f.def[s === "INT" ? 0 : 1]]));
  const [v, setV] = useState<V>(() => init("INT"));
  useEffect(() => setV(init(std)), [std]);
  const parsed = useMemo(() => build(active).safeParse(Object.fromEntries(active.map((f) => [f.key, v[f.key]]))), [active, v]);
  const errs: Record<string, string> = {};
  if (!parsed.success) parsed.error.issues.forEach((i) => (errs[String(i.path[0])] = i.message));
  const cross = parsed.success && check ? check(std, { ...v, ...(parsed.data as V) }) : null;
  const results = parsed.success && !cross ? run(std, { ...v, ...(parsed.data as V) }) : [];
  const fmt = (n: number) => (Number.isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: 2 }) : "—");

  return (
    <div className="flex flex-col gap-6">
      <div className="hidden print:block text-black">
        <div className="text-xl font-bold">{title}</div>
        <div>Design standard: {std === "INT" ? "International Codes (Imperial)" : "Egyptian Code ECP (Metric)"} — Eng. Hesham Mohamed — CES</div>
      </div>
      <header className="no-print flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        <div className="flex items-center gap-3">
          <div className="w-80">
            <StandardToggle />
          </div>
          <MepExportButton title={title} />
        </div>
      </header>
      <section className="print-card grid grid-cols-1 gap-4 rounded-lg border border-[#1e3357] bg-[#111f38] p-5 sm:grid-cols-2 xl:grid-cols-3">
        {active.map((f) =>
          f.opts ? (
            <label key={f.key} className="flex flex-col gap-1 text-xs text-[#9fb2d1]">
              {f.label}
              <select value={String(v[f.key])} onChange={(e) => setV({ ...v, [f.key]: e.target.value })} className="rounded-md border border-[#1e3357] bg-[#0d1a30] px-3 py-2 text-sm text-white outline-none focus:border-[#f5a623]">
                {f.opts![std].map((o) => (
                  <option key={o.v} value={o.v}>
                    {o.l}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <MepUnitInput key={f.key} label={f.label} dim={f.dim ?? "none"} value={Number(v[f.key])} onChange={(n) => setV({ ...v, [f.key]: n })} error={errs[f.key]} />
          )
        )}
      </section>
      {cross && <div className="rounded-md border border-red-500/60 bg-red-500/10 p-3 text-sm text-red-300">{cross}</div>}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {results.map((r) => (
          <div key={r.label} className="print-card group relative rounded-lg border border-[#1e3357] bg-[#111f38] p-4">
            <div className="flex items-center justify-between text-xs text-[#9fb2d1]">
              {r.label}
              <span className="relative cursor-help text-[#f5a623]">
                <Info size={14} />
                <span className="pointer-events-none absolute right-0 top-5 z-10 hidden w-64 rounded-md border border-[#f5a623]/50 bg-[#08111f] p-2 text-[11px] leading-snug text-[#e6edf7] group-hover:block">{r.clause}</span>
              </span>
            </div>
            <div className="mt-2 text-2xl font-semibold text-white">
              {fmt(r.value)} <span className="text-sm text-[#f5a623]">{r.unit}</span>
            </div>
            <div className="mt-2 hidden text-[10px] print:block">{r.clause}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
