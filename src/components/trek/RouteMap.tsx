/**
 * RouteMap — route visualization for the trek detail page.
 *
 * Reuses the exact coordinate math from `computeElevationPoints` (same x/y
 * mapping inside the "0 0 1100 260" viewBox) so the route line and the
 * elevation profile always agree. On top of the line it drops three waypoint
 * markers — START, PEAK and END — with edge-aware text anchors so the labels
 * never overflow the SVG.
 *
 * Below the graphic a responsive stop-list echoes every day with a numeric
 * altitude, keeping the section readable on small screens.
 */
import type { ItineraryDay } from "@/lib/types";
import { maxAltitudeNumber } from "@/lib/treks";

interface RouteMapProps {
    itinerary: ItineraryDay[];
    maxAltitude: string;
    startPoint: string;
    endingPoint?: string;
}

interface Stop {
    day: number;
    title: string;
    alt: number;
    altLabel: string;
    x: number;
    y: number;
}

const VIEW_W = 1100;
const VIEW_H = 260;

function parseAlt(alt: string): { value: number; label: string } | null {
    const match = alt.replace(/,/g, "").match(/\d+/);
    if (!match) return null;
    return { value: parseInt(match[0], 10), label: alt.split("/")[0].trim() };
}

/** Turn the itinerary into plotted stops that all share one vertical scale. */
function buildStops(
    itinerary: ItineraryDay[],
    maxAltitude: string
): Stop[] {
    const parsed = itinerary.map((day) => ({
        day,
        parsed: parseAlt(day.alt),
    }));
    const numeric = parsed
        .map((p) => p.parsed?.value ?? null)
        .filter((v): v is number => v !== null);
    if (numeric.length < 2) return [];

    const maxAltNum = Math.max(...numeric, maxAltitudeNumber(maxAltitude));
    const stops: Stop[] = [];
    parsed.forEach(({ day, parsed: alt }, i) => {
        if (!alt) return;
        const x = 20 + (i * (VIEW_W - 40)) / (itinerary.length - 1 || 1);
        const y = VIEW_H - 28 - (alt.value / maxAltNum) * 180;
        stops.push({
            day: i + 1,
            title: day.t,
            alt: alt.value,
            altLabel: alt.label,
            x,
            y,
        });
    });
    return stops;
}

export default function RouteMap({
    itinerary,
    maxAltitude,
    startPoint,
    endingPoint,
}: RouteMapProps) {
    const stops = buildStops(itinerary, maxAltitude);
    if (stops.length < 2) return null;

    const linePoints = stops.map((s) => `${s.x.toFixed(0)},${s.y.toFixed(0)}`).join(" ");
    const areaPoints = `${stops[0].x.toFixed(0)},260 ${linePoints} ${stops[stops.length - 1].x.toFixed(0)},260`;

    const peak = stops.reduce((a, b) => (b.alt > a.alt ? b : a), stops[0]);
    const first = stops[0];
    const last = stops[stops.length - 1];

    // Edge-aware label anchoring: near the left edge the label reads left-to-right,
    // near the right edge it reads right-to-left, in the middle it centres.
    function anchorFor(
        x: number,
        textWidth: number
    ): "start" | "end" | "middle" {
        if (x - textWidth / 2 < 30) return "start";
        if (x + textWidth / 2 > VIEW_W - 30) return "end";
        return "middle";
    }

    const labelY = (stop: Stop) => Math.max(stop.y - 12, 14);

    return (
        <div className="route-map">
            <div className="route-svg-wrap">
                <svg
                    viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
                    preserveAspectRatio="none"
                    role="img"
                    aria-label="Route profile showing the trek's gain in altitude across each day"
                    className="route-svg"
                >
                    <defs>
                        <linearGradient id="routeFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--flare)" stopOpacity="0.28" />
                            <stop offset="100%" stopColor="var(--flare)" stopOpacity="0.02" />
                        </linearGradient>
                    </defs>

                    <polygon points={areaPoints} fill="url(#routeFill)" />

                    <polyline
                        points={linePoints}
                        fill="none"
                        stroke="var(--flare)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                    />

                    {/* Baseline */}
                    <line
                        x1={stops[0].x}
                        y1={VIEW_H - 28}
                        x2={stops[stops.length - 1].x}
                        y2={VIEW_H - 28}
                        stroke="var(--hline)"
                        strokeWidth="1.5"
                        strokeDasharray="4 6"
                        vectorEffect="non-scaling-stroke"
                    />

                    {/* Grid altitude guides */}
                    {[0.25, 0.5, 0.75].map((f) => (
                        <line
                            key={f}
                            x1={stops[0].x}
                            y1={VIEW_H - 28 - f * 180}
                            x2={stops[stops.length - 1].x}
                            y2={VIEW_H - 28 - f * 180}
                            stroke="var(--hline)"
                            strokeWidth="1"
                            strokeDasharray="2 6"
                            opacity="0.55"
                            vectorEffect="non-scaling-stroke"
                        />
                    ))}

                    {[first, peak, last].map((stop, idx) => {
                        const isPeak = idx === 1;
                        return (
                            <g key={stop.day}>
                                <circle
                                    cx={stop.x}
                                    cy={stop.y}
                                    r={isPeak ? 7 : 5}
                                    fill={isPeak ? "var(--flare)" : "var(--paper, #fff)"}
                                    stroke="var(--flare)"
                                    strokeWidth="2.5"
                                    vectorEffect="non-scaling-stroke"
                                />
                                <text
                                    x={stop.x}
                                    y={labelY(stop)}
                                    textAnchor={anchorFor(stop.x, isPeak ? 88 : 96)}
                                    className="route-label"
                                >
                                    {isPeak
                                        ? `Peak ${stop.altLabel}`
                                        : idx === 0
                                            ? "Start"
                                            : "End"}
                                </text>
                                <text
                                    x={stop.x}
                                    y={stop.y - 4}
                                    textAnchor={anchorFor(stop.x, 96)}
                                    className="route-label route-label--alt"
                                >
                                    {stop.altLabel}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>

            <div className="route-legend">
                <span className="route-legend-item">
                    <i className="route-dot route-dot--start" />
                    {startPoint}
                </span>
                <span className="route-legend-item route-legend-item--peak">
                    <i className="route-dot route-dot--peak" />
                    Peak {peak.altLabel}
                </span>
                <span className="route-legend-item">
                    <i className="route-dot route-dot--end" />
                    {endingPoint || last.title}
                </span>
            </div>

            <div className="route-stops">
                {stops.map((stop) => (
                    <div key={stop.day} className="route-stop">
                        <span className="route-stop-day">Day {stop.day}</span>
                        <span className="route-stop-title">{stop.title}</span>
                        <span className="route-stop-alt">{stop.altLabel}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
