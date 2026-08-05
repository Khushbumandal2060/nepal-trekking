import Link from "next/link";
import type { Trek } from "@/lib/types";

interface TrekCardProps {
    trek: Trek;
}

export default function TrekCard({ trek }: TrekCardProps) {
    return (
        <Link href={`/treks/${trek.slug}`} className="trek-card">
            <div className="trek-art">
                <img src={trek.image} alt={trek.name} loading="lazy" />
                <span className="trek-badge trek-badge-pin">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21z" />
                        <circle cx="12" cy="9.5" r="2.4" />
                    </svg>
                    {trek.startPoint}
                </span>
                <span className="trek-badge trek-badge-alt">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m8 3-6 12h5l-2 6 11-14h-5l3-4z" />
                    </svg>
                    {trek.altitude.split("/")[0].trim()}
                </span>
            </div>
            <div className="trek-body">
                <div className="trek-meta-row">
                    <span className="trek-duration">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="9" />
                            <path d="M12 7v5l3 3" />
                        </svg>
                        {trek.days} Days
                    </span>
                    <span className="trek-difficulty-pill">{trek.grade}</span>
                </div>
                <h3>{trek.name}</h3>
                <span className="trek-link">View Itinerary &rarr;</span>
            </div>
        </Link>
    );
}
