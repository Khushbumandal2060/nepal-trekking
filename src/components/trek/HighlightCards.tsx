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
