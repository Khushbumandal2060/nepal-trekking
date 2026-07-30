import Image from "next/image";
import Link from "next/link";
import { Leaf } from "lucide-react";

const leaders = [
  {
    name: "Pasang Tenzing",
    role: "Founder / Lead Guide",
    tag: "SUSTAINABILITY IN ACTION",
    image: "/images/about-sherpa.jpeg",
  },
  {
    name: "Maya Rajbhandari",
    role: "Head of Operations",
    image: "/images/about-sherpa.jpeg",
  },
  {
    name: "Dawa Sherpa",
    role: "Logistics Director",
    image: "/images/about-sherpa.jpeg",
  },
  {
    name: "Dr. Sophie Chen",
    role: "Chief Medical Officer",
    image: "/images/about-sherpa.jpeg",
  },
];

const stats = [
  { value: "25%", label: "Local Community Reinvestment" },
  { value: "120+", label: "Scholarships Funded" },
  { value: "12", label: "Remote Clinics Supported" },
  { value: "100%", label: "Carbon Neutral Expeditions" },
  { value: "4.2t", label: "Tons of Waste Removed Yearly" },
];

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/about-hero.jpg"
            alt="Himalayan mountain range"
            fill
            className="object-cover animate-fade-in"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 text-center text-white px-4 pt-20">
          <p className="text-xs font-bold tracking-[0.3em] text-cyan-400 uppercase mb-6">
            Start Exploring
          </p>
          <h1 className="text-6xl sm:text-7xl md:text-9xl font-black tracking-tight leading-[0.95] text-balance">
            Trek The
            <br />
            Himalayas
          </h1>
        </div>
      </section>

      {/* Sherpa Spirit */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left Image with nice layout details */}
            <div className="relative">
              <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/80 border border-slate-100 z-10">
                <Image
                  src="/images/about-sherpa.jpeg"
                  alt="Sherpa guide Pasang Tenzing"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-cyan-50/50 rounded-[2.5rem] -z-10" />
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-slate-50 rounded-[2rem] -z-10" />
            </div>

            {/* Right Text */}
            <div className="space-y-8">
              <div>
                <p className="text-xs font-bold tracking-[0.2em] text-cyan-600 uppercase mb-3">
                  The Soul of TTH
                </p>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                  The Sherpa Spirit
                </h2>
              </div>
              <div className="space-y-6 text-slate-600 leading-relaxed text-base">
                <p>
                  Our foundation is built upon the expertise of the Sherpa people.
                  Every expedition is led by guides who were born in the shadow of
                  these giants. They possess an intuitive understanding of the
                  terrain that no GPS can replicate.
                </p>
                <p>
                  All our head guides are IFMGA certified, representing the highest
                  global standard for mountain professionals. To them, the
                  Himalayas aren&apos;t just a workplace—they are home.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-10 pt-10 border-t border-slate-100">
                <div>
                  <p className="text-5xl font-black text-slate-900 mb-2">100%</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                    Local Guides
                  </p>
                </div>
                <div>
                  <p className="text-5xl font-black text-slate-900 mb-2 font-sans">Elite</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                    Safety Rating
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability */}
      <section className="py-24 lg:py-32 bg-slate-50/60 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left side */}
            <div className="space-y-8">
              <div>
                <p className="text-xs font-bold tracking-[0.2em] text-cyan-600 uppercase mb-3">
                  Driven by Ethics
                </p>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                  Sustainability in Action
                </h2>
              </div>
              <div className="space-y-6 text-slate-600 leading-relaxed text-base">
                <p>
                  Trek The Himalayas (TTH) began as a small collective of
                  mountaineers disillusioned by the commercialization of the
                  trails. We saw a need for an operator that prioritized the
                  safety of the trekker and the dignity of the staff in equal
                  measure.
                </p>
                <p>
                  We operate on a zero-waste policy, supporting local tea houses
                  and ensuring every porter is insured and fairly compensated.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex items-start gap-5">
                <div className="p-4 bg-[#0a1e3a] rounded-2xl shrink-0">
                  <Leaf className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-lg mb-1">
                    B-Corp Aspirations
                  </h4>
                  <p className="text-sm text-slate-600 italic">
                    &quot;We leave nothing but footprints, we take nothing but
                    photos.&quot;
                  </p>
                </div>
              </div>
            </div>

            {/* Right side circular image */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-80 h-80 md:w-[28rem] md:h-[28rem]">
                <div className="absolute inset-0 rounded-full overflow-hidden border-[12px] border-white shadow-2xl shadow-slate-200/80">
                  <Image
                    src="/images/about-sustain.jpg"
                    alt="Team in mountain lodge"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <p className="text-xs font-bold tracking-[0.2em] text-cyan-600 uppercase mb-3">
              The Architects of Ascent
            </p>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              Our Leadership
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {leaders.map((person) => (
              <div key={person.name} className="group cursor-pointer">
                <div className="relative aspect-[3/4] mb-6 overflow-hidden rounded-3xl bg-slate-100 grayscale group-hover:grayscale-0 transition-all duration-700 ease-out shadow-sm border border-slate-100">
                  <Image
                    src={person.image}
                    alt={person.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-cyan-600 uppercase tracking-widest">
                    {person.role}
                  </p>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    {person.name}
                  </h3>
                  {person.tag && (
                    <p className="text-[9px] font-bold text-amber-600 tracking-wider pt-1 uppercase">
                      {person.tag}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-24 lg:py-32 bg-slate-950 text-white border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 max-w-2xl mx-auto space-y-4">
            <p className="text-xs font-bold tracking-[0.2em] text-cyan-400 uppercase">
              Measurable Change
            </p>
            <p className="text-slate-400 text-base leading-relaxed">
              Our commitment isn&apos;t just a promise; it&apos;s a data-driven
              mission to preserve the Himalayas for the next generation.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center space-y-2">
                <p className="text-4xl md:text-6xl font-black text-cyan-400 tracking-tight">
                  {stat.value}
                </p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-relaxed px-2">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Ready to define your limits?
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed max-w-xl mx-auto">
            Our next high-altitude season begins soon. Secure your place in a
            team of elite adventurers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/contact"
              className="px-8 py-4 text-sm font-bold text-white bg-[#0f294a] rounded-full hover:bg-[#163c6b] hover:scale-105 transition-all shadow-lg shadow-slate-900/10"
            >
              Join Our Next Ascent
            </Link>
            <button className="px-8 py-4 text-sm font-bold text-slate-700 border border-slate-200 rounded-full hover:bg-slate-50 hover:border-slate-300 transition-all">
              Download 2024 Catalog
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}