import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import FaqList from "@/components/FaqList";
import { getTrek, treks } from "@/data/treks";
import { computeElevationPoints } from "@/lib/treks";

interface TrekDetailPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({
    params,
}: TrekDetailPageProps): Promise<Metadata> {
    const { slug } = await params;
    const trek = getTrek(slug);
    if (!trek) {
        return { title: "Trek Not Found" };
    }
    return {
        title: trek.name,
        description: trek.overview,
    };
}

export function generateStaticParams() {
    return treks.map((t) => ({ slug: t.slug }));
}

export default async function TrekDetailPage({
    params,
}: TrekDetailPageProps) {
    const { slug } = await params;
    const t = getTrek(slug);
    if (!t) {
        notFound();
    }

    const points = computeElevationPoints(t.itinerary, t.altitude);

    return (
        <>
            <section className="page-hero">
                <div className="wrap">
                    <div className="eyebrow">{t.regionLabel}</div>
                    <h1>{t.name}</h1>
                    <p className="lede">{t.overview}</p>
                </div>
            </section>

            <section>
                <div className="wrap detail-top reveal">
                    <div>
                        <div className="sec-head" style={{ marginBottom: 36 }}>
                            <div className="sec-eyebrow">Route Highlights</div>
                            <h2 style={{ fontSize: 28 }}>Why trekkers choose this route</h2>
                        </div>
                        <ul className="value-list">
                            {t.highlights.map((h) => (
                                <li key={h}>{h}</li>
                            ))}
                        </ul>

                        <div
                            className="sec-head"
                            style={{ marginTop: 70, marginBottom: 20 }}
                        >
                            <div className="sec-eyebrow">Elevation Profile</div>
                            <h2 style={{ fontSize: 28 }}>The climb, day by day</h2>
                        </div>
                        <div
                            className="elevation-chart"
                            style={{
                                background: "var(--night)",
                                borderRadius: 4,
                                padding: "30px 20px 10px",
                            }}
                        >
                            <svg viewBox="0 0 1100 260" xmlns="http://www.w3.org/2000/svg">
                                <polyline
                                    points={points}
                                    fill="none"
                                    stroke="#D9662C"
                                    strokeWidth="2.5"
                                />
                            </svg>
                        </div>
                    </div>

                    <div className="quick-facts">
                        <h3 style={{ fontSize: 19, fontWeight: 500, marginBottom: 18 }}>
                            Quick Facts
                        </h3>
                        <div className="qf-row">
                            <span>Duration</span>
                            <span>{t.days} Days</span>
                        </div>
                        <div className="qf-row">
                            <span>Grade</span>
                            <span>{t.grade}</span>
                        </div>
                        <div className="qf-row">
                            <span>Max Altitude</span>
                            <span>{t.altitude}</span>
                        </div>
                        <div className="qf-row">
                            <span>Starts From</span>
                            <span>{t.startPoint}</span>
                        </div>
                        <div className="qf-row">
                            <span>Best Months</span>
                            <span>{t.bestMonths}</span>
                        </div>
                        <div className="qf-row">
                            <span>Group Size</span>
                            <span>{t.groupSize}</span>
                        </div>
                        <div className="qf-row">
                            <span>From</span>
                            <span>{t.price} pp</span>
                        </div>
                        <Link href={`/book?trek=${t.slug}`} className="btn btn-primary">
                            Book This Trek
                        </Link>
                    </div>
                </div>
            </section>

            <section style={{ background: "var(--panel)", paddingTop: 90 }}>
                <div className="wrap reveal">
                    <div className="sec-head">
                        <div className="sec-eyebrow">Day By Day</div>
                        <h2>Full itinerary</h2>
                    </div>
                    <div>
                        {t.itinerary.map((day, i) => (
                            <div className="itinerary-day" key={i}>
                                <div className="day-num">
                                    DAY {String(i + 1).padStart(2, "0")}
                                </div>
                                <div>
                                    <h4>{day.t}</h4>
                                    <p>{day.d}</p>
                                    <div className="day-meta">
                                        <span>Altitude: {day.alt}</span>
                                        <span>Walking time: {day.hrs}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section>
                <div className="wrap reveal">
                    <div className="sec-head">
                        <div className="sec-eyebrow">Cost Breakdown</div>
                        <h2>What's included</h2>
                    </div>
                    <div className="include-grid">
                        <div>
                            <h4>Included</h4>
                            <ul className="include-list yes">
                                {t.included.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4>Not Included</h4>
                            <ul className="include-list no">
                                {t.excluded.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section style={{ background: "var(--panel)" }}>
                <div className="wrap reveal" style={{ maxWidth: 820 }}>
                    <div className="sec-head">
                        <div className="sec-eyebrow">Good to Know</div>
                        <h2>Questions about this trek</h2>
                    </div>
                    <FaqList faqs={t.faqs} />
                </div>
            </section>
        </>
    );
}
