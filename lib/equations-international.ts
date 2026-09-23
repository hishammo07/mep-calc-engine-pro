import { V, Result, num, mk, ductDiameterM, manningFull, interp } from "./unit-converter";

export const cltdCorrected = (cltd: number, lm: number, k: number, tr: number, to: number, dr: number) => (cltd + lm) * k + (78 - tr) + (to - dr / 2 - 85);
export const conductionLoad = (u: number, a: number, cltdc: number) => u * a * cltdc;
export const ventSensible = (cfm: number, dT: number) => 1.08 * cfm * dT;
export const ventLatent = (cfm: number, dW: number) => 4840 * cfm * dW;
export const peopleLoad = (n: number, s: number, l: number) => ({ sensible: n * s, latent: n * l });
export const lightLoad = (wpsf: number, area: number, ballast: number) => wpsf * area * ballast * 3.412;
export const equipmentLoad = (w: number, use: number) => w * use * 3.412;
export const supplyCfm = (qs: number, tr: number, ts: number) => qs / (1.08 * (tr - ts));

export const HAZARD: Record<string, { d: number; a: number; t: number; h: number }> = {
  light: { d: 0.1, a: 1500, t: 30, h: 100 },
  ord1: { d: 0.15, a: 1500, t: 60, h: 250 },
  ord2: { d: 0.2, a: 1500, t: 60, h: 250 },
  extra1: { d: 0.3, a: 2500, t: 90, h: 500 },
  extra2: { d: 0.4, a: 2500, t: 90, h: 500 },
};
export const fireDemand = (density: number, area: number, hose: number) => density * area + hose;
export const hazenPsiPerFt = (q: number, c: number, d: number) => (4.52 * Math.pow(q, 1.85)) / (Math.pow(c, 1.85) * Math.pow(d, 4.87));
export const pumpTdhPsi = (staticFt: number, frictionPsi: number, residualPsi: number) => staticFt * 0.433 + frictionPsi + residualPsi;
export const tankGallons = (q: number, minutes: number) => q * minutes;
export const sprinklerPressure = (q: number, k: number) => Math.pow(q / k, 2);

const WSFU = { wc: { valve: 6, tank: 2.5 }, lav: 1, shower: 2, sink: 1.4, urinal: { valve: 5, tank: 3 } };
const DFU = { wc: 3, lav: 1, shower: 2, sink: 2, urinal: 2 };
const HUNTER_TANK = [[1, 3], [5, 5], [10, 8], [20, 11], [30, 14], [40, 16], [50, 17.5], [60, 19], [80, 22], [100, 25], [150, 30], [200, 35], [300, 45], [500, 60]];
const HUNTER_VALVE = [[5, 15], [10, 27], [20, 35], [30, 41], [40, 46], [50, 50], [80, 58], [100, 63], [150, 73], [200, 83], [300, 100], [500, 125]];
export const hunterGpm = (fu: number, valve: boolean) => interp(valve ? HUNTER_VALVE : HUNTER_TANK, fu);
export const drainSizeIn = (qM3s: number, slope: number, n: number) => {
  const sizes = [1.5, 2, 3, 4, 5, 6, 8, 10, 12, 15];
  return sizes.find((s) => manningFull(s * 0.0254, slope, n) / 2 >= qM3s) ?? sizes[sizes.length - 1];
};

export const poolVolumeFt3 = (shape: string, l: number, w: number, ds: number, dd: number, lf: number, ls: number) => {
  if (shape === "rect") return l * w * ds;
  if (shape === "circ") return (Math.PI * w * w * ds) / 4;
  if (shape === "slope") return (l * w * (ds + dd)) / 2;
  return w * (lf * ds + (ls * (ds + dd)) / 2 + Math.max(l - lf - ls, 0) * dd);
};
export const poolFlowGpm = (gal: number, hours: number) => gal / (hours * 60);
export const filterAreaFt2 = (q: number, rate: number) => q / rate;
export const pumpBhp = (gpm: number, headFt: number, eff: number) => (gpm * headFt) / (3960 * eff);
export const backwashGal = (area: number, rate: number, minutes: number) => area * rate * minutes;

