import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import RidgeSVG from "@/components/RidgeSVG";
import { GUIDES } from "@/data/trek-people";
import { treks } from "@/data/treks";
import { aboutPageJsonLd, breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import styles from "./about.module.css";

export const metadata: Metadata = buildMetadata({
    title: "About Us",
    description:
        "Trekking Nepal was founded in Kathmandu in 2013 — one guide, one route up Langtang, and a deliberate choice to only run treks inside Nepal.",
    path: "/about",
});

/* ----------------------------------------------------------------
   Content
   ---------------------------------------------------------------- */

const MILESTONES: { year: string; title: string; desc: string }[] = [
    {
        year: "2013",
        title: "One guide, one route",
        desc: "A single trek leader and a Langtang Valley itinerary, run out of a small office in Thamel.",
    },
    {
        year: "2016",
        title: "Restricted-area permits",
        desc: "Licensed to arrange Manaslu and Upper Mustang permits in-house — before that meant something.",
    },
    {
        year: "2019",
        title: "40+ guides on staff",
        desc: "A full-time team of licensed Nepali trek leaders, all based in-country year-round.",
    },
    {
        year: "2024",
        title: "11 regions covered",
        desc: "From the far-western Karnali to the eastern approach of Kanchenjunga — Nepal only, still.",
    },
];

const VALUES: { title: string; desc: string; icon: string }[] = [
    {
        title: "Acclimatization first",
        desc: "Every itinerary above 3,500m carries dedicated rest days as the default plan, not an upsell. We will not compress a schedule to save a night's cost.",
        icon: "🏔️",
    },
    {
        title: "Nepali-led, always",
        desc: "Every trek leader is licensed by Nepal's tourism ministry and lives in-country year-round — never flown in for the season.",
        icon: "🇳🇵",
    },
    {
        title: "Fair pay on the trail",
        desc: "Porters and kitchen staff are paid above the regional guideline rate, with weight limits enforced on every departure.",
        icon: "🤝",
    },
    {
        title: "Small groups",
        desc: "Most fixed departures cap at 14–16 trekkers, with a minimum 1:8 guide-to-trekker ratio on every route.",
        icon: "👥",
    },
];

const REGIONS: { name: string; value: string; blurb: string }[] = [
    { name: "Khumbu", value: "khumbu", blurb: "Everest & the Sherpa valleys" },
    { name: "Annapurna", value: "annapurna", blurb: "Sanctuary, Circuit & Thorong La" },
    { name: "Langtang", value: "langtang", blurb: "Rhododendrons & Tamang villages" },
    { name: "Manaslu", value: "manaslu", blurb: "Restricted circuit, far fewer trekkers" },
    { name: "Mustang", value: "mustang", blurb: "Wind-carved Tibetan plateau" },
    { name: "Kanchenjunga", value: "kanchenjunga", blurb: "Remote base camps in the far east" },
    { name: "Dolpo", value: "dolpo", blurb: "Upper Dolpo & Phoksundo Lake" },
    { name: "Makalu", value: "makalu", blurb: "Barun Valley & the fifth peak" },
    { name: "Dhaulagiri", value: "dhaulagiri", blurb: "Big, glaciated & committed" },
    { name: "Karnali", value: "karnali", blurb: "Far-western Rara & Humla" },
    { name: "Ganesh Himal", value: "ganesh", blurb: "Quiet ridges above the Trishuli" },
];

const TRUST = [
    "Nepal Tourism Board",
    "TAAN",
    "NMA",
    "KEEP",
    "40+ Licensed Guides",
    "In-House Permits",
];

const STATS: { num: string; lbl: string }[] = [
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

/** Images for the "trails we call home" strip (sourced from the gallery). */
const TRAIL: { src: string; alt: string; label: string }[] = [
    { src: "/images/gallery/everest-three-passes-2.jpg", alt: "A high pass in the Everest region", label: "Khumbu" },
    { src: "/images/gallery/annapurna-circuit-2.jpg", alt: "Trail on the Annapurna Circuit", label: "Annapurna" },
    { src: "/images/gallery/manaslu-circuit-3.jpg", alt: "Gorge on the Manaslu Circuit", label: "Manaslu" },
    { src: "/images/gallery/poon-hill-3.jpg", alt: "Sunrise over the Annapurnas from Poon Hill", label: "Poon Hill" },
    { src: "/images/gallery/mardi-himal-3.jpg", alt: "Ridgeline on the Mardi Himal trek", label: "Mardi Himal" },
];

/** Scrolling ticker copy — regions + trust badges in one seamless band. */
const TICKER = [
    ...REGIONS.map((r) => r.name),
    ...TRUST,
];

/* ----------------------------------------------------------------
   Helpers
   ---------------------------------------------------------------- */

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
    const trekCount = (value: string) =>
        treks.filter((t) => t.region === value).length;

    return (
        <div id="main-content">
            <JsonLd
                data={[
                    aboutPageJsonLd(),
                    breadcrumbJsonLd([
                        { name: "Home", path: "/" },
                        { name: "About Us", path: "/about" },
                    ]),
                ]}
            />

            {/* ============================================================
                1 · HERO
                ============================================================ */}
            <section className={styles.hero}>
                <div className={styles.heroMedia}>
                    <Image
                        src="/images/about-hero.jpg"
                        alt="Trekking Nepal guides crossing a ridge in the Nepali Himalaya"
                        fill
                        priority
                        sizes="100vw"
                        className={styles.heroImg}
                    />
                    <div className={styles.heroScrim} aria-hidden="true" />
                </div>

                <span className={styles.heroRail} aria-hidden="true">
                    Est. 2013 — Kathmandu
                </span>

                <div className={`wrap ${styles.heroContent}`}>
                    <div className="eyebrow">About Us</div>
                    <h1>
                        Guided by people who call these mountains <em>home.</em>
                    </h1>
                    <p className={styles.heroLede}>
                        Trekking Nepal was founded in Kathmandu in 2013 by a small
                        group of Nepali trek leaders who wanted to run treks the
                        way they&rsquo;d want to experience them — unhurried,
                        well-acclimatized, and led by people who actually live in
                        the mountains they guide.
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

            {/* ============================================================
                2 · TRUST TICKER
                ============================================================ */}
            <div className={styles.ticker} aria-hidden="true">
                <div className={styles.tickerTrack}>
                    {[0, 1].map((copy) => (
                        <div className={styles.tickerGroup} key={copy}>
                            {TICKER.map((item) => (
                                <span className={styles.tickerItem} key={`${copy}-${item}`}>
                                    {item}
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* ============================================================
                3 · STORY
                ============================================================ */}
            <section className={styles.story}>
                <div className={`wrap reveal ${styles.storyGrid}`} id="story-reveal">
                    <div className={styles.storyMedia}>
                        <RidgeSVG seed={4} />
                        <div className={styles.storyFrame}>
                            <Image
                                src="/images/about-sherpa.jpeg"
                                alt="A Nepali trek leader at rest in the mountains"
                                fill
                                sizes="(max-width: 900px) 100vw, 45vw"
                                className={styles.storyImg}
                            />
                        </div>
                        <div className={styles.storyBadge}>
                            <span>Est.</span>
                            <strong>2013</strong>
                        </div>
                        <div className={styles.storyChip}>
                            Thamel &middot; Kathmandu
                        </div>
                    </div>

                    <div className={styles.storyText}>
                        <div className="sec-eyebrow">A Deliberate Choice</div>
                        <h2>Doing fewer things, properly.</h2>
                        <p>
                            We made a deliberate choice early on to only run treks
                            inside <strong>Nepal</strong>. It means our guides
                            spend every season on the same trails, and our permit
                            relationships are deep rather than wide.
                        </p>
                        <p>
                            One country, eleven trekking regions, and a single
                            office in Thamel — that focus is the whole business.
                        </p>
                        <ul className={styles.storyList}>
                            {STORY_POINTS.map((point) => (
                                <li key={point}>{point}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* ============================================================
                4 · TRAILS WE CALL HOME (image strip)
                ============================================================ */}
            <section className={styles.trail}>
                <div className="wrap reveal" id="trail-reveal">
                    <div className={`sec-head sec-head--center ${styles.trailHead}`}>
                        <div className="sec-eyebrow">On the Trail</div>
                        <h2>The ridges we call an office.</h2>
                        <p className="sec-lead">
                            A few frames from the valleys our guides walk every
                            season — and would happily walk again tomorrow.
                        </p>
                    </div>
                    <div className={styles.trailGrid}>
                        {TRAIL.map((t) => (
                            <figure key={t.src} className={styles.trailCard}>
                                <Image
                                    src={t.src}
                                    alt={t.alt}
                                    fill
                                    sizes="(max-width: 768px) 50vw, 20vw"
                                    className={styles.trailImg}
                                    loading="lazy"
                                />
                                <span className={styles.trailLabel}>{t.label}</span>
                            </figure>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================================================
                5 · VALUES
                ============================================================ */}
            <section className={styles.values}>
                <div className="wrap reveal" id="values-reveal">
                    <div className={styles.sectionHead}>
                        <div className="sec-eyebrow">Our Approach</div>
                        <h2>What you can expect on every trail.</h2>
                        <p>
                            Four commitments we don&rsquo;t negotiate on, no
                            matter the route or the season.
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

            {/* ============================================================
                6 · TIMELINE
                ============================================================ */}
            <section className={styles.timeline}>
                <div className="wrap reveal" id="timeline-reveal">
                    <div className={styles.sectionHead}>
                        <div className="sec-eyebrow">Thirteen Years</div>
                        <h2>Plotted like a trail.</h2>
                        <p>
                            Four markers on a route that hasn&rsquo;t detoured
                            from Nepal since the first day.
                        </p>
                    </div>
                    <div className={styles.timelineList}>
                        {MILESTONES.map((m) => (
                            <div key={m.year} className={styles.timelineItem}>
                                <span className={styles.timelineDot} aria-hidden="true" />
                                <div className={styles.timelineYear}>{m.year}</div>
                                <div className={styles.timelineCard}>
                                    <h3>{m.title}</h3>
                                    <p>{m.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================================================
                7 · REGIONS
                ============================================================ */}
            <section className={styles.regions}>
                <div className="wrap reveal" id="regions-reveal">
                    <div className={styles.sectionHead}>
                        <div className="sec-eyebrow">Where We Trek</div>
                        <h2>Eleven regions. One country.</h2>
                        <p>
                            From the far-western Karnali to the eastern approach
                            of Kanchenjunga — we don&rsquo;t operate anywhere
                            else.
                        </p>
                    </div>
                    <div className={styles.regionsGrid}>
                        {REGIONS.map((r) => (
                            <Link
                                key={r.value}
                                href={`/treks?region=${r.value}`}
                                className={styles.regionCard}
                            >
                                <span className={styles.regionName}>
                                    {r.name}
                                    <span className={styles.regionCount}>
                                        {trekCount(r.value)} treks
                                    </span>
                                </span>
                                <span className={styles.regionBlurb}>{r.blurb}</span>
                                <span className={styles.regionArrow} aria-hidden="true">
                                    &rarr;
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================================================
                8 · QUOTE
                ============================================================ */}
            <section className={styles.quote}>
                <div className={styles.quoteMedia}>
                    <Image
                        src="/images/everest.jpg"
                        alt="The Everest massif above a sea of clouds"
                        fill
                        sizes="100vw"
                        className={styles.quoteImg}
                        loading="lazy"
                    />
                    <div className={styles.quoteScrim} aria-hidden="true" />
                </div>
                <div className={`wrap reveal ${styles.quoteWrap}`} id="quote-reveal">
                    <blockquote className={styles.quoteBlock}>
                        <span className={styles.quoteMark} aria-hidden="true">
                            &ldquo;
                        </span>
                        <p>
                            I grew up in Khumbu. My father was a porter, my
                            brother is a guide. When I lead a group to Everest
                            Base Camp, I&rsquo;m not showing them a trail — I&rsquo;m
                            showing them the valley I was raised in.
                        </p>
                        <footer className={styles.quoteFooter}>
                            <span className={styles.quoteAvatar} aria-hidden="true">
                                PS
                            </span>
                            <strong>Pemba Sherpa</strong>
                            <span>Head Trek Leader, Khumbu</span>
                        </footer>
                    </blockquote>
                </div>
            </section>

            {/* ============================================================
                9 · TEAM
                ============================================================ */}
            <section className={styles.team}>
                <div className="wrap reveal" id="team-reveal">
                    <div className={styles.sectionHead}>
                        <div className="sec-eyebrow">The Team</div>
                        <h2>Trek leaders, not tour operators.</h2>
                        <p>
                            A handful of the guides who&rsquo;ll be on the trail
                            with you — plus forty more behind them.
                        </p>
                    </div>
                    <div className={styles.teamGrid}>
                        {GUIDES.map((m) => (
                            <article key={m.name} className={styles.teamCard}>
                                <div className={styles.teamAvatar}>
                                    {m.image ? (
                                        <Image
                                            src={m.image}
                                            alt={`Portrait of ${m.name}`}
                                            fill
                                            sizes="160px"
                                            className={styles.teamAvatarImg}
                                        />
                                    ) : (
                                        <span className={styles.teamAvatarInitials}>
                                            {initials(m.name)}
                                        </span>
                                    )}
                                </div>
                                <h3>{m.name}</h3>
                                <span className={styles.teamRole}>{m.role}</span>
                                {m.bio && <p className={styles.teamBio}>{m.bio}</p>}
                            </article>
                        ))}
                        <Link href="/contact" className={styles.teamJoin}>
                            <span className={styles.joinPlus} aria-hidden="true">
                                +
                            </span>
                            <h3>Join the team</h3>
                            <p>
                                We&rsquo;re always looking for licensed Nepali
                                guides to grow the group.
                            </p>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ============================================================
                10 · CTA
                ============================================================ */}
            <section className={styles.cta}>
                <div className="wrap reveal" id="cta-reveal">
                    <h2>Ready to walk these trails with us?</h2>
                    <p>
                        Tell us your dates and group size — a trek expert replies
                        within 24 hours with a day-by-day plan.
                    </p>
                    <div className={styles.ctaActions}>
                        <Link href="/book" className="btn btn-primary">
                            Plan My Trek
                        </Link>
                        <Link href="/contact" className="btn btn-ghost">
                            Ask a Question
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
