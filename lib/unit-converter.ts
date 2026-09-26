export type Std = "INT" | "ECP";
export type V = Record<string, number | string>;
export type Result = { label: string; value: number; unit: string; clause: string };
export type Dim = "none" | "watt" | "length" | "area" | "temp" | "dtemp" | "pressure" | "airflow" | "heat" | "lpd" | "u" | "lightDensity" | "fric" | "diam";
export type FrictionModel = "darcy" | "altshul";

const T: Record<Dim, [string, string, number, number]> = {
  none: ["", "", 1, 0],
  watt: ["W", "W", 1, 0],
  length: ["ft", "m", 0.3048, 0],
  area: ["ft²", "m²", 0.09290304, 0],
  temp: ["°F", "°C", 5 / 9, -160 / 9],
  dtemp: ["°F", "°C", 5 / 9, 0],
  pressure: ["psi", "bar", 0.0689476, 0],
  airflow: ["CFM", "L/s", 0.4719474, 0],
  heat: ["Btu/h", "W", 0.29307107, 0],
  lpd: ["gal/p/d", "L/p/d", 3.785411784, 0],
  u: ["Btu/h·ft²·°F", "W/m²·K", 5.678263, 0],
  lightDensity: ["W/ft²", "W/m²", 10.7639104, 0],
  fric: ["in.wg/100ft", "Pa/m", 8.17246, 0],
  diam: ["in", "mm", 25.4, 0],
};

export const unitLabel = (d: Dim, s: Std) => T[d][s === "INT" ? 0 : 1];
export const toMetric = (d: Dim, v: number) => v * T[d][2] + T[d][3];
export const toImperial = (d: Dim, v: number) => (v - T[d][3]) / T[d][2];
export const convert = (d: Dim, v: number, from: Std, to: Std) => (from === to ? v : from === "INT" ? toMetric(d, v) : toImperial(d, v));
export const round = (v: number, p = 2) => {
  const k = 10 ** p;
  return Math.round((v + Number.EPSILON) * k) / k;
};
export const num = (v: V, k: string) => Number(v[k]);
export const mk = (label: string, value: number, unit: string, clause: string): Result => ({ label, value: round(value), unit, clause });

export const bisect = (f: (x: number) => number, lo: number, hi: number, it = 60) => {
  for (let i = 0; i < it; i++) {
    const m = (lo + hi) / 2;
    if (f(m) > 0) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
};

const RHO = 1.2;
const MU = 1.81e-5;
const EPS = 9e-5;

export const ductFrictionPaPerM = (q: number, d: number, m: FrictionModel) => {
  const v = q / ((Math.PI * d * d) / 4);
  const re = (RHO * v * d) / MU;
  const lam = m === "darcy" ? 0.25 / Math.pow(Math.log10(EPS / (3.7 * d) + 5.74 / Math.pow(re, 0.9)), 2) : 0.11 * Math.pow(EPS / d + 68 / re, 0.25);
  return lam * (1 / d) * (RHO * v * v) / 2;
};

export const ductDiameterM = (q: number, fric: number, m: FrictionModel) => bisect((d) => ductFrictionPaPerM(q, d, m) - fric, 0.03, 4);

export const manningFull = (d: number, s: number, n: number) => (1 / n) * ((Math.PI * d * d) / 4) * Math.pow(d / 4, 2 / 3) * Math.sqrt(s);

export const interp = (t: number[][], x: number) => {
  if (x <= t[0][0]) return t[0][1];
  for (let i = 1; i < t.length; i++) {
    if (x <= t[i][0]) return t[i - 1][1] + ((x - t[i - 1][0]) * (t[i][1] - t[i - 1][1])) / (t[i][0] - t[i - 1][0]);
  }
  const a = t[t.length - 2];
  const b = t[t.length - 1];
  return b[1] + ((x - b[0]) * (b[1] - a[1])) / (b[0] - a[0]);
};
