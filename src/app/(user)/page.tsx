import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import HeroContours from "@/components/HeroContours";
import JsonLd from "@/components/JsonLd";
import TrekCard from "@/components/TrekCard";
import { treks } from "@/data/treks";
import { blogPosts } from "@/data/blog";
import { TESTIMONIALS } from "@/data/trek-people";
import { buildMetadata, itemListJsonLd } from "@/lib/seo";
import type { Trek } from "@/lib/types";

const POPULAR_SLUGS = [
    "everest-base-camp",
    "annapurna-base-camp",
    "manaslu-circuit",
    "langtang-valley",
    "upper-mustang",
    "poon-hill",
];

const PREMIUM_SLUGS = [
    "kanchenjunga-base-camp",
    "upper-dolpo",
    "makalu-base-camp",
    "dhaulagiri-circuit",
    "everest-three-passes",
    "nar-phu-valley",
];

const DESTINATIONS: {
    value: string;
    name: string;
    tag: string;
    desc: string;
}[] = [
        {
            value: "khumbu",
            name: "Khumbu",
            tag: "Everest Region",
            desc: "Sherpa villages, glacier moraines and the world's highest peak — the classic high-Himalaya trekking zone.",
        },
        {
            value: "annapurna",
            name: "Annapurna",
            tag: "Central Nepal",
            desc: "From jungle-floored Modi Khola valleys to the high Thorong La pass, with Pokhara as the natural base.",
        },
        {
            value: "langtang",
            name: "Langtang",
            tag: "North of Kathmandu",
            desc: "Rhododendron forests and Tamang villages a short drive from the capital — our easiest true mountain escape.",
        },
        {
            value: "manaslu",
            name: "Manaslu",
            tag: "Restricted Area",
            desc: "A permit-controlled circuit around the eighth-highest peak, past gompas, gorges and far fewer trekkers.",
        },
        {
            value: "mustang",
            name: "Mustang",
            tag: "Tibetan Plateau",
            desc: "Wind-carved canyons and walled Tibetan towns on the rain-shadowed plateau north of the Annapurnas.",
        },
        {
            value: "kanchenjunga",
            name: "Kanchenjunga",
            tag: "Far Eastern Nepal",
            desc: "Remote base camps at the foot of the world's third-highest peak, far from the crowds of the central Himalaya.",
        },
    ];

const WHY = [
    { n: "01", t: "Eight of the world's 8,000m peaks", d: "Everest, Kanchenjunga, Makalu, Lhotse, Cho Oyu, Dhaulagiri, Manaslu and Annapurna — no other country puts this many giants within reach of a single trek." },
    { n: "02", t: "Licensed local guides, not contractors", d: "Every trek leader is licensed by Nepal's Ministry of Culture, Tourism & Civil Aviation and lives in the valley they guide." },
    { n: "03", t: "Permits handled in-house", d: "TIMS, park and conservation fees, and restricted-area permits for Manaslu, Upper Mustang and Kanchenjunga are arranged before you land." },
    { n: "04", t: "A teahouse on almost every trail", d: "From Lukla to Lo Manthang, the lodge network means real beds, hot meals and warm hosts — no camping needed on classic routes." },
    { n: "05", t: "Acclimatization built into every high route", d: "Itineraries above 3,500m carry dedicated rest days as the default plan, not an upsell, so you reach the summit feeling strong." },
    { n: "06", t: "Trekking that gives back to the hills", d: "We work with the same family-run lodges and porter crews season after season and pay above the regional minimum." },
];

const STEPS = [
    { n: "Step 01", t: "Send an enquiry", d: "Tell us your dates, route and group size through the booking form or a quick email — we read everything ourselves." },
    { n: "Step 02", t: "Get a tailored plan", d: "A trek expert replies within 24 hours with a day-by-day itinerary, clear pricing and a full permit checklist." },
    { n: "Step 03", t: "Reserve your spot", d: "Hold your departure with a 20% deposit. The balance is due 30 days before you fly — free date changes up to then." },
    { n: "Step 04", t: "We handle the rest", d: "Permits, lodges, guides, porters and meals are arranged before you land. All you do is walk." },
];

export const metadata: Metadata = buildMetadata({
    title: "Everest, Annapurna & Nepal Treks — Guided & Custom",
    description:
        "Guided trekking holidays across Nepal with a Kathmandu-based team — Everest Base Camp, Annapurna, Manaslu, Langtang, Mustang and Kanchenjunga. Fixed departures and private treks since 2013.",
    path: "/",
});