export const hvac = (v: V): Result[] => {
  const tr = num(v, "tr");
  const to = num(v, "to");
  const ts = num(v, "ts");
  const cltdc = cltdCorrected(num(v, "cltd"), num(v, "lm"), num(v, "k"), tr, to, num(v, "dr"));
  const qc = conductionLoad(num(v, "u"), num(v, "a"), cltdc);
  const qvs = ventSensible(num(v, "vent"), to - tr);
  const qvl = ventLatent(num(v, "vent"), num(v, "dw"));
  const p = peopleLoad(num(v, "ppl"), num(v, "ps"), num(v, "pl"));
  const ql = lightLoad(num(v, "lpd"), num(v, "fa"), num(v, "bal"));
  const qe = equipmentLoad(num(v, "eq"), num(v, "use"));
  const qs = qc + qvs + p.sensible + ql + qe;
  const qlat = qvl + p.latent;
  const cfm = supplyCfm(qs, tr, ts);
  const q = cfm * 0.00047194745;
  const fr = num(v, "fr") * 8.17246;
  const dia = (f: number) => ductDiameterM(q * f, fr, "darcy") * 39.3701;
  const d0 = dia(1) / 39.3701;
  return [
    mk("Conduction/radiation gain", qc, "Btu/h", "ASHRAE Fundamentals — CLTD/SCL/CLF: Q = U·A·CLTDc"),
    mk("Ventilation sensible", qvs, "Btu/h", "ASHRAE Fundamentals — Q = 1.08·CFM·ΔT"),
    mk("Ventilation latent", qvl, "Btu/h", "ASHRAE Fundamentals — Q = 4840·CFM·ΔW"),
    mk("People (sensible + latent)", p.sensible + p.latent, "Btu/h", "ASHRAE Fundamentals — Nonresidential cooling & heating load: people"),
    mk("Lighting", ql, "Btu/h", "ASHRAE Fundamentals — Q = W·3.412·ballast"),
    mk("Equipment", qe, "Btu/h", "ASHRAE Fundamentals — Q = W·3.412·usage factor"),
    mk("Total sensible", qs, "Btu/h", "ASHRAE Fundamentals — Σ sensible gains"),
    mk("Total latent", qlat, "Btu/h", "ASHRAE Fundamentals — Σ latent gains"),
    mk("Total cooling load", (qs + qlat) / 12000, "TR", "1 TR = 12,000 Btu/h"),
    mk("Supply airflow", cfm, "CFM", "ASHRAE Fundamentals — CFM = Qs / (1.08·(Tr−Ts))"),
    mk("Fresh air intake", num(v, "vent"), "CFM", "ASHRAE 62.1 — Ventilation rate procedure"),
    mk("Duct Ø trunk (100%)", dia(1), "in", "ASHRAE Fundamentals — Duct design, equal friction, Darcy–Weisbach"),
    mk("Duct Ø main (60%)", dia(0.6), "in", "ASHRAE Fundamentals — Duct design, equal friction"),
    mk("Duct Ø branch (30%)", dia(0.3), "in", "ASHRAE Fundamentals — Duct design, equal friction"),
    mk("Trunk velocity", q / ((Math.PI * d0 * d0) / 4) / 0.00508, "fpm", "ASHRAE Fundamentals — Duct design"),
    mk("Pressure drop", num(v, "fr"), "in.wg/100 ft", "ASHRAE Fundamentals — Darcy–Weisbach friction rate"),
  ];
};

export const fire = (v: V): Result[] => {
  const h = HAZARD[String(v.hazard)];
  const q = fireDemand(h.d, h.a, h.h);
  const res = v.sys === "stand" ? 100 : 7;
  const fr = hazenPsiPerFt(q, num(v, "c"), num(v, "dia")) * num(v, "len");
  const tdh = pumpTdhPsi(num(v, "sh"), fr, res);
  const qs = h.d * num(v, "cov");
  return [
    mk("Design density", h.d, "gpm/ft²", "NFPA 13 — Density/area curves"),
    mk("Remote area", h.a, "ft²", "NFPA 13 — Remote area by hazard class"),
    mk("Hose stream allowance", h.h, "GPM", "NFPA 13 — Hose stream demand"),
    mk("Total demand Q", q, "GPM", "NFPA 13 — Q = density·area + hose"),
    mk("Friction loss", fr, "psi", "NFPA 13 — Hazen-Williams: p = 4.52·Q^1.85 / (C^1.85·d^4.87)"),
    mk("Fire pump flow", q, "GPM", "NFPA 20 — Pump rated flow"),
    mk("Fire pump head (TDH)", tdh, "psi", "NFPA 13/14 — TDH = static + friction + residual"),
    mk("Fire water tank", tankGallons(q, h.t), "gal", "NFPA 13 — Water supply duration"),
    mk("Sprinklers in remote area", Math.ceil(h.a / num(v, "cov")), "pcs", "NFPA 13 — Coverage per sprinkler"),
    mk("Sprinkler flow", qs, "GPM", "NFPA 13 — q = density·coverage"),
    mk("Sprinkler min. pressure", sprinklerPressure(qs, 5.6), "psi", "NFPA 13 — P = (q/K)², K = 5.6"),
  ];
};

