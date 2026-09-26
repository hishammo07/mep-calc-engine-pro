"use client";
import { ModuleShell, Field } from "@/components/module-shell";
import * as I from "@/lib/equations-international";
import * as E from "@/lib/equations-egyptian";
import { num } from "@/lib/unit-converter";

const orient = { INT: [{ v: "1", l: "—" }], ECP: [{ v: "0.9", l: "North" }, { v: "1.05", l: "East" }, { v: "1", l: "South" }, { v: "1.1", l: "West" }] };

const fields: Field[] = [
  { key: "a", label: "Envelope area", dim: "area", def: [1000, 93], min: 0.1 },
  { key: "u", label: "U-value", dim: "u", def: [0.1, 0.57], min: 0.001 },
  { key: "cltd", label: "CLTD", dim: "dtemp", def: [40, 22], min: 0, max: 100 },
  { key: "lm", label: "Latitude/month correction (LM)", dim: "dtemp", def: [0, 0], min: -20, max: 20 },
  { key: "k", label: "Color/exposure factor (K)", def: [1, 1], min: 0.1, max: 2 },
  { key: "orient", label: "Orientation factor (ECP)", def: [1, 1], only: "ECP", opts: orient },
  { key: "tr", label: "Room temperature", dim: "temp", def: [75, 24], min: -20, max: 120 },
  { key: "to", label: "Outdoor design temperature", dim: "temp", def: [105, 41], min: -20, max: 140 },
  { key: "dr", label: "Outdoor daily range", dim: "dtemp", def: [20, 11], min: 0, max: 60 },
  { key: "ts", label: "Supply air temperature", dim: "temp", def: [55, 13], min: -20, max: 120 },
  { key: "vent", label: "Ventilation air", dim: "airflow", def: [500, 236], min: 0 },
  { key: "dw", label: "ΔW humidity ratio (lb/lb · kg/kg)", def: [0.008, 0.008], min: 0, max: 0.05 },
  { key: "ppl", label: "Occupants", def: [20, 20], min: 0, max: 100000 },
  { key: "ps", label: "Sensible per person", dim: "heat", def: [250, 73], min: 0 },
  { key: "pl", label: "Latent per person", dim: "heat", def: [200, 59], min: 0 },
  { key: "fa", label: "Floor area", dim: "area", def: [2000, 186], min: 0.1 },
  { key: "lpd", label: "Lighting power density", dim: "lightDensity", def: [1.2, 13], min: 0 },
  { key: "bal", label: "Ballast factor", def: [1.2, 1.2], min: 1, max: 2 },
  { key: "eq", label: "Equipment power", dim: "watt", def: [2000, 2000], min: 0 },
  { key: "use", label: "Usage factor", def: [0.8, 0.8], min: 0, max: 1 },
  { key: "fr", label: "Duct friction rate", dim: "fric", def: [0.08, 0.65], min: 0.001, max: 100 },
];

export default function Page() {
  return (
    <ModuleShell
      title="HVAC — Cooling Load & Duct Sizing"
      fields={fields}
      run={(s, v) => (s === "INT" ? I : E).hvac(v)}
      check={(s, v) => (num(v, "tr") - num(v, "ts") <= 0 ? "Supply air temperature must be below room temperature." : null)}
    />
  );
}
