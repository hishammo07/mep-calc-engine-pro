"use client";
import { ModuleShell, Field } from "@/components/module-shell";
import * as I from "@/lib/equations-international";
import * as E from "@/lib/equations-egyptian";

const sys = [{ v: "valve", l: "Flush valve (flushometer)" }, { v: "tank", l: "Flush tank" }];

const fields: Field[] = [
  { key: "wc", label: "W.C.", def: [10, 10], min: 0, max: 5000 },
  { key: "lav", label: "Lavatories", def: [10, 10], min: 0, max: 5000 },
  { key: "shower", label: "Showers", def: [4, 4], min: 0, max: 5000 },
  { key: "sink", label: "Sinks", def: [4, 4], min: 0, max: 5000 },
  { key: "urinal", label: "Urinals", def: [4, 4], min: 0, max: 5000 },
  { key: "sys", label: "Flushing system (IPC)", def: [0, 0], opts: { INT: sys, ECP: [{ v: "n/a", l: "ECP 301 empirical formula" }] } },
  { key: "ppl", label: "Population", def: [100, 100], min: 1, max: 1000000 },
  { key: "lpcd", label: "Daily consumption per person", dim: "lpd", def: [50, 200], min: 1 },
  { key: "days", label: "Reserve days", def: [1, 1], min: 0.1, max: 30 },
  { key: "sh", label: "Booster static head", dim: "length", def: [60, 18], min: 0 },
  { key: "fr", label: "Booster friction loss", dim: "length", def: [15, 5], min: 0 },
  { key: "rp", label: "Residual pressure", dim: "pressure", def: [30, 2], min: 0 },
  { key: "slope", label: "Drain slope (%)", def: [2, 2], min: 0.1, max: 25 },
];

export default function Page() {
  return <ModuleShell title="Plumbing — Fixture Units, Demand & Drainage" fields={fields} run={(s, v) => (s === "INT" ? I : E).plumbing(v)} />;
}
