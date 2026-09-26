"use client";
import { ModuleShell, Field } from "@/components/module-shell";
import * as Eq from "@/lib/equations";

const fields: Field[] = [
  { key: "wc", label: "W.C.", def: 10, min: 0, max: 5000 },
  { key: "lav", label: "Lavatories", def: 10, min: 0, max: 5000 },
  { key: "shower", label: "Showers", def: 4, min: 0, max: 5000 },
  { key: "sink", label: "Sinks", def: 4, min: 0, max: 5000 },
  { key: "urinal", label: "Urinals", def: 4, min: 0, max: 5000 },
  { key: "ppl", label: "Population", def: 100, min: 1, max: 1000000 },
  { key: "lpcd", label: "Daily consumption per person", dim: "lpd", def: 200, min: 1 },
  { key: "days", label: "Reserve days", def: 1, min: 0.1, max: 30 },
  { key: "sh", label: "Booster static head", dim: "length", def: 18, min: 0 },
  { key: "fr", label: "Booster friction loss", dim: "length", def: 5, min: 0 },
  { key: "rp", label: "Residual pressure", dim: "bar", def: 2, min: 0 },
  { key: "slope", label: "Drain slope (%)", def: 2, min: 0.1, max: 25 },
];

export default function Page() {
  return <ModuleShell title="Plumbing — Fixture Units, Demand & Drainage" fields={fields} run={(v) => Eq.plumbing(v)} />;
}
