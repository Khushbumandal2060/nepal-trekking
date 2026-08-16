import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FaqList from "@/components/FaqList";
import JsonLd from "@/components/JsonLd";
import TrekHero from "@/components/TrekHero";
import SectionHead from "@/components/trek/SectionHead";
import HighlightCards from "@/components/trek/HighlightCards";
import ItineraryAccordion from "@/components/trek/ItineraryAccordion";
import RouteMap from "@/components/trek/RouteMap";
import PackingList from "@/components/trek/PackingList";
import BmiCalculator from "@/components/trek/BmiCalculator";
import StickyCta from "@/components/trek/StickyCta";
import RelatedTreks from "@/components/trek/RelatedTreks";
import TrekSubNav from "@/components/trek/TrekSubNav";
import TrekGallery, { type GalleryImage } from "@/components/trek/TrekGallery";
import { treks } from "@/data/treks";
import { GUIDES, TESTIMONIALS } from "@/data/trek-people";
import { trekVideo } from "@/data/trek-videos";
import { getPublicTrek } from "@/lib/treks-db";
import { computeElevationPoints, maxAltitudeNumber } from "@/lib/treks";
import type {
    AcclimatizationStop,
    Testimonial,
    Trek,
    TrekGuide,
    TrekPricingRow,
} from "@/lib/types";
import {
    breadcrumbJsonLd,
    buildMetadata,
    faqPageJsonLd,
    trekProductJsonLd,
    truncate,
} from "@/lib/seo";

interface TrekDetailPageProps {
    params: Promise<{ slug: string }>;
}

// Render on demand so admin-created treks (stored in the DB) resolve without a
// rebuild and edits appear immediately.
export const dynamic = "force-dynamic";

export async function generateMetadata({
    params,
}: TrekDetailPageProps): Promise<Metadata> {
    const { slug } = await params;
    const trek = await getPublicTrek(slug);
    if (!trek) {
        return { title: "Trek Not Found" };
    }
    return buildMetadata({
        title: trek.name,
        description: truncate(trek.overview, 160),
        path: `/treks/${trek.slug}`,
        type: "article",
        image: trek.image,
    });
}

export function generateStaticParams() {
    return treks.map((t) => ({ slug: t.slug }));
}

/* ============================================================
   DERIVATION HELPERS
   Every section works for ANY trek, not just the curated ones.
   Optional fields set via the admin editor take priority; when
   absent, content is derived from real `Trek` fields (never
   invented prices, itineraries or policies).
   ============================================================ */

/** Items in the "included" list that match a topic (accommodation, meals…). */
function includedMatching(trek: Trek, pattern: RegExp): string[] {
    return trek.included.filter((s) => pattern.test(s));
}

function pricingFor(trek: Trek): TrekPricingRow[] {
    if (trek.pricing && trek.pricing.length > 0) return trek.pricing;
    return [{ label: "From price, per person", price: trek.price }];
}

function acclimatizationFor(trek: Trek): AcclimatizationStop[] {
    if (trek.acclimatization && trek.acclimatization.length > 0) {
        return trek.acclimatization;
    }
    return trek.itinerary
        .map((d, i) => ({ day: i + 1, title: d.t, note: d.d }))
        .filter((s) => /acclimat/i.test(s.title));
}

function howToReachFor(trek: Trek): string[] {
    if (trek.howToReach && trek.howToReach.length > 0) return trek.howToReach;
    return [
        `This trek starts from ${trek.startPoint}.`,
        trek.endingPoint
            ? `The trek finishes back in ${trek.endingPoint}.`
            : "Full transport details are confirmed with your booking pack.",
    ];
}

function accommodationFor(trek: Trek): string[] {
    if (trek.accommodation && trek.accommodation.length > 0) {
        return trek.accommodation;
    }
    const derived = includedMatching(
        trek,
        /(teahouse|hotel|lodge|camp|accommodation)/i
    );
    return derived.length > 0
        ? derived
        : [
            "Accommodation is arranged for every night of the trek as part of the package.",
            "Your guide confirms each night's stay ahead of arrival — see the full list in your booking confirmation.",
        ];
}

