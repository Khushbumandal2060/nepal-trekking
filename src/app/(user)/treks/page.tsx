import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import TrekCard from "@/components/TrekCard";
import TreksSidebar, {
    type SidebarGroup,
    type SidebarOption,
} from "@/components/TreksSidebar";
import { listPublicTreks } from "@/lib/treks-db";
import {
    ALT_LABELS,
    ALT_ORDER,
    DISTANCE_LABELS,
    DISTANCE_ORDER,
    DURATION_LABELS,
    DURATION_ORDER,
    GRADE_LABELS,
    GRADE_ORDER,
    INTEREST_LABELS,
    INTEREST_ORDER,
    MONTH_FULL,
    MONTHS,
    SEASON_LABELS,
    SEASON_ORDER,
    THEME_LABELS,
    THEME_ORDER,
    altitudeBucket,
    distanceBucket,
    durationBucket,
    interestsOf,
    monthsCovered,
    normalizeGrade,
    seasonsCovered,
    themesOf,
    type AltBucket,
    type DistanceBucket,
    type DurationBucket,
    type GradeBucket,
    type Interest,
    type Season,
    type Theme,
} from "@/lib/treks";
import { buildMetadata, itemListJsonLd } from "@/lib/seo";
import type { Region, Trek } from "@/lib/types";

export const metadata: Metadata = buildMetadata({
    title: "All Nepal Treks",
    description:
        "Every route runs entirely inside Nepal — from a 5-day ridge walk near Pokhara to an 18-day expedition to the base of the world's third-highest peak.",
    path: "/treks",
});

// Read admin-created treks from the DB on every request so newly added treks
// appear immediately without a rebuild.
export const dynamic = "force-dynamic";

const REGIONS: { value: Region | "all"; label: string }[] = [
    { value: "all", label: "All Regions" },
    { value: "khumbu", label: "Khumbu (Everest)" },
    { value: "annapurna", label: "Annapurna" },
    { value: "manaslu", label: "Manaslu" },
    { value: "langtang", label: "Langtang" },
    { value: "mustang", label: "Mustang" },
    { value: "kanchenjunga", label: "Kanchenjunga" },
    { value: "dolpo", label: "Dolpo" },
    { value: "makalu", label: "Makalu" },
    { value: "dhaulagiri", label: "Dhaulagiri" },
    { value: "karnali", label: "Karnali & Far West" },
    { value: "ganesh", label: "Ganesh Himal" },
];

interface TreksPageProps {
    searchParams: Promise<{
        region?: string;
        search?: string;
        grade?: string;
        duration?: string;
        month?: string;
        season?: string;
        altitude?: string;
        theme?: string;
        interest?: string;
        distance?: string;
    }>;
}

/** All URL filter state for the treks page. `"all"` means "no constraint". */
interface FilterState {
    region: Region | "all";
    search: string;
    grades: GradeBucket[];
    duration: DurationBucket | "all";
    month: string | "all";
    season: Season | "all";
    altitude: AltBucket | "all";
    theme: Theme | "all";
    interest: Interest | "all";
    distance: DistanceBucket | "all";
}

/** Coerce a URL string into one of the allowed values, else fall back. */
function parseParam<T extends string>(
    value: string | undefined,
    allowed: readonly T[],
    fallback: T
): T {
    return value !== undefined && (allowed as readonly string[]).includes(value)
        ? (value as T)
        : fallback;
}

/** Build a /treks URL carrying the given filter state. */
function buildTreksHref(state: FilterState): string {
    const q = new URLSearchParams();
    if (state.region !== "all") q.set("region", state.region);
    if (state.search) q.set("search", state.search);
    if (state.grades.length) q.set("grade", state.grades.join(","));
    if (state.duration !== "all") q.set("duration", state.duration);
    if (state.month !== "all") q.set("month", state.month);
    if (state.season !== "all") q.set("season", state.season);
    if (state.altitude !== "all") q.set("altitude", state.altitude);
    if (state.theme !== "all") q.set("theme", state.theme);
    if (state.interest !== "all") q.set("interest", state.interest);
    if (state.distance !== "all") q.set("distance", state.distance);
    const qs = q.toString();
    return qs ? `/treks?${qs}` : "/treks";
}

/** Return a /treks URL with one filter field replaced. */
function hrefWith(state: FilterState, patch: Partial<FilterState>): string {
    return buildTreksHref({ ...state, ...patch });
}

