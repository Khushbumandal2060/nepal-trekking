/**
 * RelatedTreks — "You May Also Like" recommendations.
 *
 * Scores every other public trek by how similar it is to the current one:
 *   +4  same region
 *   +2  duration within 2 days
 *   +2  same difficulty bucket
 *   +1  overlapping trekking seasons
 * and shows the top three as compact `TrekCard variant="treks"` cards.
 *
 * Server component — reads from the same `listPublicTreks()` source as the
 * filtering page, so it always reflects the live trek catalogue.
 */
import type { Trek } from "@/lib/types";
import { normalizeGrade, seasonsCovered } from "@/lib/treks";
import { listPublicTreks } from "@/lib/treks-db";
import TrekCard from "@/components/TrekCard";

function scoreRelated(a: Trek, b: Trek): number {
    let score = 0;
    if (a.region === b.region) score += 4;
    if (Math.abs(a.days - b.days) <= 2) score += 2;
    if (normalizeGrade(a.grade) === normalizeGrade(b.grade)) score += 2;

    const aSeasons = seasonsCovered(a.bestMonths);
    const bSeasons = seasonsCovered(b.bestMonths);
    if (aSeasons.some((s) => bSeasons.includes(s))) score += 1;

    return score;
}

export default async function RelatedTreks({ trek }: { trek: Trek }) {
    const all = await listPublicTreks();
    const related = all
        .filter((t) => t.slug !== trek.slug)
        .map((t) => ({ trek: t, score: scoreRelated(trek, t) }))
        .sort((x, y) => y.score - x.score)
        .slice(0, 3)
        .map((r) => r.trek);

    if (related.length === 0) return null;

    return (
        <div className="related-grid">
            {related.map((t) => (
                <TrekCard key={t.slug} trek={t} variant="treks" />
            ))}
        </div>
    );
}