function foodFor(trek: Trek): string[] {
    if (trek.food && trek.food.length > 0) return trek.food;
    const derived = includedMatching(trek, /(meal|breakfast|lunch|dinner|food)/i);
    return derived.length > 0
        ? derived
        : [
            "Meals on the trek are arranged as part of the package — see the included list.",
            "Your guide will point out the local teahouse menu so you can eat well at altitude.",
        ];
}

function permitsFor(trek: Trek): string[] {
    if (trek.permits && trek.permits.length > 0) return trek.permits;
    const derived = includedMatching(trek, /(permit|TIMS|National Park|entry fee)/i);
    return derived.length > 0
        ? derived
        : [
            "All required trekking permits are arranged in-house before you arrive.",
            "The exact permit list for this route is confirmed with your booking pack.",
        ];
}

function reviewsFor(trek: Trek): Testimonial[] {
    if (trek.reviews && trek.reviews.length > 0) return trek.reviews;
    const key = trek.name.toLowerCase().replace(/ trek$/i, "").trim();
    return TESTIMONIALS.filter((r) => {
        const rt = r.trek.toLowerCase();
        return rt === trek.name.toLowerCase() || rt.includes(key);
    });
}

function guidesFor(trek: Trek): TrekGuide[] {
    if (trek.guides && trek.guides.length > 0) return trek.guides;
    const byRegion = GUIDES.filter((g) => g.region === trek.region);
    if (byRegion.length > 0) return byRegion;
    return GUIDES.filter((g) => g.region === "kathmandu");
}

/** Photos for the gallery section. Curated `trek.gallery` photos (real,
 *  trek-relevant downloaded images) win; short galleries are topped up with the
 *  trek's own photo, then other treks from the same region and, when needed, the
 *  wider Himalaya — so every trek always gets a full gallery. */
function galleryFor(trek: Trek, allTreks: Trek[]): GalleryImage[] {
    const seen = new Set<string>();
    const items: GalleryImage[] = [];

    const push = (src: string, alt: string, caption?: string) => {
        if (items.length >= 8 || seen.has(src)) return;
        seen.add(src);
        items.push({ src, alt, caption });
    };

    // 1. Curated gallery images first (real trek-relevant photos).
    (trek.gallery ?? []).forEach((src, i) =>
        push(
            src,
            `${trek.name} — gallery photo ${i + 1}`,
            i === 0 ? `Scenes from ${trek.regionLabel}` : undefined
        )
    );

    // 2. Top up short galleries with the trek's own photo, then region-mates
    //    (same region = related places), then the wider Himalaya.
    if (items.length < 8) {
        const byRegion = (a: Trek, b: Trek) =>
            Number(b.region === trek.region) - Number(a.region === trek.region);

        push(trek.image, `${trek.name} — Nepal Himalaya`, `Scenes from ${trek.regionLabel}`);
        allTreks
            .slice()
            .sort(byRegion)
            .forEach((t) =>
                push(
                    t.image,
                    `${t.name} — Nepal Himalaya`,
                    t.region === trek.region && t.slug !== trek.slug
                        ? `More from ${trek.regionLabel}`
                        : undefined
                )
            );
    }

    return items;
}

/* Site-wide, clearly generic content used when a trek has no curated entry.
   These are standard guidance — never presented as this trek's prices or policy. */
const DEFAULT_FITNESS = [
    "Build up to five or six hours of walking on consecutive days before you arrive.",
    "Add stairs or steep hills to your training — most trek days involve real climbing.",
    "Your guide sets the pace for the whole group and never hurries you uphill.",
    "A reasonable base level of fitness is enough to start; the route is designed to be walked, not raced.",
];

const DEFAULT_SAFETY = [
    "Trekking insurance covering high-altitude walking and emergency helicopter evacuation is required on every departure.",
    "Your guide carries a first-aid kit and follows a clear emergency and evacuation plan.",
    "If you feel unwell at altitude, tell your guide immediately — descending is always the first response.",
    "Acclimatization days are built into the itinerary so your body adjusts before the highest walking days.",
];

