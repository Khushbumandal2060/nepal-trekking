import Image from "next/image";
import Link from "next/link";
import type { Trek } from "@/lib/types";

interface TrekCardProps {
    trek: Trek;
    /**
     * "home" keeps the full itinerary-link card used on the homepage carousel.
     * "treks" renders the compact reference card (whole card clickable, no
     * "View Itinerary" link, short location/elevation badges).
     */
    variant?: "home" | "treks";
}

/** "Kathmandu → Lukla (flight)" → "Kathmandu" */
function startCity(startPoint: string): string {
    return startPoint.split("→")[0].trim();
}

/** "17,600 ft / 5,364 m" → "17,600 ft" */
function elevationText(altitude: string): string {
    return altitude.split("/")[0].trim();
}

const LOCATION_ICON = (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21z" />
        <circle cx="12" cy="9.5" r="2.4" />
    </svg>
);

const MOUNTAIN_ICON = (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="m8 3-6 12h5l-2 6 11-14h-5l3-4z" />
    </svg>
);

const CLOCK_ICON = (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
    </svg>
);

export default function TrekCard({ trek, variant = "home" }: TrekCardProps) {
    if (variant === "treks") {
        return (
            <Link
                href={`/treks/${trek.slug}`}
                className="trek-card trek-card--treks"
                aria-label={`${trek.name} — ${trek.days} days, ${trek.grade} difficulty, max ${elevationText(
                    trek.altitude
                )}`}
            >
                <div className="trek-art">
                    <Image
                        fill
                        src={trek.image}
                        alt={trek.name}
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <span className="trek-badge trek-badge-pin">
                        {LOCATION_ICON}
                        {startCity(trek.startPoint)}
                    </span>
                    <span className="trek-badge trek-badge-alt">
                        {MOUNTAIN_ICON}
                        {elevationText(trek.altitude)}
                    </span>
                </div>
                <div className="trek-body">
                    <div className="trek-meta-row">
                        <span className="trek-duration">
                            {CLOCK_ICON}
                            {trek.days} Days
                        </span>
                        <span className="trek-difficulty-pill">{trek.grade}</span>
                    </div>
                    <h3>{trek.name}</h3>
                </div>
            </Link>
        );
    }

    return (
        <Link href={`/treks/${trek.slug}`} className="trek-card">
            <div className="trek-art">
                <Image
                    fill
                    src={trek.image}
                    alt={trek.name}
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
                <span className="trek-badge trek-badge-pin">
                    {LOCATION_ICON}
                    {trek.startPoint}
                </span>
                <span className="trek-badge trek-badge-alt">
                    {MOUNTAIN_ICON}
                    {trek.altitude.split("/")[0].trim()}
                </span>
            </div>
            <div className="trek-body">
                <div className="trek-meta-row">
                    <span className="trek-duration">
                        {CLOCK_ICON}
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
