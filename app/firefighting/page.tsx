"use client";
import { ModuleShell, Field } from "@/components/module-shell";
import * as Eq from "@/lib/equations";

const fields: Field[] = [
  { key: "hazard", label: "Hazard classification", def: "light", opts: [{ v: "light", l: "Light" }, { v: "ord1", l: "Ordinary Group 1" }, { v: "ord2", l: "Ordinary Group 2" }, { v: "extra1", l: "Extra Group 1" }, { v: "extra2", l: "Extra Group 2" }] },
  { key: "sys", label: "System type", def: "spr", opts: [{ v: "spr", l: "Sprinkler (0.5 bar residual)" }, { v: "stand", l: "Standpipe (6.9 bar residual)" }] },
  { key: "cov", label: "Coverage per sprinkler", dim: "area", def: 12, min: 1 },
  { key: "len", label: "Equivalent pipe length", dim: "length", def: 120, min: 0 },
  { key: "dia", label: "Pipe internal diameter", dim: "mm", def: 100, min: 10 },
  { key: "c", label: "Hazen-Williams C", def: 120, min: 50, max: 160 },
  { key: "sh", label: "Static head", dim: "length", def: 15, min: 0 },
];

export default function Page() {
  return <ModuleShell title="Fire Fighting — Hydraulic Demand & Pump" fields={fields} run={(v) => Eq.fire(v)} />;
}
