/**
 * StickyCta — the persistent "Book / Enquire" trip summary.
 *
 * Desktop: a dark, premium "Trip Summary" card that sticks to the right rail
 * and follows the page. Mobile: a fixed bottom action bar with Book Now +
 * Enquire Now. Both use the real booking route (`/book?trek=slug`) and
 * contact route (`/contact`).
 *
 * WHATSAPP_NUMBER is intentionally a placeholder — there is no WhatsApp number
 * in the project's data yet, so the WhatsApp button only renders once a real
 * number is configured here (it must be a full international dialling format,
 * e.g. "9779812345678").
 */
"use client";

import { useEffect, useState } from "react";
import type { Trek } from "@/lib/types";

/** Full international number without "+" or spaces, e.g. "9779812345678". */
const WHATSAPP_NUMBER = "";

function bookHref(slug: string): string {
    return `/book?trek=${encodeURIComponent(slug)}`;
}

function enquireHref(name: string): string {
    return `/contact?subject=${encodeURIComponent(`Enquiry about ${name}`)}`;
}

export default function StickyCta({ trek }: { trek: Trek }) {
    const [copied, setCopied] = useState(false);

    // The mobile bar is a fixed element at the bottom of the viewport, so let
    // the global chatbot button know to sit above it.
    useEffect(() => {
        document.body.classList.add("has-cta-mobile");
        return () => document.body.classList.remove("has-cta-mobile");
    }, []);

    const copyLink = () => {
        navigator.clipboard?.writeText(window.location.href).then(
            () => {
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
            },
            () => setCopied(false)
        );
    };

    const book = bookHref(trek.slug);
    const enquire = enquireHref(trek.name);
    const waHref = WHATSAPP_NUMBER
        ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
            `Hi, I would like to ask about the ${trek.name}.`
        )}`
        : null;

    const facts = [
        { k: "Duration", v: `${trek.days} days` },
        { k: "Difficulty", v: trek.grade },
        { k: "Start", v: trek.startPoint },
        { k: "Max altitude", v: trek.altitude.split("/")[0].trim() },
        { k: "Best season", v: trek.bestSeason ?? trek.bestMonths },
        { k: "Group size", v: trek.groupSize },
    ];

    return (
        <>
            {/* Desktop sticky card */}
            <aside className="cta-card">
                <div className="cta-card-head">
                    <span className="cta-eyebrow">Trip Summary</span>
                    <div className="cta-price">
                        <span className="cta-from">From</span>
                        <strong>{trek.price}</strong>
                        <span className="cta-per">per person</span>
                    </div>
                </div>

                <dl className="cta-facts">
                    {facts.map((f) => (
                        <div key={f.k}>
                            <dt>{f.k}</dt>
                            <dd>{f.v}</dd>
                        </div>
                    ))}
                </dl>

                <ul className="cta-perks">
                    <li>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M20 6 9 17l-5-5" />
                        </svg>
                        Free date changes
                    </li>
                    <li>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M20 6 9 17l-5-5" />
                        </svg>
                        No booking fees
                    </li>
                    <li>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M20 6 9 17l-5-5" />
                        </svg>
                        Licensed local guides
                    </li>
                </ul>

                <div className="cta-buttons">
                    <a href={book} className="btn btn-primary btn-block">
                        Book This Trek
                    </a>
                    <a href={enquire} className="btn btn-ghost btn-block">
                        Ask a Question
                    </a>
                    {waHref && (
                        <a
                            href={waHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-whatsapp btn-block"
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.83 14.12c-.25.7-1.45 1.33-2.02 1.42-.52.08-1.17.11-1.89-.12-.44-.14-1-.32-1.71-.63-3.02-1.3-4.99-4.34-5.14-4.54-.15-.2-1.23-1.63-1.23-3.11 0-1.48.78-2.21 1.05-2.51.28-.3.6-.38.8-.38.2 0 .4 0 .57.01.19.01.43-.07.68.52.25.6.85 2.07.92 2.22.08.15.13.33.03.53-.1.2-.15.32-.3.5-.15.17-.31.39-.44.52-.15.15-.31.31-.13.61.18.3.8 1.32 1.71 2.14 1.18 1.06 2.17 1.39 2.48 1.55.31.15.49.13.67-.08.18-.2.77-.9.98-1.2.2-.3.4-.25.68-.15.28.1 1.75.83 2.05.98.3.15.5.22.57.35.08.13.08.72-.17 1.42z" />
                            </svg>
                            WhatsApp Us
                        </a>
                    )}
                </div>

                <button type="button" className="cta-copy" onClick={copyLink}>
                    {copied ? "Link copied ✓" : "Copy trek link"}
                </button>
            </aside>

            {/* Mobile fixed bottom bar */}
            <div className="cta-mobile-bar" role="region" aria-label="Book or enquire">
                <a href={book} className="cta-mobile-btn cta-mobile-btn--book">
                    Book Now
                </a>
                <a href={enquire} className="cta-mobile-btn cta-mobile-btn--enquire">
                    Enquire
                </a>
            </div>
        </>
    );
}
