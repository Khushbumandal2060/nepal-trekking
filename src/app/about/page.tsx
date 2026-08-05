import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import RidgeSVG from "@/components/RidgeSVG";
import type { TeamMember } from "@/lib/types";
import styles from "./about.module.css";

export const metadata: Metadata = {
    title: "About Us | Trekking Nepal",
    description:
        "Trekking Nepal was founded in Kathmandu in 2013 — one guide, one route up Langtang, and a deliberate choice to only run treks inside Nepal.",
};

const TEAM: TeamMember[] = [
    { name: "Pemba Sherpa", role: "Head Trek Leader, Khumbu" },
    { name: "Anjali Gurung", role: "Trek Leader, Annapurna Region" },
    { name: "Dawa Tamang", role: "Trek Leader, Langtang & Manaslu" },
    { name: "Karma Lama", role: "Operations & Permits, Kathmandu" },
];

const MILESTONES: { year: string; title: string; desc: string }[] = [
    { year: "2013", title: "One guide, one route", desc: "Started with a single trek leader and a Langtang Valley itinerary run out of a small office in Thamel." },
    { year: "2016", title: "Restricted-area permits", desc: "Became one of the few operators licensed to arrange Manaslu and Upper Mustang permits in-house." },
    { year: "2019", title: "40+ guides on staff", desc: "Grew to a full-time team of licensed Nepali trek leaders, all based in-country year-round." },
    { year: "2024", title: "11 regions covered", desc: "From the far-western Karnali to the eastern approach of Kanchenjunga — Nepal only, still." },
];

const VALUES = [
    {
        title: "Acclimatization first",
        desc: "Every itinerary above 3,500m includes dedicated rest days. We will not compress a schedule to save a night's accommodation cost.",
        icon: "🏔️",
    },
    {
        title: "Nepali-led, always",
        desc: "Every trek leader is licensed by Nepal's tourism ministry and based in-country year-round, not flown in for the season.",
        icon: "🇳🇵",
    },
    {
        title: "Fair pay on the trail",
        desc: "Porters and kitchen staff are paid above the regional guideline rate, with weight limits enforced on every departure.",
        icon: "🤝",
    },
    {
        title: "Small groups",
        desc: "Most fixed departures cap at 14–16 trekkers, with a minimum 1:8 guide-to-trekker ratio.",
        icon: "👥",
    },
];

const REGIONS = [
    "Khumbu", "Annapurna", "Langtang", "Manaslu", "Mustang",
    "Kanchenjunga", "Dolpo", "Makalu", "Dhaulagiri", "Karnali", "Ganesh Himal",
];

const TRUST = [
    "Nepal Tourism Board",
    "TAAN",
    "NMA",
    "KEEP",
    "40+ Licensed Guides",
    "In-House Permits",
];

const STATS = [
    { num: "9,400+", lbl: "Trekkers guided across Nepal" },
    { num: "97.8%", lbl: "Departures completed as scheduled" },
    { num: "40+", lbl: "Licensed Nepali guides on staff" },
    { num: "11", lbl: "Trekking regions covered" },
];

