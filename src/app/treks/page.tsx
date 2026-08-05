import type { Metadata } from "next";
import Link from "next/link";
import TrekCard from "@/components/TrekCard";
import TreksSidebar from "@/components/TreksSidebar";
import { treks } from "@/data/treks";
import { GRADE_LABELS, GRADE_ORDER, normalizeGrade, type GradeBucket } from "@/lib/treks";
import type { Region } from "@/lib/types";

export const metadata: Metadata = {
    title: "All Nepal Treks",
    description:
        "Every route runs entirely inside Nepal — from a 5-day ridge walk near Pokhara to an 18-day expedition to the base of the world's third-highest peak.",
};

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
    searchParams: Promise<{ region?: string; search?: string; grade?: string }>;
}

/** Build a /treks URL carrying the given region/search/grade state. */
function buildTreksHref(state: {
    region: Region | "all";
    search: string;
    grades: GradeBucket[];
}): string {
    const q = new URLSearchParams();
    if (state.region !== "all") q.set("region", state.region);
    if (state.search) q.set("search", state.search);
    if (state.grades.length) q.set("grade", state.grades.join(","));
    const qs = q.toString();
    return qs ? `/treks?${qs}` : "/treks";
}

export default async function TreksPage({ searchParams }: TreksPageProps) {
    const params = await searchParams;
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

    const filtered = treks.filter((t) => {
        const regionOk = activeRegion === "all" || t.region === activeRegion;
        const searchOk =
            !searchTerm ||
            [t.name, t.regionLabel, t.grade, t.bestMonths, t.overview]
                .join(" ")
                .toLowerCase()
                .includes(searchTerm);
        const gradeOk =
            activeGrades.length === 0 || activeGrades.includes(normalizeGrade(t.grade));
        return regionOk && searchOk && gradeOk;
    });

    const regionOptions = REGIONS.map((r) => ({
        value: r.value,
        label: r.label,
        count:
            r.value === "all" ? treks.length : treks.filter((t) => t.region === r.value).length,
        href: buildTreksHref({ region: r.value, search: params.search ?? "", grades: activeGrades }),
    }));

    return (
        <>
            <section className='treks-page' style={{ paddingTop: 70 }}>
                <div className="wrap">
                    <div className="treks-layout">
                        <TreksSidebar regions={regionOptions} activeRegion={activeRegion} />

                        <div className="treks-main">
                            <div className="grade-filter-box">
                                <div className="grade-filter-label">Choose from filters</div>
                                <div className="grade-filter-options">
                                    {GRADE_ORDER.map((bucket) => {
                                        const checked = activeGrades.includes(bucket);
                                        const nextGrades = checked
                                            ? activeGrades.filter((g) => g !== bucket)
                                            : [...activeGrades, bucket];
                                        const href = buildTreksHref({
                                            region: activeRegion,
                                            search: params.search ?? "",
                                            grades: nextGrades,
                                        });
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
