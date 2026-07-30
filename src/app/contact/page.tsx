"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ChevronDown,
  Send,
  ArrowUpRight,
} from "lucide-react";

export default function ContactPage() {
  const [time, setTime] = useState<string>("02:49:01");

  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kathmandu",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      const formatted = new Intl.DateTimeFormat("en-US", options).format(new Date());
      setTime(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10">
          <div className="max-w-2xl space-y-4">
            <p className="text-xs font-bold tracking-[0.2em] text-cyan-600 uppercase">
              Base Camp Support
            </p>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Connect with our
              <br />
              Expedition Leaders
            </h1>
            <p className="text-slate-500 leading-relaxed text-base">
              Whether you&apos;re eyeing a technical summit or a luxury trek
              through the Khumbu, our logistics team is ready to map your
              journey.
            </p>
          </div>
          <div className="lg:text-right lg:pt-4 space-y-1">
            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              Current Kathmandu Time
            </p>
            <p className="text-4xl md:text-5xl font-mono font-black text-slate-900 tracking-tight">
              {time}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-20">
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-6">
              <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase border-b border-slate-100 pb-3">
                Headquarters
              </p>
              <div className="space-y-6">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">
                    Kathmandu Office
                  </h3>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                    Thamel Marg 24, Kathmandu 44600, Nepal
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                    <Phone className="w-4 h-4 text-slate-600" />
                  </div>
                  <span className="text-slate-700 font-bold">+977 1-441-2345</span>
                </div>
                <div className="flex items-start gap-4 text-sm">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                    <Mail className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-0.5">
                      General Inquiries
                    </p>
                    <span className="text-slate-700 font-bold">
                      info@trekthehimalayas.com
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-4">
              <div className="space-y-2">
                <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  Australia Partner
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🇦🇺</span>
                  <span className="text-sm font-bold text-slate-700">Sydney, NSW</span>
                </div>
                <p className="text-xs text-slate-500 font-medium">+61 2 9123 4567</p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  USA Partner
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🇺🇸</span>
                  <span className="text-sm font-bold text-slate-700">Boulder, CO</span>
                </div>
                <p className="text-xs text-slate-500 font-medium">+1 303 555 0123</p>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Expedition Support
              </p>
              <p className="text-sm text-slate-500 leading-relaxed">
                Current clients on trail or seeking technical climbing permits:
              </p>
              <Link
                href="mailto:support@trekthehimalayas.com"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-cyan-600 hover:text-cyan-700 transition-colors group"
              >
                support@trekthehimalayas.com
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

            <div className="space-y-2 pt-4">
              <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Strategic Presence
              </p>
              <p className="text-sm text-slate-500 leading-relaxed">
                Visit us at our Kathmandu operations center.
              </p>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 sm:p-12 shadow-xl shadow-slate-100/60">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-5 py-4 text-sm bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-600/10 focus:border-cyan-400 placeholder:text-slate-400 transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      className="w-full px-5 py-4 text-sm bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-600/10 focus:border-cyan-400 placeholder:text-slate-400 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-5 py-4 text-sm bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-600/10 focus:border-cyan-400 placeholder:text-slate-400 transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2.5">
                      Preferred Region
                    </label>
                    <div className="relative">
                      <select className="w-full px-5 py-4 text-sm bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-600/10 focus:border-cyan-400 appearance-none text-slate-700 font-medium transition-all">
                        <option>Everest Region (Khumbu)</option>
                        <option>Annapurna Region</option>
                        <option>Langtang Region</option>
                        <option>Manaslu Region</option>
                        <option>Kanchenjunga Region</option>
                      </select>
                      <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2.5">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Tell us about your mountaineering experience and preferred dates..."
                    className="w-full px-5 py-4 text-sm bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-600/10 focus:border-cyan-400 placeholder:text-slate-400 resize-none transition-all font-medium"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2.5 text-sm font-bold text-[#0f294a] hover:text-cyan-600 transition-colors group"
                  >
                    Send Expedition Inquiry
                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </form>
            </div>

            <div className="flex items-center justify-end gap-2 mt-6 text-sm text-slate-400">
              <MapPin className="w-4 h-4 text-cyan-600" />
              <span className="font-mono text-xs font-semibold">27.7172° N, 85.3240° E</span>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="relative h-[450px] md:h-[550px] bg-slate-100 overflow-hidden">
        <Image
          src="/images/contactavif.jpg"
          alt="Kathmandu map view"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        <div className="absolute bottom-8 left-4 sm:left-8 lg:left-16">
          <div className="bg-white/95 backdrop-blur-md rounded-[1.5rem] p-6 shadow-2xl shadow-slate-900/10 max-w-xs border border-slate-100">
            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-4">
              Operational Status
            </p>
            <div className="flex items-center gap-3 mb-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-extrabold text-slate-900">
                Open for Briefings
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-slate-500 font-medium">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Mon-Fri: 09:00 - 18:00 NPT</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}