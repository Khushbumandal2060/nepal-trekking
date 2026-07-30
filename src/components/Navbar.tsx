"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mountain, Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Expeditions", href: "#" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="p-1.5 bg-slate-900 rounded-lg group-hover:scale-105 transition-transform">
                <Mountain className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-bold tracking-tight text-slate-900">
                Trek The Himalayas
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all ${
                      isActive
                        ? "text-slate-900 bg-slate-100"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <Link
              href="/contact"
              className="hidden sm:inline-flex items-center px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 rounded-full hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-slate-900/20"
            >
              Book Now
            </Link>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-2xl p-6 flex flex-col animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between mb-10">
              <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                <div className="p-1.5 bg-slate-900 rounded-lg">
                  <Mountain className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-bold">TTH</span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 -mr-2 text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    pathname === item.href
                      ? "bg-slate-900 text-white shadow-md"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}