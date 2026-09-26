"use client";
import { ModuleShell, Field } from "@/components/module-shell";
import * as Eq from "@/lib/equations";

const fields: Field[] = [
  { key: "shape", label: "Pool shape", def: "rect", opts: [{ v: "rect", l: "Rectangular (flat)" }, { v: "circ", l: "Circular" }, { v: "slope", l: "Constant slope" }, { v: "multi", l: "Multi-depth (spoon)" }] },
  { key: "cls", label: "Pool class", def: "public", opts: [{ v: "public", l: "Public (4–6 h)" }, { v: "kids", l: "Kids (1–2 h)" }, { v: "olympic", l: "Training/Olympic (6–8 h)" }] },
  { key: "sys", label: "Circulation system", def: "skimmer", opts: [{ v: "skimmer", l: "Skimmer" }, { v: "overflow", l: "Overflow / gutter" }] },
  { key: "l", label: "Length", dim: "length", def: 25, min: 0.1 },
  { key: "w", label: "Width / diameter", dim: "length", def: 12.5, min: 0.1 },
  { key: "ds", label: "Shallow depth", dim: "length", def: 1, min: 0.1 },
  { key: "dd", label: "Deep depth", dim: "length", def: 2, min: 0.1 },
  { key: "lf", label: "Flat shallow length", dim: "length", def: 6, min: 0 },
  { key: "ls", label: "Slope length", dim: "length", def: 9, min: 0 },
  { key: "media", label: "Filter media", def: "sand", opts: [{ v: "sand", l: "High-rate sand (37 m³/h/m²)" }, { v: "de", l: "Diatomaceous earth (4.9 m³/h/m²)" }, { v: "cart", l: "Cartridge (0.9 m³/h/m²)" }] },
  { key: "fa", label: "Area per filter", dim: "area", def: 2, min: 0.1 },
  { key: "pipe", label: "Pipework loss", dim: "length", def: 6, min: 0 },
  { key: "skim", label: "Skimmer/gutter loss", dim: "length", def: 1, min: 0 },
  { key: "surge", label: "Balance tank/surge loss (overflow)", dim: "length", def: 1.5, min: 0 },
  { key: "hx", label: "Heat exchanger loss", dim: "length", def: 1.5, min: 0 },
  { key: "fc", label: "Filter ΔP clean", dim: "bar", def: 0.35, min: 0 },
  { key: "fd", label: "Filter ΔP dirty", dim: "bar", def: 0.85, min: 0 },
  { key: "eff", label: "Pump efficiency", def: 0.65, min: 0.1, max: 1 },
  { key: "sf", label: "Motor service factor", def: 1.15, min: 1, max: 2 },
  { key: "baro", label: "Barometric head (atm.)", dim: "length", def: 10.3, min: 0 },
  { key: "vapor", label: "Vapor pressure head", dim: "length", def: 0.3, min: 0 },
  { key: "ssuction", label: "Static suction lift", dim: "length", def: 1, min: 0 },
  { key: "sloss", label: "Suction line friction loss", dim: "length", def: 0.5, min: 0 },
  { key: "bw", label: "Backwash duration (min)", def: 5, min: 1, max: 60 },
];

export default function Page() {
  return <ModuleShell title="Swimming Pools — Volume, Filtration & Pump" fields={fields} run={(v) => Eq.pool(v)} />;
}
