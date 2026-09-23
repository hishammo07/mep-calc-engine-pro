import { V, Result, num, mk, ductDiameterM, manningFull, ductFrictionPaPerM } from "./unit-converter";

export const cltdCorrected = (cltd: number, lm: number, k: number, tr: number, to: number, dr: number) => (cltd + lm) * k + (25.5 - tr) + (to - dr / 2 - 29.4);
export const conductionLoad = (u: number, a: number, cltdc: number, orient: number) => u * a * cltdc * orient;
export const ventSensible = (ls: number, dT: number) => 1.2 * ls * dT;
export const ventLatent = (ls: number, dW: number) => 3000 * ls * dW;
export const peopleLoad = (n: number, s: number, l: number) => ({ sensible: n * s, latent: n * l });
export const lightLoad = (wpm2: number, area: number, ballast: number) => wpm2 * area * ballast;
export const equipmentLoad = (w: number, use: number) => w * use;
export const supplyLs = (qs: number, tr: number, ts: number) => qs / (1.2 * (tr - ts));

const G = 40.746;
const GP = 3.785;
export const HAZARD: Record<string, { d: number; a: number; t: number; h: number }> = {
  light: { d: 0.1 * G, a: 139, t: 30, h: 100 * GP },
  ord1: { d: 0.15 * G, a: 139, t: 60, h: 250 * GP },
  ord2: { d: 0.2 * G, a: 139, t: 60, h: 250 * GP },
  extra1: { d: 0.3 * G, a: 232, t: 90, h: 500 * GP },
  extra2: { d: 0.4 * G, a: 232, t: 90, h: 500 * GP },
};
export const fireDemand = (density: number, area: number, hose: number) => density * area + hose;
export const hazenBarPerM = (qLmin: number, c: number, dMm: number) => (6.05e5 * Math.pow(qLmin, 1.85)) / (Math.pow(c, 1.85) * Math.pow(dMm, 4.87));
export const pumpTdhBar = (staticM: number, frictionBar: number, residualBar: number) => staticM * 0.0981 + frictionBar + residualBar;
export const tankM3 = (qLmin: number, minutes: number) => (qLmin * minutes) / 1000;
export const sprinklerPressureBar = (qLmin: number, k: number) => Math.pow(qLmin / k, 2);

const FU = { wc: 6, lav: 1, shower: 2, sink: 3, urinal: 3 };
export const peakFlowLs = (sumFu: number) => 0.25 * Math.sqrt(sumFu);
export const drainSizeMm = (qM3s: number, slope: number, n: number) => {
  const sizes = [50, 75, 100, 125, 150, 200, 250, 300];
  return sizes.find((s) => manningFull(s / 1000, slope, n) / 2 >= qM3s) ?? sizes[sizes.length - 1];
};

export const poolVolumeM3 = (shape: string, l: number, w: number, ds: number, dd: number, lf: number, ls: number) => {
  if (shape === "rect") return l * w * ds;
  if (shape === "circ") return (Math.PI * w * w * ds) / 4;
  if (shape === "slope") return (l * w * (ds + dd)) / 2;
  return w * (lf * ds + (ls * (ds + dd)) / 2 + Math.max(l - lf - ls, 0) * dd);
};
export const poolFlowM3h = (m3: number, hours: number) => m3 / hours;
export const filterAreaM2 = (q: number, rate: number) => q / rate;
export const pumpKw = (m3h: number, headM: number, eff: number) => (m3h * headM) / (367 * eff);
export const backwashM3 = (area: number, rate: number, minutes: number) => (area * rate * minutes) / 60;