/** Build a group's options from candidates, dropping any with a zero count. */
function buildOptions<V extends string>({
    candidates,
    source,
    labelOf,
    activeValue,
    matches,
    hrefFor,
}: {
    candidates: readonly V[];
    source: Trek[];
    labelOf: (v: V) => string;
    activeValue: string;
    matches: (t: Trek, v: V) => boolean;
    hrefFor: (v: V) => string;
}): SidebarOption[] {
    const options: SidebarOption[] = [];
    for (const v of candidates) {
        const count = source.filter((t) => matches(t, v)).length;
        if (count === 0) continue;
        options.push({
            value: v,
            label: labelOf(v),
            count,
            href: hrefFor(v),
            active: activeValue === v,
        });
    }
    return options;
}

export default async function TreksPage({ searchParams }: TreksPageProps) {
    const params = await searchParams;

    // Static seed treks merged with any treks created/edited by the admin.
    const allTreks = await listPublicTreks();

    const requested = params.region as Region | "all" | undefined;
    const activeRegion: Region | "all" = REGIONS.some(
        (r) => r.value === requested
    )
        ? (requested as Region | "all")
        : "all";

    const searchTerm = (params.search ?? "").trim().toLowerCase();

    const activeGrades = (params.grade ?? "")
        .split(",")
        .map((g) => g.trim())
        .filter((g): g is GradeBucket => (GRADE_ORDER as string[]).includes(g));

    const activeDuration = parseParam(params.duration, DURATION_ORDER, "all");
    const activeMonth = parseParam(params.month, MONTHS, "all");
    const activeSeason = parseParam(params.season, SEASON_ORDER, "all");
    const activeAltitude = parseParam(params.altitude, ALT_ORDER, "all");
    const activeTheme = parseParam(params.theme, THEME_ORDER, "all");
    const activeInterest = parseParam(params.interest, INTEREST_ORDER, "all");
    const activeDistance = parseParam(params.distance, DISTANCE_ORDER, "all");

    const filtered = allTreks.filter((t) => {
        const regionOk = activeRegion === "all" || t.region === activeRegion;
        const searchOk =
            !searchTerm ||
            [t.name, t.regionLabel, t.grade, t.bestMonths, t.overview]
                .join(" ")
                .toLowerCase()
                .includes(searchTerm);
        const gradeOk =
            activeGrades.length === 0 ||
            activeGrades.includes(normalizeGrade(t.grade));
        const durationOk =
            activeDuration === "all" || durationBucket(t.days) === activeDuration;
        const monthOk =
            activeMonth === "all" || monthsCovered(t.bestMonths).includes(activeMonth);
        const seasonOk =
            activeSeason === "all" ||
            seasonsCovered(t.bestMonths).includes(activeSeason);
        const altitudeOk =
            activeAltitude === "all" || altitudeBucket(t.altitude) === activeAltitude;
        const themeOk =
            activeTheme === "all" || themesOf(t).includes(activeTheme);
        const interestOk =
            activeInterest === "all" || interestsOf(t).includes(activeInterest);
        const distanceOk =
            activeDistance === "all" || distanceBucket(t) === activeDistance;
        return (
            regionOk &&
            searchOk &&
            gradeOk &&
            durationOk &&
            monthOk &&
            seasonOk &&
            altitudeOk &&
            themeOk &&
            interestOk &&
            distanceOk
        );
    });

    const baseState: FilterState = {
        region: activeRegion,
        search: params.search ?? "",
        grades: activeGrades,
        duration: activeDuration,
        month: activeMonth,
        season: activeSeason,
        altitude: activeAltitude,
        theme: activeTheme,
        interest: activeInterest,
        distance: activeDistance,
    };

    // Region options (reuses the same option shape as every other group).
    const regionOptions: SidebarOption[] = REGIONS.map((r) => ({
        value: r.value,
        label: r.label,
        count:
            r.value === "all"
                ? allTreks.length
                : allTreks.filter((t) => t.region === r.value).length,
        href: hrefWith(baseState, { region: r.value }),
        active: activeRegion === r.value,
    }));

    // Month options come from the months actually covered by any trek.
    const monthSet = new Set<string>();
    for (const t of allTreks) for (const m of monthsCovered(t.bestMonths)) monthSet.add(m);
    const monthOptions: SidebarOption[] = MONTHS.filter((m) => monthSet.has(m)).map(
        (m) => ({
            value: m,
            label: MONTH_FULL[m] ?? m,
            count: allTreks.filter((t) => monthsCovered(t.bestMonths).includes(m)).length,
            href: hrefWith(baseState, { month: m }),
            active: activeMonth === m,
        })
    );
    const monthResetHref = hrefWith(baseState, { month: "all" });

    const groups: SidebarGroup[] = [
        {
            id: "duration",
            label: "Trek by Duration",
            options: buildOptions({
                candidates: DURATION_ORDER,
                source: allTreks,
                labelOf: (v) => DURATION_LABELS[v],
                activeValue: activeDuration,
                matches: (t, v) => durationBucket(t.days) === v,
                hrefFor: (v) => hrefWith(baseState, { duration: v as DurationBucket }),
            }),
        },
        {
            id: "months",
            label: "Trek by Months",
            options: monthOptions,
        },
        {
            id: "region",
            label: "Trek by Region",
            options: regionOptions,
        },
        {
            id: "themes",
            label: "Trek by Themes",
            options: buildOptions({
                candidates: THEME_ORDER,
                source: allTreks,
                labelOf: (v) => THEME_LABELS[v],
                activeValue: activeTheme,
                matches: (t, v) => themesOf(t).includes(v),
                hrefFor: (v) => hrefWith(baseState, { theme: v as Theme }),
            }),
        },
        {
            id: "season",
            label: "Trek by Season",
            options: buildOptions({
                candidates: SEASON_ORDER,
                source: allTreks,
                labelOf: (v) => SEASON_LABELS[v],
                activeValue: activeSeason,
                matches: (t, v) => seasonsCovered(t.bestMonths).includes(v),
                hrefFor: (v) => hrefWith(baseState, { season: v as Season }),
            }),
        },
        {
            id: "interests",
            label: "Trek by Interests",
            options: buildOptions({
                candidates: INTEREST_ORDER,
                source: allTreks,
                labelOf: (v) => INTEREST_LABELS[v],
                activeValue: activeInterest,
                matches: (t, v) => interestsOf(t).includes(v),
                hrefFor: (v) => hrefWith(baseState, { interest: v as Interest }),
            }),
        },
        {
            id: "distance",
            label: "Trek by Distance",
            options: buildOptions({
                candidates: DISTANCE_ORDER,
                source: allTreks,
                labelOf: (v) => DISTANCE_LABELS[v],
                activeValue: activeDistance,
                matches: (t, v) => distanceBucket(t) === v,
                hrefFor: (v) => hrefWith(baseState, { distance: v as DistanceBucket }),
            }),
        },
        {
            id: "altitude",
            label: "Trek by Altitude",
            options: buildOptions({
                candidates: ALT_ORDER,
                source: allTreks,
                labelOf: (v) => ALT_LABELS[v],
                activeValue: activeAltitude,
                matches: (t, v) => altitudeBucket(t.altitude) === v,
                hrefFor: (v) => hrefWith(baseState, { altitude: v as AltBucket }),
            }),
        },
    ];

    return (
        <>
            <JsonLd
                data={itemListJsonLd(
                    allTreks.map((t) => ({
                        name: `${t.name} Trek`,
                        path: `/treks/${t.slug}`,
                    }))
                )}
            />
            <section className='treks-page' style={{ paddingTop: 70 }}>
                <div className="wrap">
                    <div className="treks-layout">
                        <TreksSidebar
                            groups={groups}
                            monthOptions={monthOptions}
                            activeMonth={activeMonth}
                            monthResetHref={monthResetHref}
                        />

                        <div className="treks-main">
                            <div className="grade-filter-box">
                                <div className="grade-filter-label">Choose from filters</div>
                                <div className="grade-filter-options">
                                    {GRADE_ORDER.map((bucket) => {
                                        const checked = activeGrades.includes(bucket);
                                        const nextGrades = checked
                                            ? activeGrades.filter((g) => g !== bucket)
                                            : [...activeGrades, bucket];
                                        const href = hrefWith(baseState, { grades: nextGrades });
                                        return (
                                            <Link
                                                key={bucket}
                                                href={href}
                                                scroll={false}
                                                className="grade-filter-option"
                                            >
                                                <span
                                                    className={`grade-filter-checkbox ${checked ? "checked" : ""
                                                        }`}
                                                    aria-hidden="true"
                                                >
                                                    {checked && (
                                                        <svg viewBox="0 0 16 16" fill="none">
                                                            <path
                                                                d="M3 8.5 6.5 12 13 4.5"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    )}
                                                </span>
                                                {GRADE_LABELS[bucket]}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>

                            {searchTerm && (
                                <p className="search-summary">
                                    {filtered.length}{" "}
                                    {filtered.length === 1 ? "trek" : "treks"} matching{" "}
                                    <b>&ldquo;{params.search?.trim()}&rdquo;</b>
                                </p>
                            )}
                            <div className="trek-grid">
                                {filtered.map((t) => (
                                    <TrekCard key={t.slug} trek={t} />
                                ))}
                            </div>
                            {filtered.length === 0 && (
                                <p className="search-summary empty">
                                    No treks match your search. Try a different term, or{" "}
                                    <Link href="/contact" className="underline">
                                        ask us to plan a custom trek
                                    </Link>
                                    .
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
