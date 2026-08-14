/**
 * SectionHead — consistent heading block for every trek detail-page section.
 *
 * Renders the eyebrow + title + optional lead paragraph using the site-wide
 * `.sec-head` / `.sec-eyebrow` / `.sec-title` / `.sec-lead` design tokens, so
 * every section shares the same visual hierarchy as the rest of the site.
 *
 * `id` is optional — pass it to give the section a jump-link anchor (used by
 * the hero "explore" button and the sticky CTA's "View full itinerary" link).
 */
interface SectionHeadProps {
    eyebrow: string;
    title: string;
    lead?: string;
    center?: boolean;
    id?: string;
}

export default function SectionHead({
    eyebrow,
    title,
    lead,
    center = false,
    id,
}: SectionHeadProps) {
    return (
        <div className={center ? "sec-head sec-head--center" : "sec-head"} id={id}>
            {eyebrow && <p className="sec-eyebrow">{eyebrow}</p>}
            <h2 className="sec-title">{title}</h2>
            {lead && <p className="sec-lead">{lead}</p>}
        </div>
    );
}
