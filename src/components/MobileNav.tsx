"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Mountain, CloudSun, ShieldCheck } from "lucide-react";

const tabs = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Mountain, label: "Treks", href: "#" },
  { icon: CloudSun, label: "Conditions", href: "#" },
  { icon: ShieldCheck, label: "Safety", href: "#" },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-slate-100 safe-area-pb">
      <div className="flex items-center justify-around h-16">
        {tabs.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all ${
                isActive ? "text-slate-900" : "text-slate-400"
              }`}
            >
              <item.icon
                className="w-5 h-5"
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}