export default function AboutPage() {
    return (
        <main id="main-content">
            {/* 1 · HERO */}
            <section className={styles.aboutHero}>
                <div className={styles.aboutHeroMedia}>
                    <Image
                        src="/images/about-hero.jpg"
                        alt="Trekking Nepal guides on a Himalayan trail"
                        fill
                        priority
                        sizes="100vw"
                        className={styles.aboutHeroImg}
                    />
                    <div className={styles.aboutHeroScrim} />
                </div>
                <div className={`wrap ${styles.aboutHeroContent}`}>
                    <div className="eyebrow">Our Story</div>
                    <h1>Started with one guide and one route up Langtang.</h1>
                    <p className="lede">
                        Trekking Nepal was founded in Kathmandu in 2013 by a small group of
                        Nepali trek leaders who wanted to run treks the way they'd want to
                        experience them — unhurried, well-acclimatized, and led by
                        people who actually live in the mountains they guide.
                    </p>
                </div>
            </section>

            {/* 2 · TRUST BAR */}
            <div className={styles.trustBar}>
                <div className={`wrap reveal ${styles.trustBarInner}`} id="trust-reveal">
                    {TRUST.map((t) => (
                        <span key={t} className={styles.trustBadge}>
                            {t}
                        </span>
                    ))}
                </div>
            </div>

            {/* 3 · VALUES */}
            <section className={styles.valuesSection}>
                <div className="wrap reveal" id="values-reveal">
                    <div className="sec-head">
                        <div className="sec-eyebrow">Our Approach</div>
                        <h2>Doing fewer things, properly.</h2>
                        <p>
                            We made a deliberate choice early on to only run treks inside
                            Nepal. It means our guides spend every season on the same trails,
                            and our permit relationships are deep rather than wide.
                        </p>
                    </div>
                    <div className={styles.valuesGrid}>
                        {VALUES.map((v) => (
                            <div key={v.title} className={styles.valueCard}>
                                <span className={styles.icon}>{v.icon}</span>
                                <h3>{v.title}</h3>
                                <p>{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4 · TIMELINE */}
            <section className={styles.timelineSection}>
                <div className="wrap reveal" id="timeline-reveal">
                    <div className="sec-head">
                        <div className="sec-eyebrow">Thirteen Years</div>
                        <h2>Plotted like a trail.</h2>
                    </div>
                    <div className={styles.timeline}>
                        {MILESTONES.map((m) => (
                            <div key={m.year} className={styles.timelineItem}>
                                <div className={styles.timelineYear}>{m.year}</div>
                                <div className={styles.timelineDot} />
                                <div className={styles.timelineContent}>
                                    <h3>{m.title}</h3>
                                    <p>{m.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5 · REGIONS */}
            <section className={styles.regionsSection}>
                <div className="wrap reveal" id="regions-reveal">
                    <div className="sec-head">
                        <div className="sec-eyebrow">Where We Trek</div>
                        <h2>Eleven regions. One country.</h2>
                        <p>
                            From the far-western Karnali to the eastern approach of
                            Kanchenjunga — we don't operate anywhere else.
                        </p>
                    </div>
                    <div className={styles.regionsCloud}>
                        {REGIONS.map((r) => (
                            <span key={r} className={styles.regionPill}>
                                {r}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6 · GUIDE QUOTE */}
            <section className={styles.guideQuoteSection}>
                <div className="wrap reveal" id="quote-reveal">
                    <blockquote className={styles.guideQuote}>
                        <p>
                            "I grew up in Khumbu. My father was a porter, my brother is a
                            guide. When I lead a group to Everest Base Camp, I'm not showing
                            them a trail — I'm showing them the valley I was raised in."
                        </p>
                        <footer>
                            <strong>Pemba Sherpa</strong>
                            <span>Head Trek Leader, Khumbu</span>
                        </footer>
                    </blockquote>
                </div>
            </section>

            {/* 7 · TEAM */}
            <section className={styles.teamSection}>
                <div className="wrap reveal" id="team-reveal">
                    <div className="sec-head">
                        <div className="sec-eyebrow">The Team</div>
                        <h2>Trek leaders, not tour operators.</h2>
                        <p>A handful of the guides who'll be on the trail with you.</p>
                    </div>
                    <div className={styles.teamGrid}>
                        {TEAM.map((m, i) => (
                            <div key={m.name} className={styles.teamCard}>
                                <div className={styles.teamPhoto}>
                                    <RidgeSVG seed={i + 2} />
                                </div>
                                <div className={styles.teamInfo}>
                                    <h4>{m.name}</h4>
                                    <span>{m.role}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 8 · STATS */}
            <section className={styles.statsSection}>
                <div className="wrap reveal" id="stats-reveal">
                    <div className="sec-head">
                        <div className="sec-eyebrow">Track Record</div>
                        <h2>The numbers behind the trails.</h2>
                    </div>
                    <div className={styles.milestones}>
                        {STATS.map((s) => (
                            <div key={s.lbl} className={styles.milestone}>
                                <div className={styles.num}>{s.num}</div>
                                <div className={styles.lbl}>{s.lbl}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 9 · CTA */}
            <div className={styles.ctaBand}>
                <div className="wrap">
                    <h2>Want to meet the team in person?</h2>
                    <p>
                        Our office is in Thamel, Kathmandu. Drop by for a cup of tea and
                        we'll talk routes, gear, and timing.
                    </p>
                    <Link href="/contact" className="btn-ghost">
                        Plan a Visit
                    </Link>
                </div>
            </div>
        </main>
    );
}
