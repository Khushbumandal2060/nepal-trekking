import Link from "next/link";
import { Mountain, Mail } from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

const socialLinks = [
  { name: "Instagram", icon: InstagramIcon, href: "#" },
  { name: "LinkedIn", icon: LinkedinIcon, href: "#" },
  { name: "YouTube", icon: YoutubeIcon, href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
              <div className="p-1.5 bg-white rounded-lg">
                <Mountain className="w-4 h-4 text-slate-950" />
              </div>
              <span className="text-sm font-bold text-white tracking-tight">
                TREK THE HIMALAYAS
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              Crafting elite high-altitude experiences since 2010. Luxury trekking
              and professional expeditions across the Himalayan range.
            </p>
          </div>

          <div className="lg:col-span-2 lg:col-start-6">
            <h4 className="text-xs font-semibold tracking-widest text-slate-500 uppercase mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {["Safety Protocols", "Preparation Guide", "Sustainability"].map((link) => (
                <li key={link}>
                  <Link href="#" className="text-sm hover:text-white transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold tracking-widest text-slate-500 uppercase mb-5">
              Connect
            </h4>
            <ul className="space-y-3">
              {socialLinks.map((social) => (
                <li key={social.name}>
                  <Link href={social.href} className="inline-flex items-center gap-2.5 text-sm hover:text-white transition-colors group">
                    <social.icon className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                    {social.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-xs font-semibold tracking-widest text-slate-500 uppercase mb-5">
              Newsletter
            </h4>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-900 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent placeholder:text-slate-600 text-white"
                />
              </div>
              <button className="px-4 py-2.5 text-sm font-medium text-slate-950 bg-white rounded-lg hover:bg-slate-200 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-900 text-center">
          <p className="text-xs text-slate-600">
            © 2024 Trek The Himalayas. All technical standards reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}