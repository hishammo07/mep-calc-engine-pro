"use client";
import { Dim, unitLabel } from "@/lib/unit-converter";
import { useStandard } from "./standard-provider";

export function MepUnitInput({ label, dim, value, onChange, error }: { label: string; dim: Dim; value: number; onChange: (n: number) => void; error?: string }) {
  const { std } = useStandard();
  const u = unitLabel(dim, std);
  return (
    <label className="flex flex-col gap-1 text-xs text-[#9fb2d1]">
      {label}
      <div className={`flex items-center rounded-md border bg-[#0d1a30] ${error ? "border-red-500" : "border-[#1e3357] focus-within:border-[#f5a623]"}`}>
        <input
          type="number"
          step="any"
          value={Number.isFinite(value) ? value : ""}
          onChange={(e) => onChange(e.target.value === "" ? NaN : Number(e.target.value))}
          className="w-full bg-transparent px-3 py-2 text-sm text-white outline-none"
        />
        {u && <span className="whitespace-nowrap pr-3 text-[#f5a623]">{u}</span>}
      </div>
      {error && <span className="text-red-400">{error}</span>}
    </label>
  );
}