export const hvac = (v: V): Result[] => {
  const tr = num(v, "tr");
  const to = num(v, "to");
  const ts = num(v, "ts");
  const cltdc = cltdCorrected(num(v, "cltd"), num(v, "lm"), num(v, "k"), tr, to, num(v, "dr"));
  const qc = conductionLoad(num(v, "u"), num(v, "a"), cltdc, num(v, "orient"));
  const qvs = ventSensible(num(v, "vent"), to - tr);
  const qvl = ventLatent(num(v, "vent"), num(v, "dw"));
  const p = peopleLoad(num(v, "ppl"), num(v, "ps"), num(v, "pl"));
  const ql = lightLoad(num(v, "lpd"), num(v, "fa"), num(v, "bal"));
  const qe = equipmentLoad(num(v, "eq"), num(v, "use"));
  const qs = qc + qvs + p.sensible + ql + qe;
  const qlat = qvl + p.latent;
  const ls = supplyLs(qs, tr, ts);
  const q = ls / 1000;
  const fr = num(v, "fr");
  const dia = (f: number) => ductDiameterM(q * f, fr, "altshul") * 1000;
  const d0 = dia(1) / 1000;
  return [
    mk("Conduction/radiation gain", qc, "W", "ECP 401 — CLTD method with latitude, daily range and orientation corrections"),
    mk("Ventilation sensible", qvs, "W", "ECP 401 — Q = 1.2·L/s·ΔT"),
    mk("Ventilation latent", qvl, "W", "ECP 401 — Q = 3000·L/s·ΔW"),
    mk("People (sensible + latent)", p.sensible + p.latent, "W", "ECP 401 — Occupant heat gain by activity"),
    mk("Lighting", ql, "W", "ECP 401 — Q = W/m²·A·ballast"),
    mk("Equipment", qe, "W", "ECP 401 — Q = W·usage factor"),
    mk("Total sensible", qs / 1000, "kW", "ECP 401 — Σ sensible gains"),
    mk("Total latent", qlat / 1000, "kW", "ECP 401 — Σ latent gains"),
    mk("Total cooling load", (qs + qlat) / 1000, "kW", "ECP 401 — Sensible + latent"),
    mk("Supply airflow", ls * 3.6, "m³/h", "ECP 401 — L/s = Qs / (1.2·(Tr−Ts))"),
    mk("Fresh air intake", num(v, "vent") * 3.6, "m³/h", "ECP 401 — Ventilation requirement"),
    mk("Duct Ø trunk (100%)", dia(1), "mm", "ECP 401 — Equal friction, Altshul formula"),
    mk("Duct Ø main (60%)", dia(0.6), "mm", "ECP 401 — Equal friction, Altshul formula"),
    mk("Duct Ø branch (30%)", dia(0.3), "mm", "ECP 401 — Equal friction, Altshul formula"),
    mk("Trunk velocity", q / ((Math.PI * d0 * d0) / 4), "m/s", "ECP 401 — Duct design"),
    mk("Pressure drop", ductFrictionPaPerM(q, d0, "altshul") * 100, "Pa/100 m", "ECP 401 — λ = 0.11·(Δ/D + 68/Re)^0.25"),
  ];
};

export const fire = (v: V): Result[] => {
  const h = HAZARD[String(v.hazard)];
  const q = fireDemand(h.d, h.a, h.h);
  const res = v.sys === "stand" ? 6.9 : 0.5;
  const fr = hazenBarPerM(q, num(v, "c"), num(v, "dia")) * num(v, "len");
  const tdh = pumpTdhBar(num(v, "sh"), fr, res);
  const qs = h.d * num(v, "cov");
  return [
    mk("Design density", h.d, "L/min/m²", "ECP 501 — Hazard density"),
    mk("Remote area", h.a, "m²", "ECP 501 — Remote area (139 m² / 232 m²)"),
    mk("Hose stream allowance", h.h, "L/min", "ECP 501 — Hose stream demand"),
    mk("Total demand Q", q, "L/min", "ECP 501 — Q = density·area + hose"),
    mk("Friction loss", fr, "bar", "ECP 501 — Hazen-Williams: p = 6.05·10⁵·Q^1.85 / (C^1.85·d^4.87)"),
    mk("Fire pump flow", q / 60, "L/s", "ECP 501 — Pump rated flow"),
    mk("Fire pump head (TDH)", tdh, "bar", "ECP 501 — TDH = static + friction + residual"),
    mk("Fire water tank", tankM3(q, h.t), "m³", "ECP 501 — Water supply duration"),
    mk("Sprinklers in remote area", Math.ceil(h.a / num(v, "cov")), "pcs", "ECP 501 — Coverage per sprinkler"),
    mk("Sprinkler flow", qs, "L/min", "ECP 501 — q = density·coverage"),
    mk("Sprinkler min. pressure", sprinklerPressureBar(qs, 80), "bar", "ECP 501 — P = (q/K)², K = 80"),
  ];
};

