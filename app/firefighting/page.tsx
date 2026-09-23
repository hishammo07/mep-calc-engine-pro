"use client";
import { ModuleShell, Field } from "@/components/module-shell";
import * as I from "@/lib/equations-international";
import * as E from "@/lib/equations-egyptian";

const hz = [{ v: "light", l: "Light" }, { v: "ord1", l: "Ordinary Group 1" }, { v: "ord2", l: "Ordinary Group 2" }, { v: "extra1", l: "Extra Group 1" }, { v: "extra2", l: "Extra Group 2" }];
const sys = [{ v: "spr", l: "Sprinkler (7 psi / 0.5 bar residual)" }, { v: "stand", l: "Standpipe (100 psi / 6.9 bar residual)" }];

const fields: Field[] = [
  { key: "hazard", label: "Hazard classification", def: [0, 0], opts: { INT: hz, ECP: hz } },
  { key: "sys", label: "System type", def: [0, 0], opts: { INT: sys, ECP: sys } },
  { key: "cov", label: "Coverage per sprinkler", dim: "area", def: [130, 12], min: 1 },
  { key: "len", label: "Equivalent pipe length", dim: "length", def: [400, 120], min: 0 },
  { key: "dia", label: "Pipe internal diameter", dim: "diam", def: [4, 100], min: 0.5 },
  { key: "c", label: "Hazen-Williams C", def: [120, 120], min: 50, max: 160 },
  { key: "sh", label: "Static head", dim: "length", def: [50, 15], min: 0 },
];

export default function Page() {
  return <ModuleShell title="Fire Fighting — Hydraulic Demand & Pump" fields={fields} run={(s, v) => (s === "INT" ? I : E).fire(v)} />;
}