export default function HomePage() {
    const popular = POPULAR_SLUGS.map((slug) =>
        treks.find((t) => t.slug === slug)
    ).filter((t): t is Trek => Boolean(t));
    const premium = PREMIUM_SLUGS.map((slug) =>
        treks.find((t) => t.slug === slug)
    ).filter((t): t is Trek => Boolean(t));
    const regionCount = new Set(treks.map((t) => t.region)).size;

    return (
        <>
            <JsonLd
                data={itemListJsonLd(
                    popular.map((t) => ({
                        name: `${t.name} Trek`,
                        path: `/treks/${t.slug}`,
                    }))
                )}
            />
            <section className="hero">
                <HeroContours />
                <Image
                    className="hero-image"
                    src="/images/home.jpg"
                    alt="A trekker stands on a ridge above a sea of clouds in the Nepali Himalaya"
                    fill
                    priority
                    sizes="100vw"
                />
                <div className="hero-scrim" aria-hidden="true" />
                <div className="wrap hero-content">
                    <div className="eyebrow">Based in Kathmandu &middot; Nepal treks only</div>
                    <h1>
                        Every trail we run <em>starts and ends</em> in Nepal.
                    </h1>
                    <p className="lede">
                        No multi-country packages, no side ventures. Just Everest,
                        Annapurna, Manaslu, Langtang, Mustang, Kanchenjunga, Dolpo,
                        Makalu, Dhaulagiri, the far-western Karnali and Ganesh Himal &mdash;
                        run by guides who trek these valleys year-round.
                    </p>
                    <div className="hero-actions">
                        <Link href="/treks" className="btn btn-primary">
                            Browse Nepal Treks
                        </Link>
                        <Link href="/contact" className="btn btn-ghost">
                            Talk to a Trek Expert
                        </Link>
                    </div>
                    <div className="hero-meta">
                        <div>
                            <span className="num">{treks.length}</span>
                            <span className="lbl">Nepal Treks</span>
                        </div>
                        <div>
                            <span className="num">{regionCount}</span>
                            <span className="lbl">Regions Covered</span>
                        </div>
                        <div>
                            <span className="num">12+</span>
                            <span className="lbl">Years in Nepal</span>
                        </div>
                        <div>
                            <span className="num">1:8</span>
                            <span className="lbl">Guide Ratio</span>
                        </div>
                    </div>
                </div>
                <div className="scroll-cue" aria-hidden="true" />
            </section>

            {/* 1 · POPULAR TREKS CAROUSEL */}
            <section className="trek-carousel-section">
                <div className="wrap reveal">
                    <div className="sec-head">
                        <div className="sec-eyebrow">Popular Treks</div>
                        <h2>The routes everyone asks for first.</h2>
                        <p>
                            Everest, Annapurna and the classics &mdash; the departures
                            that fill up fastest every season.
                        </p>
                    </div>
                    <div className="trek-carousel">
                        {popular.map((t) => (
                            <TrekCard key={t.slug} trek={t} />
                        ))}
                    </div>
                    <div className="sec-more">
                        <Link href="/treks" className="sec-link">
                            View all Nepal treks &rarr;
                        </Link>
                    </div>
                </div>
            </section>

            {/* 2 · PREMIUM TRIPS */}
            <section className="premium-section">
                <div className="wrap reveal">
                    <div className="sec-head">
                        <div className="sec-eyebrow">Premium Trips</div>
                        <h2>Remote, restricted and expedition-grade.</h2>
                        <p>
                            For trekkers who want the Himalaya beyond the classics
                            &mdash; restricted-area routes with special permits arranged
                            in-house before you land.
                        </p>
                    </div>
                    <div className="premium-grid">
                        {premium.map((t) => (
                            <Link
                                key={t.slug}
                                href={`/treks/${t.slug}`}
                                className="premium-card"
                            >
                                <div className="premium-art">
                                    <Image
                                        className="premium-art-img"
                                        src={t.image}
                                        alt={t.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        loading="lazy"
                                    />
                                    <span className="premium-tag">
                                        {t.regionLabel.split(",")[0]}
                                    </span>
                                </div>
                                <div className="premium-body">
                                    <h3>{t.name}</h3>
                                    <div className="premium-meta">
                                        <span>{t.days} days</span>
                                        <span>{t.altitude.split("/")[0].trim()}</span>
                                        <span>{t.grade}</span>
                                    </div>
                                    <span className="premium-link">
                                        View Expedition &rarr;
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3 · DESTINATION CARDS */}
            <section className="dest-section">
                <div className="wrap reveal">
                    <div className="sec-head">
                        <div className="sec-eyebrow">Destinations</div>
                        <h2>Pick a region, we know it trail by trail.</h2>
                        <p>
                            Each of Nepal&rsquo;s trekking regions has its own character
                            &mdash; from Sherpa villages to wind-carved Tibetan plateaus.
                        </p>
                    </div>
                    <div className="dest-grid">
                        {DESTINATIONS.map((d) => {
                            const count = treks.filter(
                                (t) => t.region === d.value
                            ).length;
                            return (
                                <Link
                                    key={d.value}
                                    href={`/treks?region=${d.value}`}
                                    className="dest-card"
                                >
                                    <div className="dest-count">
                                        {count} {count === 1 ? "trek" : "treks"}
                                    </div>
                                    <h3>{d.name}</h3>
                                    <p className="dest-tag">{d.tag}</p>
                                    <p className="dest-desc">{d.desc}</p>
                                    <span className="dest-link">
                                        Explore {d.name} &rarr;
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 4 · WHY CHOOSE US */}
            <section className="choose-section">
                <div className="wrap reveal">
                    <div className="sec-head">
                        <div className="sec-eyebrow">Why Choose Us</div>
                        <h2>Trek with the people who live under the peaks.</h2>
                        <p>
                            Six reasons Nepal&rsquo;s own mountains are all we do
                            &mdash; and why that matters once you&rsquo;re on the trail.
                        </p>
                    </div>
                    <div className="why-nepal-grid">
                        {WHY.map((w) => (
                            <div key={w.n} className="why-nepal-card">
                                <div className="why-nepal-num">{w.n}</div>
                                <h3>{w.t}</h3>
                                <p>{w.d}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4.5 · HOW BOOKING WORKS */}
            <section className="steps-section">
                <div className="wrap reveal">
                    <div className="sec-head">
                        <div className="sec-eyebrow">How It Works</div>
                        <h2>From first email to first step on the trail.</h2>
                        <p>
                            Booking with us is a short, human process — no call centres,
                            no fine print. Four steps from enquiry to trek.
                        </p>
                    </div>
                    <div className="steps-grid">
                        {STEPS.map((s) => (
                            <div key={s.n} className="step-card">
                                <span className="step-num">{s.n}</span>
                                <h3>{s.t}</h3>
                                <p>{s.d}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5 · STATISTICS */}
            <section className="stats-section">
                <div className="wrap reveal">
                    <div className="sec-head">
                        <div className="sec-eyebrow">The Numbers</div>
                        <h2>Guiding Nepal since 2013.</h2>
                        <p>
                            What fifteen seasons of walking these valleys has added
                            up to.
                        </p>
                    </div>
                    <div className="milestones">
                        <div className="milestone">
                            <div className="num">9,400+</div>
                            <div className="lbl">Trekkers guided across Nepal</div>
                        </div>
                        <div className="milestone">
                            <div className="num">97.8%</div>
                            <div className="lbl">Departures completed as scheduled</div>
                        </div>
                        <div className="milestone">
                            <div className="num">40+</div>
                            <div className="lbl">Licensed Nepali guides on staff</div>
                        </div>
                        <div className="milestone">
                            <div className="num">4.8/5</div>
                            <div className="lbl">Average trekker rating</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6 · TESTIMONIALS */}
            <section className="testimonials-section">
                <div className="wrap reveal">
                    <div className="sec-head">
                        <div className="sec-eyebrow">Testimonials</div>
                        <h2>What trekkers remember most.</h2>
                        <p>
                            Real words from recent guests, straight off their
                            post-trek review forms.
                        </p>
                    </div>
                    <div className="testi-strip">
                        {TESTIMONIALS.map((t) => (
                            <div key={t.name} className="testi-card">
                                <div className="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                                <p>&ldquo;{t.quote}&rdquo;</p>
                                <div className="testi-who">
                                    <b>{t.name}</b>
                                    <span>{t.trek}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7 · BLOG SECTION */}
            <section className="blog-section">
                <div className="wrap reveal">
                    <div className="sec-head">
                        <div className="sec-eyebrow">From the Journal</div>
                        <h2>Guides&rsquo; notes from the trail.</h2>
                        <p>
                            Season updates, packing lists and honest answers to the
                            questions trekkers ask us most.
                        </p>
                    </div>
                    <div className="blog-grid">
                        {blogPosts.map((p) => (
                            <Link key={p.slug} href={p.href} className="blog-card">
                                <div className="blog-cat">{p.category}</div>
                                <h3>{p.title}</h3>
                                <p className="blog-excerpt">{p.excerpt}</p>
                                <div className="blog-meta">
                                    <span>{p.date}</span>
                                    <span>{p.read}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div className="sec-more">
                        <Link href="/blog" className="sec-link">
                            View all journal posts &rarr;
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