export const plumbing = (v: V): Result[] => {
  const valve = v.sys === "valve";
  const fu = num(v, "wc") * (valve ? WSFU.wc.valve : WSFU.wc.tank) + num(v, "lav") * WSFU.lav + num(v, "shower") * WSFU.shower + num(v, "sink") * WSFU.sink + num(v, "urinal") * (valve ? WSFU.urinal.valve : WSFU.urinal.tank);
  const dfu = num(v, "wc") * DFU.wc + num(v, "lav") * DFU.lav + num(v, "shower") * DFU.shower + num(v, "sink") * DFU.sink + num(v, "urinal") * DFU.urinal;
  const gpm = hunterGpm(fu, valve);
  const headFt = num(v, "sh") + num(v, "fr") + num(v, "rp") * 2.31;
  const qDrain = dfu * 7.5 * 6.30902e-5;
  return [
    mk("Total WSFU", fu, "FU", "IPC App. E — Water supply fixture units"),
    mk("Total DFU", dfu, "DFU", "IPC Table 709.1 — Drainage fixture units"),
    mk("Peak water demand", gpm, "GPM", "IPC App. E — Hunter's curve (piecewise)"),
    mk("Domestic tank volume", num(v, "ppl") * num(v, "lpcd") * num(v, "days"), "gal", "ASPE Data Book — Daily demand × storage days"),
    mk("Booster pump flow", gpm, "GPM", "ASPE Data Book — Peak demand"),
    mk("Booster pump head", headFt, "ft", "ASPE Data Book — Static + friction + residual"),
    mk("Min. drain pipe Ø", drainSizeIn(qDrain, num(v, "slope") / 100, 0.012), "in", "Manning: Q = (1/n)·A·R^(2/3)·S^(1/2), half-full, n = 0.012"),
  ];
};

export const pool = (v: V): Result[] => {
  const shape = String(v.shape);
  const l = num(v, "l");
  const w = num(v, "w");
  const gal = poolVolumeFt3(shape, l, w, num(v, "ds"), num(v, "dd"), num(v, "lf"), num(v, "ls")) * 7.48052;
  const t = { public: 6, semi: 8 }[String(v.cls) as "public" | "semi"] ?? 6;
  const q = poolFlowGpm(gal, t);
  const rate = { sand: 15, de: 2, cart: 0.375 }[String(v.media) as "sand" | "de" | "cart"] ?? 15;
  const area = filterAreaFt2(q, rate);
  const fa = num(v, "fa");
  const base = num(v, "pipe") + num(v, "skim") + num(v, "hx");
  const hClean = base + num(v, "fc") * 2.31;
  const hDirty = base + num(v, "fd") * 2.31;
  return [
    mk("Surface area", shape === "circ" ? (Math.PI * w * w) / 4 : l * w, "ft²", "ISPSC — Pool geometry"),
    mk("Pool volume", gal, "gal", "ISPSC — Volume by shape"),
    mk("Turnover time", t, "h", "ISPSC — Public 6 h, semi-public 8 h"),
    mk("Required flow rate", q, "GPM", "ISPSC — Q = V / (T·60)"),
    mk("Filter area required", area, "ft²", "ISPSC — A = Q / filtration rate"),
    mk("Filter count", Math.ceil(area / fa), "pcs", "ISPSC — Filter area / unit area"),
    mk("Pump head (clean)", hClean, "ft", "ISPSC — Σ head loss, clean filter"),
    mk("Pump head (dirty)", hDirty, "ft", "ISPSC — Σ head loss, dirty filter"),
    mk("Pump BHP", pumpBhp(q, hDirty, num(v, "eff")), "BHP", "BHP = GPM·H / (3960·η)"),
    mk("Backwash volume", backwashGal(fa, 20, num(v, "bw")), "gal", "Filter mfr. — 20 gpm/ft² fluidizing rate"),
  ];
};
