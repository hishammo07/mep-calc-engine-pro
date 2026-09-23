"use client";
import { ModuleShell, Field } from "@/components/module-shell";
import * as I from "@/lib/equations-international";
import * as E from "@/lib/equations-egyptian";

const shape = [{ v: "rect", l: "Rectangular (flat)" }, { v: "circ", l: "Circular" }, { v: "slope", l: "Constant slope" }, { v: "multi", l: "Multi-depth (spoon)" }];
const media = [{ v: "sand", l: "High-rate sand" }, { v: "de", l: "Diatomaceous earth" }, { v: "cart", l: "Cartridge" }];

const fields: Field[] = [
  { key: "shape", label: "Pool shape", def: [0, 0], opts: { INT: shape, ECP: shape } },
  { key: "cls", label: "Pool class", def: [0, 0], opts: { INT: [{ v: "public", l: "Public (6 h)" }, { v: "semi", l: "Semi-public (8 h)" }], ECP: [{ v: "public", l: "Public (4–6 h)" }, { v: "kids", l: "Kids (1–2 h)" }, { v: "olympic", l: "Training/Olympic (6–8 h)" }] } },
  { key: "l", label: "Length", dim: "length", def: [82, 25], min: 0.1 },
  { key: "w", label: "Width / diameter", dim: "length", def: [40, 12.5], min: 0.1 },
  { key: "ds", label: "Shallow depth", dim: "length", def: [3.3, 1], min: 0.1 },
  { key: "dd", label: "Deep depth", dim: "length", def: [6.5, 2], min: 0.1 },
  { key: "lf", label: "Flat shallow length", dim: "length", def: [20, 6], min: 0 },
  { key: "ls", label: "Slope length", dim: "length", def: [30, 9], min: 0 },
  { key: "media", label: "Filter media", def: [0, 0], opts: { INT: media, ECP: media } },
  { key: "fa", label: "Area per filter", dim: "area", def: [20, 2], min: 0.1 },
  { key: "pipe", label: "Pipework loss", dim: "length", def: [20, 6], min: 0 },
  { key: "skim", label: "Skimmer/gutter loss", dim: "length", def: [3, 1], min: 0 },
  { key: "hx", label: "Heat exchanger loss", dim: "length", def: [5, 1.5], min: 0 },
  { key: "fc", label: "Filter ΔP clean", dim: "pressure", def: [5, 0.35], min: 0 },
  { key: "fd", label: "Filter ΔP dirty", dim: "pressure", def: [12, 0.85], min: 0 },
  { key: "eff", label: "Pump efficiency", def: [0.65, 0.65], min: 0.1, max: 1 },
  { key: "bw", label: "Backwash duration (min)", def: [5, 5], min: 1, max: 60 },
];

export default function Page() {
  return <ModuleShell title="Swimming Pools — Volume, Filtration & Pump" fields={fields} run={(s, v) => (s === "INT" ? I : E).pool(v)} />;
}
