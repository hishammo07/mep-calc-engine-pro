export type V = Record<string, number | string>;
export type Result = { label: string; value: number; unit: string; clause: string };
export type Dim =
  | "none" | "watt" | "kw" | "length" | "mm" | "area" | "temp" | "dtemp"
  | "pressure" | "bar" | "airflow" | "flow_m3h" | "flow_ls" | "heat"
  | "lpd" | "u" | "lightDensity" | "fric" | "rpm" | "percent" | "hours" | "minutes";

const LABEL: Record<Dim, string> = {
  none: "",
  watt: "W",
  kw: "kW",
  length: "m",
  mm: "mm",
  area: "m²",
  temp: "°C",
  dtemp: "°C",
  pressure: "bar",
  bar: "bar",
  airflow: "L/s",
  flow_m3h: "m³/h",
  flow_ls: "L/s",
  heat: "W",
  lpd: "L/p/d",
  u: "W/m²·K",
  lightDensity: "W/m²",
  fric: "Pa/m",
  rpm: "rpm",
  percent: "%",
  hours: "h",
  minutes: "min",
};

export const unitLabel = (d: Dim) => LABEL[d];
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

export const ductFrictionPaPerM = (q: number, d: number) => {
  const v = q / ((Math.PI * d * d) / 4);
  const re = (RHO * v * d) / MU;
  const lam = 0.11 * Math.pow(EPS / d + 68 / re, 0.25);
  return lam * (1 / d) * (RHO * v * v) / 2;
};

export const ductDiameterM = (q: number, fric: number) => bisect((d) => ductFrictionPaPerM(q, d) - fric, 0.03, 4);

export const manningFull = (d: number, s: number, n: number) => (1 / n) * ((Math.PI * d * d) / 4) * Math.pow(d / 4, 2 / 3) * Math.sqrt(s);
