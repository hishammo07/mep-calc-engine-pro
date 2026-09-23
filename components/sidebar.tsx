"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Wind, Flame, Droplets, Waves } from "lucide-react";
import { StandardToggle } from "./standard-provider";

const items = [
  { href: "/", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/hvac", label: "HVAC", Icon: Wind },
  { href: "/firefighting", label: "Fire Fighting", Icon: Flame },
  { href: "/plumbing", label: "Plumbing", Icon: Droplets },
  { href: "/pools", label: "Swimming Pools", Icon: Waves },
];

export function Sidebar() {
  const path = usePathname();
  return (
    <aside className="no-print flex w-64 shrink-0 flex-col gap-6 border-r border-[#1e3357] bg-[#08111f] p-5">
      <div>
        <div className="text-lg font-bold text-[#f5a623]">MEP-Calc Engine Pro</div>
        <div className="text-xs text-[#9fb2d1]">Design Standard</div>
      </div>
      <StandardToggle />
      <nav className="flex flex-col gap-1">
        {items.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${path === href ? "bg-[#f5a623]/15 text-[#f5a623]" : "text-[#c6d3ea] hover:bg-[#111f38]"}`}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto text-xs text-[#6f85a8]">Eng. Hesham Mohamed — CES</div>
    </aside>
  );
}