export const plumbing = (v: V): Result[] => {
  const fu = num(v, "wc") * FU.wc + num(v, "lav") * FU.lav + num(v, "shower") * FU.shower + num(v, "sink") * FU.sink + num(v, "urinal") * FU.urinal;
  const qs = peakFlowLs(fu);
  const headM = num(v, "sh") + num(v, "fr") + num(v, "rp") * 10.197;
  const qDrain = (0.5 * Math.sqrt(fu)) / 1000;
  return [
    mk("Total fixture units", fu, "FU", "ECP 301 — Fixture unit table"),
    mk("Peak water demand", qs, "L/s", "ECP 301 — Q = 0.25·√ΣFU"),
    mk("Domestic tank volume", (num(v, "ppl") * num(v, "lpcd") * num(v, "days")) / 1000, "m³", "ECP 301 — Daily demand × storage days"),
    mk("Booster pump flow", qs * 3.6, "m³/h", "ECP 301 — Peak demand"),
    mk("Booster pump head", headM, "m", "ECP 301 — Static + friction + residual"),
    mk("Min. drain pipe Ø", drainSizeMm(qDrain, num(v, "slope") / 100, 0.012), "mm", "Manning: Q = (1/n)·A·R^(2/3)·S^(1/2), half-full, n = 0.012"),
  ];
};

export const pool = (v: V): Result[] => {
  const shape = String(v.shape);
  const l = num(v, "l");
  const w = num(v, "w");
  const m3 = poolVolumeM3(shape, l, w, num(v, "ds"), num(v, "dd"), num(v, "lf"), num(v, "ls"));
  const t = { public: 5, kids: 1.5, olympic: 7 }[String(v.cls) as "public" | "kids" | "olympic"] ?? 5;
  const q = poolFlowM3h(m3, t);
  const rate = { sand: 37, de: 4.9, cart: 0.9 }[String(v.media) as "sand" | "de" | "cart"] ?? 37;
  const area = filterAreaM2(q, rate);
  const fa = num(v, "fa");
  const base = num(v, "pipe") + num(v, "skim") + num(v, "hx");
  const hClean = base + num(v, "fc") * 10.197;
  const hDirty = base + num(v, "fd") * 10.197;
  return [
    mk("Surface area", shape === "circ" ? (Math.PI * w * w) / 4 : l * w, "m²", "ECP Sports Code — Pool geometry"),
    mk("Pool volume", m3, "m³", "ECP Sports Code — Volume by shape"),
    mk("Turnover time", t, "h", "ECP Sports Code — Kids 1–2 h, public 4–6 h, Olympic 6–8 h (midpoints)"),
    mk("Required flow rate", q, "m³/h", "ECP Sports Code — Q = V / T"),
    mk("Filter area required", area, "m²", "ECP Sports Code — A = Q / filtration rate"),
    mk("Filter count", Math.ceil(area / fa), "pcs", "ECP Sports Code — Filter area / unit area"),
    mk("Pump head (clean)", hClean, "m", "ECP Sports Code — Σ head loss, clean filter"),
    mk("Pump head (dirty)", hDirty, "m", "ECP Sports Code — Σ head loss, dirty filter"),
    mk("Pump power", pumpKw(q, hDirty, num(v, "eff")), "kW", "kW = m³/h·H / (367·η)"),
    mk("Backwash volume", backwashM3(fa, 49, num(v, "bw")), "m³", "Filter mfr. — 49 m³/h/m² fluidizing rate"),
  ];
};
