import type { ItineraryDay, Region, Trek } from "./types";

/** Extract the first number from an altitude string like "17,600 ft / 5,364 m". */
export function maxAltitudeNumber(altitude: string): number {
    const match = altitude.replace(/,/g, "").match(/\d+/);
    return match ? parseInt(match[0], 10) : 1;
}

/**
 * Build the polyline "x,y x,y ..." points for the elevation-profile SVG.
 * Days without a numeric altitude (flight/buffer "—" days) are skipped so
 * they can't distort the profile, and the vertical scale is fitted to the
 * true maximum altitude across both the itinerary and the declared max.
 */
export function computeElevationPoints(
    itinerary: ItineraryDay[],
    maxAltitude: string
): string {
    const numeric = itinerary
        .map((day) => {
            const match = day.alt.replace(/,/g, "").match(/\d+/);
            return match ? parseInt(match[0], 10) : null;
        })
        .filter((v): v is number => v !== null);

    if (numeric.length < 2) return "";

    const maxAltNum = Math.max(...numeric, maxAltitudeNumber(maxAltitude));

    return itinerary
        .map((day, i) => {
            const altMatch = day.alt.replace(/,/g, "").match(/\d+/);
            const altVal = altMatch ? parseInt(altMatch[0], 10) : null;
            if (altVal === null) return null;
            const x = 20 + (i * (1060 / (itinerary.length - 1 || 1)));
            const y = 220 - (altVal / maxAltNum) * 180;
            return `${x.toFixed(0)},${y.toFixed(0)}`;
        })
        .filter((p): p is string => p !== null)
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

/* ============================================================
   SIDEBAR FILTER HELPERS
   Each filter is derived from real `Trek` fields so every group
   in the treks-page sidebar can drive the grid via URL params.
   ============================================================ */

/* ---- Duration (from `Trek.days`) ---- */

export type DurationBucket = "short" | "medium" | "long" | "epic";

export const DURATION_ORDER: DurationBucket[] = ["short", "medium", "long", "epic"];

export const DURATION_LABELS: Record<DurationBucket, string> = {
    short: "5–7 days",
    medium: "8–12 days",
    long: "13–16 days",
    epic: "17+ days",
};

export function durationBucket(days: number): DurationBucket {
    if (days <= 7) return "short";
    if (days <= 12) return "medium";
    if (days <= 16) return "long";
    return "epic";
}

/* ---- Months & seasons (from `Trek.bestMonths`) ---- */

const MONTH_INDEX: Record<string, number> = {
    jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
    jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};

const MONTH_ABBR = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Calendar-ordered list of month abbreviations (for building sidebar month options). */
export const MONTHS: readonly string[] = MONTH_ABBR.slice(1);

/** Full display names for month abbreviations, used in the sidebar month dropdown. */
export const MONTH_FULL: Record<string, string> = {
    Jan: "January",
    Feb: "February",
    Mar: "March",
    Apr: "April",
    May: "May",
    Jun: "June",
    Jul: "July",
    Aug: "August",
    Sep: "September",
    Oct: "October",
    Nov: "November",
    Dec: "December",
};

/** Expand a `bestMonths` string like "Mar–May, Sep–Nov" into covered month abbreviations, in calendar order. */
export function monthsCovered(bestMonths: string): string[] {
    const set = new Set<number>();
    const clean = bestMonths.replace(/\([^)]*\)/g, "");
    for (const segment of clean.split(",")) {
        const range = segment.match(/([A-Z][a-z]{2})\s*[–-]\s*([A-Z][a-z]{2})/);
        if (range) {
            const a = MONTH_INDEX[range[1].toLowerCase()];
            const b = MONTH_INDEX[range[2].toLowerCase()];
            if (a && b) {
                let i = a;
                while (true) {
                    set.add(i);
                    if (i === b) break;
                    i = (i % 12) + 1;
                }
            }
            continue;
        }
        const single = segment.match(/([A-Z][a-z]{2})/);
        if (single) {
            const m = MONTH_INDEX[single[1].toLowerCase()];
            if (m) set.add(m);
        }
    }
    return [...set].sort((x, y) => x - y).map((n) => MONTH_ABBR[n]);
}

export type Season = "spring" | "summer" | "autumn" | "winter";

export const SEASON_ORDER: Season[] = ["spring", "summer", "autumn", "winter"];

export const SEASON_LABELS: Record<Season, string> = {
    spring: "Spring (Mar–May)",
    summer: "Summer / Monsoon (Jun–Aug)",
    autumn: "Autumn (Sep–Nov)",
    winter: "Winter (Dec–Feb)",
};

function inMonthRange(m: number, a: number, b: number): boolean {
    return a <= b ? m >= a && m <= b : m >= a || m <= b;
}

/** Which seasons a trek's `bestMonths` covers. */
export function seasonsCovered(bestMonths: string): Season[] {
    const months = monthsCovered(bestMonths)
        .map((abbr) => MONTH_INDEX[abbr.toLowerCase()])
        .filter((n): n is number => Boolean(n));
    const ranges: Record<Season, [number, number]> = {
        spring: [3, 5],
        summer: [6, 8],
        autumn: [9, 11],
        winter: [12, 2],
    };
    return SEASON_ORDER.filter((s) => {
        const [a, b] = ranges[s];
        return months.some((m) => inMonthRange(m, a, b));
    });
}

/* ---- Altitude (in feet, matching the first figure of `Trek.altitude`) ---- */

