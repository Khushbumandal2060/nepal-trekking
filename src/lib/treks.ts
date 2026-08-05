import type { ItineraryDay } from "./types";

/** Extract the first number from an altitude string like "17,600 ft / 5,364 m". */
export function maxAltitudeNumber(altitude: string): number {
    const match = altitude.replace(/,/g, "").match(/\d+/);
    return match ? parseInt(match[0], 10) : 1;
}

/**
 * Build the polyline "x,y x,y ..." points for the elevation-profile SVG.
 * Mirrors the original `trek-detail.html` logic.
 */
export function computeElevationPoints(
    itinerary: ItineraryDay[],
    maxAltitude: string
): string {
    const maxAltNum = maxAltitudeNumber(maxAltitude);
    return itinerary
        .map((day, i) => {
            const altMatch = day.alt.replace(/,/g, "").match(/\d+/);
            const altVal = altMatch ? parseInt(altMatch[0], 10) : 4000;
            const x = 20 + (i * (1060 / (itinerary.length - 1 || 1)));
            const y = 220 - (altVal / maxAltNum) * 180;
            return `${x.toFixed(0)},${y.toFixed(0)}`;
        })
        .join(" ");
}

/**
 * The six difficulty buckets that appear across every trek's `grade` field
 * (e.g. "Moderate-Difficult" and "Moderate to Difficult" both normalize to
 * "moderate-difficult"). Used to power the "Choose from filters" checkboxes.
 */
export type GradeBucket =
    | "easy"
    | "easy-moderate"
    | "moderate"
    | "moderate-difficult"
    | "difficult"
    | "challenging";

export const GRADE_ORDER: GradeBucket[] = [
    "easy",
    "easy-moderate",
    "moderate",
    "moderate-difficult",
    "difficult",
    "challenging",
];

export const GRADE_LABELS: Record<GradeBucket, string> = {
    easy: "Easy",
    "easy-moderate": "Easy To Moderate",
    moderate: "Moderate",
    "moderate-difficult": "Moderate To Difficult",
    difficult: "Difficult",
    challenging: "Challenging",
};

/** Normalize a raw `Trek.grade` string (which varies in punctuation) to one bucket. */
export function normalizeGrade(grade: string): GradeBucket {
    const g = grade.toLowerCase();
    if (g.includes("challenging")) return "challenging";
    const hasEasy = g.includes("easy");
    const hasModerate = g.includes("moderate");
    const hasDifficult = g.includes("difficult");
    if (hasModerate && hasDifficult) return "moderate-difficult";
    if (hasEasy && hasModerate) return "easy-moderate";
    if (hasDifficult) return "difficult";
    if (hasModerate) return "moderate";
    return "easy";
}