/* Derived from the real "How it works" steps on the homepage — no invented terms. */
const DEFAULT_CANCELLATION = [
    "Reserve your departure with a 20% deposit.",
    "The balance is due 30 days before your arrival in Nepal.",
    "Date changes are free up to 30 days before departure.",
    "Full terms are confirmed in writing with your booking confirmation and signed booking form.",
];

/** Jump-links shown in the sticky sub-navigation. */
const SUBNAV_LINKS = [
    { id: "overview", label: "Overview" },
    { id: "highlights", label: "Highlights" },
    { id: "gallery", label: "Gallery" },
    { id: "itinerary", label: "Itinerary" },
    { id: "route", label: "Route" },
    { id: "pricing", label: "Pricing" },
    { id: "packing", label: "Packing" },
    { id: "reviews", label: "Reviews" },
    { id: "faq", label: "FAQ" },
];

function Stars() {
    return (
        <span className="stars" aria-label="Rated 5 out of 5">
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span>★</span>
        </span>
    );
}

export default async function TrekDetailPage({
    params,
}: TrekDetailPageProps) {
    const { slug } = await params;
    const t = await getPublicTrek(slug);
    if (!t) {
        notFound();
    }

    const points = computeElevationPoints(t.itinerary, t.altitude);
    const video = trekVideo(t);
    const maxAlt = maxAltitudeNumber(t.altitude);

    const pricing = pricingFor(t);
    const acclim = acclimatizationFor(t);
    const howToReach = howToReachFor(t);
    const accommodation = accommodationFor(t);
    const food = foodFor(t);
    const permits = permitsFor(t);
    const fitness = t.fitness && t.fitness.length > 0 ? t.fitness : DEFAULT_FITNESS;
    const safety =
        t.healthSafety && t.healthSafety.length > 0 ? t.healthSafety : DEFAULT_SAFETY;
    const policy =
        t.cancellationPolicy && t.cancellationPolicy.length > 0
            ? t.cancellationPolicy
            : DEFAULT_CANCELLATION;
    const reviews = reviewsFor(t);
    const guides = guidesFor(t);
    const gallery = galleryFor(t, treks);

    return (
        <>
            <JsonLd
                data={[
                    trekProductJsonLd(t),
                    faqPageJsonLd(t.faqs),
                    breadcrumbJsonLd([
                        { name: "Home", path: "/" },
                        { name: "All Nepal Treks", path: "/treks" },
                        { name: t.name, path: `/treks/${t.slug}` },
                    ]),
                ]}
            />

            {/* 1 — Hero */}
            <TrekHero trek={t} video={video} />

            {/* Optional video, when the trek or its region has one */}
            {video && (
                <section className="sec-block" id="video">
                    <div className="wrap reveal" style={{ maxWidth: 980 }}>
                        <SectionHead
                            eyebrow="Watch the Trail"
                            title={`See ${t.name} in motion`}
                            center
                        />
                        <div className="video-embed">
                            <iframe
                                src={`https://www.youtube-nocookie.com/embed/${video}`}
                                title={`${t.name} trek video`}
                                loading="lazy"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                referrerPolicy="strict-origin-when-cross-origin"
                            />
                        </div>
                    </div>
                </section>
            )}

            {/* 2 — Sticky in-page navigation */}
            <TrekSubNav links={SUBNAV_LINKS} />

            <div className="td-main">
                <div className="wrap td-layout">
                    {/* ---- Main content column ---- */}
                    <div className="td-content">
                        {/* 3 — Overview */}
                        <section className="sec-block" id="overview">
                            <SectionHead
                                eyebrow="Trek Overview"
                                title={`About the ${t.name}`}
                            />
                            <p className="overview-lede">{t.overview}</p>
                            <div className="stat-strip">
                                <div className="stat-card">
                                    <span className="stat-label">Duration</span>
                                    <strong>{t.days}</strong>
                                    <span className="stat-unit">Days</span>
                                </div>
                                <div className="stat-card">
                                    <span className="stat-label">Difficulty</span>
                                    <strong>{t.grade}</strong>
                                    <span className="stat-unit">Grade</span>
                                </div>
                                <div className="stat-card">
                                    <span className="stat-label">Max altitude</span>
                                    <strong>{t.altitude.split("/")[0].trim()}</strong>
                                    <span className="stat-unit">Peak</span>
                                </div>
                                {t.bestSeason && (
                                    <div className="stat-card">
                                        <span className="stat-label">Best time</span>
                                        <strong>{t.bestSeason.split(" ")[0]}</strong>
                                        <span className="stat-unit">Season</span>
                                    </div>
                                )}
                                <div className="stat-card">
                                    <span className="stat-label">From</span>
                                    <strong>{t.price}</strong>
                                    <span className="stat-unit">Per person</span>
                                </div>
                            </div>
                        </section>

                        {/* 4 — Highlights */}
                        <section className="sec-block" id="highlights">
                            <SectionHead
                                eyebrow="Highlights"
                                title="Why trekkers choose this route"
                            />
                            <HighlightCards highlights={t.highlights} />
                        </section>

                        {/* 5 — Photo Gallery */}
                        {gallery.length >= 3 && (
                            <section className="sec-block" id="gallery">
                                <SectionHead
                                    eyebrow="Photo Gallery"
                                    title="Scenes from the trail & the Himalaya"
                                    lead="A glimpse of the places this route passes through — tap any photo to view it full screen."
                                />
                                <TrekGallery images={gallery} trekName={t.name} />
                            </section>
                        )}

                        {/* 6 — Quick Facts */}
                        <section className="sec-block" id="facts">
                            <SectionHead
                                eyebrow="Quick Facts"
                                title="Everything you need to know at a glance"
                            />
                            <div className="quick-facts-grid">
                                <div className="qf-tile">
                                    <span className="qf-k">Duration</span>
                                    <span className="qf-v">{t.days} Days</span>
                                </div>
                                <div className="qf-tile">
                                    <span className="qf-k">Grade</span>
                                    <span className="qf-v">{t.grade}</span>
                                </div>
                                <div className="qf-tile">
                                    <span className="qf-k">Max Altitude</span>
                                    <span className="qf-v">{t.altitude}</span>
                                </div>
                                <div className="qf-tile">
                                    <span className="qf-k">Starts From</span>
                                    <span className="qf-v">{t.startPoint}</span>
                                </div>
                                <div className="qf-tile">
                                    <span className="qf-k">Best Months</span>
                                    <span className="qf-v">{t.bestMonths}</span>
                                </div>
                                <div className="qf-tile">
                                    <span className="qf-k">Group Size</span>
                                    <span className="qf-v">{t.groupSize}</span>
                                </div>
                                {t.endingPoint && (
                                    <div className="qf-tile">
                                        <span className="qf-k">Ending Point</span>
                                        <span className="qf-v">{t.endingPoint}</span>
                                    </div>
                                )}
                                <div className="qf-tile">
                                    <span className="qf-k">From</span>
                                    <span className="qf-v">{t.price} pp</span>
                                </div>
                            </div>
                        </section>

                        {/* 7 — Day-by-Day Itinerary */}
                        <section className="sec-block" id="itinerary">
                            <SectionHead
                                eyebrow="Day by Day"
                                title="Full itinerary"
                                lead="Tap any day to expand it. Altitude and walking time are shown for every stage."
                            />
                            <ItineraryAccordion days={t.itinerary} />
                        </section>

                        {/* 8 — Acclimatization */}
                        {acclim.length > 0 && (
                            <section className="sec-block" id="acclimatization">
                                <SectionHead
                                    eyebrow="Acclimatization"
                                    title="Climb high, sleep low"
                                    lead="Dedicated stops help your body adjust before the highest walking days."
                                />
                                <div className="acclim-grid">
                                    {acclim.map((a) => (
                                        <article
                                            key={`${a.day}-${a.title}`}
                                            className="acclim-card reveal"
                                        >
                                            <span className="acclim-day">
                                                Day {a.day}
                                            </span>
                                            <h3>{a.title}</h3>
                                            <p>{a.note}</p>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* 9 — Route Map */}
                        <section className="sec-block" id="route">
                            <SectionHead
                                eyebrow="Route"
                                title="The route, from start to summit"
                                lead="A profile of the trail showing how altitude builds across the trek."
                            />
                            <RouteMap
                                itinerary={t.itinerary}
                                maxAltitude={t.altitude}
                                startPoint={t.startPoint}
                                endingPoint={t.endingPoint}
                            />
                        </section>

                        {/* 10 — Altitude Profile */}
                        <section className="sec-block" id="altitude">
                            <SectionHead
                                eyebrow="Altitude Profile"
                                title="The climb, day by day"
                            />
                            {points ? (
                                <div className="elevation-chart elevation-chart--detail">
                                    <svg
                                        viewBox="0 0 1100 260"
                                        xmlns="http://www.w3.org/2000/svg"
                                        role="img"
                                        aria-label={`Altitude profile for ${t.name}, peaking at ${t.altitude}`}
                                    >
                                        <defs>
                                            <linearGradient
                                                id="elevFill"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="0%"
                                                    stopColor="var(--ice)"
                                                    stopOpacity="0.35"
                                                />
                                                <stop
                                                    offset="100%"
                                                    stopColor="var(--ice)"
                                                    stopOpacity="0.03"
                                                />
                                            </linearGradient>
                                        </defs>
                                        <polygon
                                            points={`20,260 ${points} 1080,260`}
                                            fill="url(#elevFill)"
                                        />
                                        <polyline
                                            points={points}
                                            fill="none"
                                            stroke="#D9662C"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            vectorEffect="non-scaling-stroke"
                                        />
                                        <text
                                            x="20"
                                            y="20"
                                            className="elevation-label"
                                        >
                                            {t.altitude}
                                        </text>
                                    </svg>
                                </div>
                            ) : (
                                <p className="muted">
                                    A profile is available once the itinerary includes
                                    altitude details.
                                </p>
                            )}
                        </section>

                        {/* 11 — How to Reach */}
                        <section className="sec-block" id="getting-there">
                            <SectionHead
                                eyebrow="Getting There"
                                title="How to reach the trailhead"
                            />
                            <ul className="reach-list">
                                {howToReach.map((step, i) => (
                                    <li key={step} className="reach-item reveal">
                                        <span className="reach-num">
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <p>{step}</p>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* 12 — Accommodation */}
                        <section className="sec-block" id="accommodation">
                            <SectionHead
                                eyebrow="Accommodation"
                                title="Where you stay on the trail"
                            />
                            <ul className="info-list">
                                {accommodation.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </section>

                        {/* 13 — Food & Meals */}
                        <section className="sec-block" id="food">
                            <SectionHead eyebrow="Food & Meals" title="Eating well at altitude" />
                            <ul className="info-list">
                                {food.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </section>

                        {/* 14 — Permits */}
                        <section className="sec-block" id="permits">
                            <SectionHead
                                eyebrow="Permits"
                                title="Paperwork & permits"
                            />
                            <ul className="info-list">
                                {permits.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </section>

                        {/* 15 — Cost & Pricing */}
                        <section className="sec-block" id="pricing">
                            <SectionHead
                                eyebrow="Cost & Pricing"
                                title="What this trek costs"
                            />
                            <div className="pricing-table">
                                {pricing.map((row) => (
                                    <div className="pricing-row" key={row.label}>
                                        <div className="pricing-label">
                                            <strong>{row.label}</strong>
                                            {row.note && <p>{row.note}</p>}
                                        </div>
                                        <div className="pricing-price">{row.price}</div>
                                    </div>
                                ))}
                            </div>
                            <p className="pricing-note">
                                Prices are per person and confirmed in writing at
                                enquiry. Nothing is charged until you accept a written
                                quote.
                            </p>
                        </section>

                        {/* 16 — Inclusions / Exclusions */}
                        <section className="sec-block" id="includes">
                            <SectionHead
                                eyebrow="What’s Included"
                                title="Included & not included"
                            />
                            <div className="include-grid">
                                <div>
                                    <h4 className="include-title yes">Included</h4>
                                    <ul className="include-list yes">
                                        {t.included.map((item) => (
                                            <li key={item}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="include-title no">Not Included</h4>
                                    <ul className="include-list no">
                                        {t.excluded.map((item) => (
                                            <li key={item}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* 18 — Trek Essentials / Packing List */}
                        <section className="sec-block" id="packing">
                            <SectionHead
                                eyebrow="Trek Essentials"
                                title="What to pack"
                            />
                            <PackingList categories={t.packingList} trekName={t.name} />
                        </section>

                        {/* 19 — Fitness & BMI */}
                        <section className="sec-block" id="fitness">
                            <SectionHead
                                eyebrow="Fitness & Preparation"
                                title="Get trek-fit before you go"
                                lead="A little structured training makes the difference between surviving and enjoying the trail."
                            />
                            <div className="fitness-grid">
                                <ul className="info-list">
                                    {fitness.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                                <BmiCalculator />
                            </div>
                        </section>

                        {/* 20 — Health & Safety */}
                        <section className="sec-block" id="safety">
                            <SectionHead eyebrow="Health & Safety" title="Staying safe at altitude" />
                            <ul className="info-list">
                                {safety.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </section>

                        {/* 21 — FAQ */}
                        <section className="sec-block" id="faq">
                            <SectionHead
                                eyebrow="Good to Know"
                                title="Questions about this trek"
                            />
                            <div style={{ maxWidth: 820 }}>
                                <FaqList faqs={t.faqs} />
                            </div>
                        </section>

                        {/* 22 — Cancellation / Refund Policy */}
                        <section className="sec-block" id="cancellation">
                            <SectionHead
                                eyebrow="Booking & Cancellation"
                                title="Cancellation and refund policy"
                            />
                            <ul className="policy-list">
                                {policy.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </section>
                    </div>

                    {/* ---- Sticky sidebar ---- */}
                    <aside className="td-side">
                        <StickyCta trek={t} />
                    </aside>
                </div>
            </div>

            {/* 23 — Reviews / Testimonials */}
            {reviews.length > 0 && (
                <section className="sec-block sec-block--band" id="reviews">
                    <div className="wrap reveal">
                        <SectionHead
                            eyebrow="Reviews"
                            title="What trekkers say"
                            center
                        />
                        <div className="reviews-grid">
                            {reviews.map((r) => (
                                <article key={r.name} className="review-card reveal">
                                    <Stars />
                                    <blockquote>“{r.quote}”</blockquote>
                                    <footer>
                                        <strong>{r.name}</strong>
                                        <span>{r.trek}</span>
                                    </footer>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* 24 — Your Local Guide */}
            {guides.length > 0 && (
                <section className="sec-block" id="guide">
                    <div className="wrap reveal">
                        <SectionHead
                            eyebrow="Your Local Guide"
                            title="Led by people who call these mountains home"
                            lead="Every departure is led or supervised by one of our licensed local trek leaders."
                            center
                        />
                        <div className="guide-grid">
                            {guides.map((g) => (
                                <article key={g.name} className="guide-card reveal">
                                    {g.image && (
                                        <div className="guide-media">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={g.image}
                                                alt={g.name}
                                                loading="lazy"
                                            />
                                        </div>
                                    )}
                                    <div className="guide-body">
                                        <h3>{g.name}</h3>
                                        <p className="guide-role">{g.role}</p>
                                        {g.bio && <p className="guide-bio">{g.bio}</p>}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* 25 — Related Treks */}
            <section className="sec-block sec-block--band" id="related">
                <div className="wrap reveal">
                    <SectionHead
                        eyebrow="Keep Exploring"
                        title="You may also like"
                        center
                    />
                    <RelatedTreks trek={t} />
                </div>
            </section>

            {/* Spacer so the fixed mobile CTA bar never covers the last section */}
            <div className="cta-spacer" aria-hidden="true" />
        </>
    );
}
