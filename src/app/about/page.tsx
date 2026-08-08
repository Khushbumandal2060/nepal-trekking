import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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

const STORY_POINTS = [
    "Founded in Kathmandu by Nepali trek leaders",
    "Every itinerary runs entirely inside Nepal",
    "Guides on staff year-round, never flown in for the season",
];

/** "Pemba Sherpa" → "PS" */
function initials(name: string): string {
    return name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

export default function AboutPage() {
    return (
        <main id="main-content">
            {/* 1 · HERO */}
            <section className={styles.hero}>
                <div className={styles.heroMedia}>
                    <Image
                        src="/images/about-hero.jpg"
                        alt="Trekking Nepal guides on a Himalayan trail"
                        fill
                        priority
                        sizes="100vw"
                        className={styles.heroImg}
                    />
                    <div className={styles.heroScrim} />
                </div>

                <div className={`wrap ${styles.heroContent}`}>
                    <div className="eyebrow">Our Story</div>
                    <h1>
                        Started with one guide and one route up <em>Langtang.</em>
                    </h1>
                    <p className={styles.heroLede}>
                        Trekking Nepal was founded in Kathmandu in 2013 by a small group of
                        Nepali trek leaders who wanted to run treks the way they'd want to
                        experience them — unhurried, well-acclimatized, and led by
                        people who actually live in the mountains they guide.
                    </p>
                    <div className={styles.heroActions}>
                        <Link href="/treks" className="btn btn-primary">
                            Explore Our Treks
                        </Link>
                        <Link href="/contact" className="btn btn-ghost">
                            Talk to a Guide
                        </Link>
                    </div>
                </div>

                <div className={styles.heroStatsBar}>
                    <div className="wrap">
                        <div className={styles.heroStats}>
                            {STATS.map((s) => (
                                <div key={s.lbl} className={styles.heroStat}>
                                    <div className={styles.num}>{s.num}</div>
                                    <span className={styles.lbl}>{s.lbl}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 2 · STORY */}
            <section className={styles.story}>
                <div className={`wrap reveal ${styles.storyGrid}`} id="story-reveal">
                    <div className={styles.storyMedia}>
                        <Image
                            src="/images/about-sherpa.jpeg"
                            alt="A Nepali trek leader at rest in the mountains"
                            fill
                            sizes="(max-width: 900px) 100vw, 45vw"
                            className={styles.storyImg}
                        />
                        <div className={styles.storyBadge}>
                            <span>Est.</span>
                            <strong>2013</strong>
                        </div>
                    </div>
                    <div className={styles.storyText}>
                        <div className="sec-eyebrow">A Deliberate Choice</div>
                        <h2>Doing fewer things, properly.</h2>
                        <p>
                            We made a deliberate choice early on to only run treks inside{" "}
                            <strong>Nepal</strong>. It means our guides spend every season on
                            the same trails, and our permit relationships are deep rather than
                            wide.
                        </p>
                        <p>
                            One country, eleven trekking regions, and a single office in
                            Thamel, Kathmandu — that focus is the whole business.
                        </p>
                        <ul className={styles.storyList}>
                            {STORY_POINTS.map((point) => (
                                <li key={point}>{point}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* 3 · VALUES */}
            <section className={styles.values}>
                <div className="wrap reveal" id="values-reveal">
                    <div className={styles.sectionHead}>
                        <div className="sec-eyebrow">Our Approach</div>
                        <h2>What you can expect on every trail.</h2>
                        <p>
                            Four commitments we don't negotiate on, no matter the route or the
                            season.
                        </p>
                    </div>
                    <div className={styles.valuesGrid}>
                        {VALUES.map((v, i) => (
                            <article key={v.title} className={styles.valueCard}>
                                <span className={styles.valueNum}>
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                <span className={styles.valueIcon} aria-hidden="true">
                                    {v.icon}
                                </span>
                                <h3>{v.title}</h3>
                                <p>{v.desc}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4 · TIMELINE */}
            <section className={styles.timeline}>
                <div className="wrap reveal" id="timeline-reveal">
                    <div className={styles.sectionHead}>
                        <div className="sec-eyebrow">Thirteen Years</div>
                        <h2>Plotted like a trail.</h2>
                    </div>
                    <div className={styles.timelineList}>
                        {MILESTONES.map((m) => (
                            <div key={m.year} className={styles.timelineItem}>
                                <div className={styles.timelineYear}>{m.year}</div>
                                <div className={styles.timelineDot} />
                                <div className={styles.timelineCard}>
                                    <h3>{m.title}</h3>
                                    <p>{m.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5 · REGIONS */}
            <section className={styles.regions}>
                <div className="wrap reveal" id="regions-reveal">
                    <div className={styles.sectionHead}>
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

            {/* 6 · TRUST STRIP */}
            <div className={styles.trust}>
                <div className={`wrap reveal ${styles.trustInner}`} id="trust-reveal">
                    {TRUST.map((t) => (
                        <span key={t} className={styles.trustItem}>
                            {t}
                        </span>
                    ))}
                </div>
            </div>

            {/* 7 · QUOTE */}
            <section className={styles.quote}>
                <div className="wrap reveal" id="quote-reveal">
                    <blockquote className={styles.quoteBlock}>
                        <div className={styles.quoteAvatar} aria-hidden="true">
                            PS
                        </div>
                        <span className={styles.quoteMark} aria-hidden="true">
                            &ldquo;
                        </span>
                        <p>
                            I grew up in Khumbu. My father was a porter, my brother is a
                            guide. When I lead a group to Everest Base Camp, I'm not showing
                            them a trail — I'm showing them the valley I was raised in.
                        </p>
                        <footer className={styles.quoteFooter}>
                            <strong>Pemba Sherpa</strong>
                            <span>Head Trek Leader, Khumbu</span>
                        </footer>
                    </blockquote>
                </div>
            </section>

            {/* 8 · TEAM */}
            <section className={styles.team}>
                <div className="wrap reveal" id="team-reveal">
                    <div className={styles.sectionHead}>
                        <div className="sec-eyebrow">The Team</div>
                        <h2>Trek leaders, not tour operators.</h2>
                        <p>A handful of the guides who'll be on the trail with you.</p>
                    </div>
                    <div className={styles.teamGrid}>
                        {TEAM.map((m) => (
                            <article key={m.name} className={styles.teamCard}>
                                <div className={styles.teamAvatar} aria-hidden="true">
                                    {initials(m.name)}
                                </div>
                                <h4>{m.name}</h4>
                                <span className={styles.teamRole}>{m.role}</span>
                            </article>
                        ))}
                        <Link href="/contact" className={styles.teamJoin}>
                            <span className={styles.joinPlus} aria-hidden="true">
                                +
                            </span>
                            <h4>Join the team</h4>
                            <p>We're always looking for licensed Nepali guides.</p>
                        </Link>
                    </div>
                </div>
            </section>

            {/* 9 · CTA */}
            <div className={styles.cta}>
                <div className="wrap">
                    <h2>Want to meet the team in person?</h2>
                    <p>
                        Our office is in Thamel, Kathmandu. Drop by for a cup of tea and
                        we'll talk routes, gear, and timing.
                    </p>
                    <Link href="/contact" className="btn btn-ghost">
                        Plan a Visit
                    </Link>
                </div>
            </div>
        </main>
    );
}
