/**
 * HighlightCards — the "Highlights" section of the trek detail page.
 *
 * Renders each trek highlight as a numbered, icon-capped card so the section
 * reads as a visual grid rather than a flat bullet list. Purely presentational
 * (server-safe) — the actual highlight strings come from `Trek.highlights`.
 */
import type { Trek } from "@/lib/types";

const HIGHLIGHT_ICONS = [
    // Peak
    <svg key="peak" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m8 3-6 12h5l-2 6 11-14h-5l3-4z" />
    </svg>,
    // Route
    <svg key="route" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="19" r="2.5" />
        <circle cx="18" cy="5" r="2.5" />
        <path d="M8 18c4-1 6-5 8-11" />
        <path d="M13 7h5v5" />
    </svg>,
    // Culture
    <svg key="culture" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3 4 7l8 4 8-4z" />
        <path d="M4 11v6c0 1.5 3.6 4 8 4s8-2.5 8-4v-6" />
        <path d="M12 11v10" />
    </svg>,
    // View
    <svg key="view" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3" />
    </svg>,
    // Compass
    <svg key="compass" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="m15.5 8.5-2 5-5 2 2-5z" />
    </svg>,
    // Forest / trail
    <svg key="forest" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 20h18" />
        <path d="M7 20c0-3 2-5 5-5s5 2 5 5" />
        <path d="M9 20v-3" />
        <path d="M15 20v-3" />
        <path d="m12 4 4 7-2 1-2-2-2 2-2-1z" />
    </svg>,
    // Lake
    <svg key="lake" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 15c3-2 6 2 9 0s6 2 9 0" />
        <path d="M3 19c3-2 6 2 9 0s6 2 9 0" />
        <path d="M6 9c2 1.5 4 1.5 6 0s4-1.5 6 0" />
        <path d="M6 13c2-1.5 4-1.5 6 0s4 1.5 6 0" />
    </svg>,
    // Wildlife
    <svg key="wildlife" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
        <path d="M9 10h.01" />
        <path d="M15 10h.01" />
        <path d="M9 15a3 3 0 0 0 6 0" />
    </svg>,
];

export default function HighlightCards({ highlights }: { highlights: string[] }) {
    if (!highlights || highlights.length === 0) return null;

    return (
        <div className="highlight-grid">
            {highlights.map((h, i) => (
                <article key={`${i}-${h.slice(0, 24)}`} className="highlight-card reveal">
                    <span className="highlight-num" aria-hidden="true">
                        {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="highlight-icon" aria-hidden="true">
                        {HIGHLIGHT_ICONS[i % HIGHLIGHT_ICONS.length]}
                    </span>
                    <p>{h}</p>
                </article>
            ))}
        </div>
    );
}