export type AltBucket = "under-10000" | "10000-14000" | "14000-17000" | "over-17000";

export const ALT_ORDER: AltBucket[] = ["under-10000", "10000-14000", "14000-17000", "over-17000"];

export const ALT_LABELS: Record<AltBucket, string> = {
    "under-10000": "Under 10,000 ft",
    "10000-14000": "10,000 – 14,000 ft",
    "14000-17000": "14,000 – 17,000 ft",
    "over-17000": "Over 17,000 ft",
};

export function altitudeBucket(altitude: string): AltBucket {
    const ft = maxAltitudeNumber(altitude);
    if (ft < 10000) return "under-10000";
    if (ft < 14000) return "10000-14000";
    if (ft < 17000) return "14000-17000";
    return "over-17000";
}

/* ---- Themes (derived from real trek copy + restricted regions) ---- */

export type Theme = "base-camp" | "lakes" | "peaks" | "monasteries" | "restricted" | "remote" | "hot-springs";

export const THEME_ORDER: Theme[] = ["base-camp", "lakes", "peaks", "monasteries", "restricted", "remote", "hot-springs"];

export const THEME_LABELS: Record<Theme, string> = {
    "base-camp": "Base Camp Treks",
    lakes: "Lake Treks",
    peaks: "Peaks & Passes",
    monasteries: "Monastery & Culture",
    restricted: "Restricted-Area Treks",
    remote: "Remote & Offbeat",
    "hot-springs": "Hot Spring Treks",
};

const RESTRICTED_REGIONS: Region[] = ["manaslu", "mustang", "dolpo", "karnali"];

const THEME_KEYWORDS: Record<Exclude<Theme, "restricted">, string[]> = {
    "base-camp": ["base camp"],
    lakes: ["lake"],
    peaks: ["peak", "summit", "kala patthar", "thorong la", "mardi himal", "phoksundo", "la pass"],
    monasteries: ["monastery", "gompa", "tengboche", "muktinath", "temple"],
    remote: ["remote", "off-the-beaten", "isolated", "unspoilt", "far-flung", "wilderness", "hidden"],
    "hot-springs": ["hot spring"],
};

/** Assign theme tags by scanning a trek's real name/overview/highlights. */
export function themesOf(t: Trek): Theme[] {
    const hay = `${t.name} ${t.overview} ${t.highlights.join(" ")}`.toLowerCase();
    const res: Theme[] = [];
    for (const id of THEME_ORDER) {
        if (id === "restricted") {
            if (RESTRICTED_REGIONS.includes(t.region)) res.push(id);
        } else if (THEME_KEYWORDS[id].some((k) => hay.includes(k))) {
            res.push(id);
        }
    }
    return res;
}

/* ---- Interests (derived from grade, altitude, group size, length) ---- */

export type Interest = "beginner" | "experienced" | "high-altitude" | "small-groups" | "short-break";

export const INTEREST_ORDER: Interest[] = ["beginner", "experienced", "high-altitude", "small-groups", "short-break"];

export const INTEREST_LABELS: Record<Interest, string> = {
    beginner: "Beginner Friendly",
    experienced: "For Experienced Hikers",
    "high-altitude": "High Altitude (14,000 ft+)",
    "small-groups": "Small Groups (max 10)",
    "short-break": "Short Breaks (≤ 8 days)",
};

function maxGroupSize(groupSize: string): number {
    const m = groupSize.replace(/,/g, "").match(/(\d+)\s*$/);
    return m ? parseInt(m[1], 10) : 16;
}

/** Derive interest tags from grade, altitude, group size and length. */
export function interestsOf(t: Trek): Interest[] {
    const res: Interest[] = [];
    const g = normalizeGrade(t.grade);
    if (g === "easy" || g === "easy-moderate" || g === "moderate") res.push("beginner");
    if (g === "difficult" || g === "challenging") res.push("experienced");
    if (maxAltitudeNumber(t.altitude) >= 14000) res.push("high-altitude");
    if (maxGroupSize(t.groupSize) <= 10) res.push("small-groups");
    if (t.days <= 8) res.push("short-break");
    return res;
}

/* ---- Distance (estimated from the itinerary's walking hours) ---- */

export type DistanceBucket = "short" | "medium" | "long" | "epic";

export const DISTANCE_ORDER: DistanceBucket[] = ["short", "medium", "long", "epic"];

export const DISTANCE_LABELS: Record<DistanceBucket, string> = {
    short: "Short · under 30 hrs",
    medium: "Medium · 30–45 hrs",
    long: "Long · 45–65 hrs",
    epic: "Epic · 65+ hrs walking",
};

/** Sum average walking hours across an itinerary (ignores flights / rest days without an hr figure). */
export function walkingHours(t: Trek): number {
    let total = 0;
    for (const day of t.itinerary) {
        const range = day.hrs.match(/(\d+(?:\.\d+)?)\s*(?:–|-|to)\s*(\d+(?:\.\d+)?)\s*hrs?/i);
        if (range) {
            total += (parseFloat(range[1]) + parseFloat(range[2])) / 2;
            continue;
        }
        const single = day.hrs.match(/(\d+(?:\.\d+)?)\s*hrs?/i);
        if (single) total += parseFloat(single[1]);
    }
    return total;
}

export function distanceBucket(t: Trek): DistanceBucket {
    const h = walkingHours(t);
    if (h < 30) return "short";
    if (h < 45) return "medium";
    if (h < 65) return "long";
    return "epic";
}
