"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Shield,
  Building2,
  Leaf,
  Users,
  MapPin,
  Calendar,
  ChevronDown,
  Star,
  Mountain,
} from "lucide-react";
import { treks } from "@/lib/data";
import ScrollReveal from "@/components/ScrollReveal";
import StaggerContainer, { StaggerItem } from "@/components/StaggerContainer";

const advantages = [
  {
    icon: Shield,
    title: "Uncompromising Safety",
    desc: "Certified guides, oxygen support, and satellite communications on every high-altitude trek.",
  },
  {
    icon: Building2,
    title: "Elite Stays",
    desc: "We handpick the best available teahouses and provide premium luxury camping gear.",
  },
  {
    icon: Leaf,
    title: "Eco Impact",
    desc: "A strict zero-waste trail policy and carbon-neutral expeditions that support local sherpa communities.",
  },
  {
    icon: Users,
    title: "Small Batches",
    desc: "Experience personal, elite attention with a maximum of 8 trekkers per group.",
  },
];

export default function HomePage() {
  return (
    <div className="pb-24 md:pb-0">
      {/* Hero */}
      <section className="relative h-[90vh] min-h-[650px] flex items-center overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src="/images/home.jpg"
            alt="Himalayan peaks at sunrise"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>

        <div className="relative z-10 w-full px-4 max-w-7xl mx-auto flex flex-col justify-center h-full pt-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-extrabold text-white mb-6 leading-[1.05] tracking-tight">
              Scale Your
              <br />
              <span className="text-cyan-400">Nepal Dreams</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 max-w-4xl bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20 shadow-2xl flex flex-col md:flex-row items-stretch gap-2"
          >
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-white/10 bg-white/15 rounded-xl px-4 py-3">
              <div className="flex items-center gap-3 pb-3 sm:pb-0">
                <MapPin className="w-5 h-5 text-cyan-400 shrink-0" />
                <div className="text-left">
                  <p className="text-[10px] font-bold tracking-wider text-white/50 uppercase">Select Trek</p>
                  <p className="text-sm font-semibold text-white">Where to?</p>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-3 sm:pt-0 sm:pl-4">
                <Calendar className="w-5 h-5 text-cyan-400 shrink-0" />
                <div className="text-left">
                  <p className="text-[10px] font-bold tracking-wider text-white/50 uppercase">Season</p>
                  <p className="text-sm font-semibold text-white">Autumn 2024</p>
                </div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-[#0f294a] hover:bg-[#163c6b] text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 group"
            >
              Explore Expeditions
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              <ChevronDown className="w-4 h-4 text-white" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Signature Treks */}
      <section className="py-24 px-4 max-w-7xl mx-auto" id="treks">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-cyan-600 uppercase mb-2">
                Featured Expeditions
              </p>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
                Signature Treks
              </h2>
            </div>
            <Link
              href="#"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-bold text-slate-800 hover:text-cyan-600 transition-colors group"
            >
              View All Treks
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid md:grid-cols-2 gap-10" staggerDelay={0.15}>
          {treks.map((trek) => (
            <StaggerItem key={trek.slug}>
              <Link
                href={`/trek/${trek.slug}`}
                className="group block bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={trek.image}
                    alt={trek.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                <div className="p-8">
                  <span className="text-xs font-bold tracking-widest text-amber-600 uppercase">
                    {trek.category}
                  </span>
                  <h3 className="text-2xl font-extrabold text-slate-900 mt-2 mb-6 group-hover:text-cyan-600 transition-colors duration-300">
                    {trek.title}
                  </h3>

                  <div className="grid grid-cols-2 gap-y-4 pt-6 border-t border-slate-100 text-sm">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Elevation</p>
                      <p className="text-base font-bold text-slate-800 mt-0.5">Max: {trek.altitude}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Difficulty</p>
                      <p className="text-base font-bold text-slate-800 mt-0.5">{trek.difficulty}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Duration</p>
                      <p className="text-base font-bold text-slate-800 mt-0.5">{trek.days}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Price</p>
                      <p className="text-lg font-black text-slate-900 mt-0.5">${trek.price.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* TTH Advantage */}
      <section className="py-24 px-4 bg-slate-50/60 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="text-xs font-bold tracking-[0.2em] text-cyan-600 uppercase mb-3">
                Why Expedition With NT
              </p>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
                The NT Advantage
              </h2>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8" staggerDelay={0.1}>
            {advantages.map((item) => (
              <StaggerItem key={item.title}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="group bg-white rounded-3xl p-8 border border-slate-100 hover:border-cyan-100 hover:shadow-xl hover:shadow-cyan-900/5 transition-all duration-300 cursor-default"
                >
                  <div className="w-12 h-12 bg-cyan-50/50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-cyan-600 group-hover:scale-110 transition-all duration-300">
                    <item.icon className="w-5 h-5 text-cyan-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-3">
                    {item.title}
                  </h4>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-24 px-4 bg-[#0a1e3a] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 items-center">
          <ScrollReveal direction="left" className="lg:col-span-7 space-y-8">
            <p className="text-xs font-bold tracking-[0.2em] text-cyan-400 uppercase">
              Client Testimonials
            </p>
            <h3 className="text-3xl md:text-5xl font-semibold italic font-serif leading-tight">
              &ldquo;The professionalism of NT is unparalleled. I felt safe, cared for, and truly connected to the culture.&rdquo;
            </h3>
            <div className="flex items-center gap-4 pt-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-800">
                <Image
                  src="/images/about-sh.jpg"
                  alt="Jonathan Reynolds"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-bold text-white text-base">Jonathan Reynolds</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider mt-0.5">Everest Trekker, Oct 2023</p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.2} className="lg:col-span-5">
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-[2rem] p-8 md:p-10 space-y-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i, duration: 0.3 }}
                  >
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  </motion.div>
                ))}
              </div>
              <p className="text-slate-300 leading-relaxed text-base font-medium">
                NT isn&apos;t a company, it&apos;s a family. They handled all logistics, from high-altitude medicine to helicopter evacuation plans, with pure expertise.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-50 border border-slate-100 p-8 sm:p-16 text-center">
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
                Join the Ascent
              </h3>
              <p className="text-slate-500 leading-relaxed max-w-lg mx-auto">
                Get updates on seasonal openings, permits, weather updates, and gear checklists.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-4">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="flex-1 px-6 py-4 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-600/20 focus:border-cyan-400 placeholder:text-slate-400 shadow-sm transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-4 text-sm font-bold text-white bg-[#0f294a] rounded-xl hover:bg-[#163c6b] transition-colors shadow-md"
                >
                  Subscribe
                </motion.button>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}