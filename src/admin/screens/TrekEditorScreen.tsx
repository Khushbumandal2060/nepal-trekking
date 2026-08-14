"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { adminHeaders, getTrek, saveTrek } from "@/admin/admin-store";
import type {
    AcclimatizationStop,
    ItineraryDay,
    PackingCategory,
    Region,
    Testimonial,
    Trek,
    TrekFaq,
    TrekGuide,
    TrekPricingRow,
} from "@/lib/types";

const REGION_OPTIONS: { value: Region; label: string }[] = [
    { value: "khumbu", label: "Khumbu" },
    { value: "annapurna", label: "Annapurna" },
    { value: "manaslu", label: "Manaslu" },
    { value: "langtang", label: "Langtang" },
    { value: "mustang", label: "Mustang" },
    { value: "kanchenjunga", label: "Kanchenjunga" },
    { value: "dolpo", label: "Dolpo" },
    { value: "makalu", label: "Makalu" },
    { value: "dhaulagiri", label: "Dhaulagiri" },
    { value: "karnali", label: "Karnali" },
    { value: "ganesh", label: "Ganesh" },
];

const IMAGE_OPTIONS = [
    "/images/everest.jpg",
    "/images/everest three-passes.jpeg",
    "/images/Everest panorama-trek.jpg",
    "/images/annapurna.jpg",
    "/images/annapurna-circuit-trek.jpg",
    "/images/ghorepani poonhill-trek.jpg",
    "/images/machhapuchhre-base-camp.jpg",
    "/images/machapuchre trek.jpeg",
    "/images/mardi himal-trek.jpg",
    "/images/manaslu circuit-trek.jpg",
    "/images/Langtang valley trek.jpg",
    "/images/langtang valley-trek.jpeg",
    "/images/helambu-trek.jpeg",
    "/images/tamang heritage-trail.jpeg",
    "/images/upper mustang-trek.jpeg",
    "/images/nar-phu-valley.jpg",
    "/images/kanchanjunga base-camp.jpg",
    "/images/makalu-base-camp-trek.jpg",
    "/images/Dhaulagiri-Circuit-Trek.jpeg",
    "/images/lower dolpa-phoksundo-lake.jpg",
    "/images/upper-dolpa-trek.jpeg",
    "/images/rara-lake.jpg",
    "/images/humla limi valley-trek.jpg",
    "/images/ganesh-himal-trek.jpg",
    "/images/gokyo lake-trek.jpeg",
    "/images/tilichi lake-trek.jpg",
    "/images/tsum-valley-trek.jpg",
    "/images/jomsom-muktinath-trek.jpg",
    "/images/peaky peak-trek.jpg",
    "/images/home.jpg",
    "/images/about-hero.jpg",
];

function blankTrek(): Trek {
    return {
        slug: "",
        name: "",
        image: "",
        region: "khumbu",
        regionLabel: "",
        days: 10,
        grade: "Moderate",
        altitude: "",
        startPoint: "",
        bestMonths: "",
        groupSize: "4–14",
        price: "",
        overview: "",
        highlights: [],
        itinerary: [],
        included: [],
        excluded: [],
        faqs: [],
        bestSeason: "",
        endingPoint: "",
        gallery: [],
        howToReach: [],
        accommodation: [],
        food: [],
        permits: [],
        acclimatization: [],
        pricing: [],
        packingList: [],
        fitness: [],
        healthSafety: [],
        cancellationPolicy: [],
        reviews: [],
        guides: [],
        video: "",
    };
}

function slugify(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

/* ---- Client-side image upload ---- */

/** Largest edge (width or height) an uploaded image is resized to. */
const MAX_IMAGE_DIMENSION = 1280;
/** JPEG quality used when compressing uploaded images. */
const IMAGE_QUALITY = 0.8;

function readFileAsImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            URL.revokeObjectURL(url);
            resolve(img);
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("Sorry, that file couldn’t be read as an image."));
        };
        img.src = url;
    });
}

/**
 * Reads an image file, resizes it to fit within MAX_IMAGE_DIMENSION,
 * compresses it as JPEG and returns a base64 data URL. This keeps
 * uploads small enough to persist in the browser’s localStorage —
 * matching how the rest of the static admin panel stores data.
 */
async function fileToDataUrl(file: File): Promise<string> {
    const img = await readFileAsImage(file);
    const scale = Math.min(
        1,
        MAX_IMAGE_DIMENSION / Math.max(img.naturalWidth, img.naturalHeight)
    );
    const width = Math.max(1, Math.round(img.naturalWidth * scale));
    const height = Math.max(1, Math.round(img.naturalHeight * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        throw new Error("Image processing isn’t available in this browser.");
    }
    // Flatten transparent PNGs against a white background.
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);
    return canvas.toDataURL("image/jpeg", IMAGE_QUALITY);
}

/* ---- Small shared field pieces ---- */

function Field({
    label,
    hint,
    full,
    children,
}: {
    label: string;
    hint?: string;
    full?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div className={"admin-field" + (full ? " full" : "")}>
            <span>{label}</span>
            {children}
            {hint && <span className="admin-help">{hint}</span>}
        </div>
    );
}

function StringListEditor({
    title,
    items,
    onChange,
}: {
    title: string;
    items: string[];
    onChange: (items: string[]) => void;
}) {
    function update(i: number, value: string) {
        onChange(items.map((item, idx) => (idx === i ? value : item)));
    }
    function remove(i: number) {
        onChange(items.filter((_, idx) => idx !== i));
    }
    function add() {
        onChange([...items, ""]);
    }

    return (
        <Field label={title} full hint="One item per row. Leave a blank row to remove it.">
            <div className="admin-list-editor">
                {items.map((item, i) => (
                    <div className="admin-list-row" key={i}>
                        <input
                            type="text"
                            value={item}
                            onChange={(e) => update(i, e.target.value)}
                            placeholder="Add a line…"
                        />
                        <button
                            type="button"
                            className="admin-icon-btn danger"
                            aria-label={`Remove ${title} item ${i + 1}`}
                            onClick={() => remove(i)}
                        >
                            ✕
                        </button>
                    </div>
                ))}
                <button type="button" className="admin-add-line" onClick={add}>
                    + Add line
                </button>
            </div>
        </Field>
    );
}

function ItineraryEditor({
    days,
    onChange,
}: {
    days: ItineraryDay[];
    onChange: (days: ItineraryDay[]) => void;
}) {
    function update(i: number, patch: Partial<ItineraryDay>) {
        onChange(days.map((d, idx) => (idx === i ? { ...d, ...patch } : d)));
    }
    function remove(i: number) {
        onChange(days.filter((_, idx) => idx !== i));
    }
    function add() {
        onChange([
            ...days,
            { t: "", d: "", alt: "", hrs: "" },
        ]);
    }

    return (
        <div className="admin-field full">
            <span>Itinerary ({days.length} days)</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {days.map((day, i) => (
                    <div className="admin-block" key={i}>
                        <div className="admin-block-head">
                            <span className="admin-block-title">
                                Day {i + 1}
                            </span>
                            <button
                                type="button"
                                className="admin-icon-btn danger"
                                aria-label={`Remove day ${i + 1}`}
                                onClick={() => remove(i)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className="admin-field-grid">
                            <div className="wide">
                                <input
                                    type="text"
                                    value={day.t}
                                    placeholder="Title — e.g. Fly to Lukla, trek to Phakding"
                                    onChange={(e) => update(i, { t: e.target.value })}
                                />
                            </div>
                            <div className="wide">
                                <textarea
                                    rows={3}
                                    value={day.d}
                                    placeholder="Description of the day"
                                    onChange={(e) => update(i, { d: e.target.value })}
                                />
                            </div>
                            <input
                                type="text"
                                value={day.alt}
                                placeholder="Altitude — e.g. 8,560 ft"
                                onChange={(e) => update(i, { alt: e.target.value })}
                            />
                            <input
                                type="text"
                                value={day.hrs}
                                placeholder="Walking time — e.g. 5–6 hrs"
                                onChange={(e) => update(i, { hrs: e.target.value })}
                            />
                        </div>
                    </div>
                ))}
                <button type="button" className="admin-add-line" onClick={add}>
                    + Add day
                </button>
            </div>
        </div>
    );
}

function FaqEditor({
    faqs,
    onChange,
}: {
    faqs: TrekFaq[];
    onChange: (faqs: TrekFaq[]) => void;
}) {
    function update(i: number, patch: Partial<TrekFaq>) {
        onChange(faqs.map((f, idx) => (idx === i ? { ...f, ...patch } : f)));
    }
    function remove(i: number) {
        onChange(faqs.filter((_, idx) => idx !== i));
    }
    function add() {
        onChange([...faqs, { q: "", a: "" }]);
    }

    return (
        <div className="admin-field full">
            <span>FAQs ({faqs.length})</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {faqs.map((f, i) => (
                    <div className="admin-block" key={i}>
                        <div className="admin-block-head">
                            <span className="admin-block-title">FAQ {i + 1}</span>
                            <button
                                type="button"
                                className="admin-icon-btn danger"
                                aria-label={`Remove FAQ ${i + 1}`}
                                onClick={() => remove(i)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className="admin-field-grid">
                            <div className="wide">
                                <input
                                    type="text"
                                    value={f.q}
                                    placeholder="Question"
                                    onChange={(e) => update(i, { q: e.target.value })}
                                />
                            </div>
                            <div className="wide">
                                <textarea
                                    rows={2}
                                    value={f.a}
                                    placeholder="Answer"
                                    onChange={(e) => update(i, { a: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                ))}
                <button type="button" className="admin-add-line" onClick={add}>
                    + Add FAQ
                </button>
            </div>
        </div>
    );
}

/* ---- Editors for the extended detail-page fields ---- */

function PricingEditor({
    rows,
    onChange,
}: {
    rows: TrekPricingRow[];
    onChange: (rows: TrekPricingRow[]) => void;
}) {
    function update(i: number, patch: Partial<TrekPricingRow>) {
        onChange(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
    }
    function remove(i: number) {
        onChange(rows.filter((_, idx) => idx !== i));
    }
    function add() {
        onChange([...rows, { label: "", price: "", note: "" }]);
    }

    return (
        <div className="admin-field full">
            <span>Pricing options ({rows.length})</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {rows.map((row, i) => (
                    <div className="admin-block" key={i}>
                        <div className="admin-block-head">
                            <span className="admin-block-title">Option {i + 1}</span>
                            <button
                                type="button"
                                className="admin-icon-btn danger"
                                aria-label={`Remove pricing option ${i + 1}`}
                                onClick={() => remove(i)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className="admin-field-grid">
                            <div className="wide">
                                <input
                                    type="text"
                                    value={row.label}
                                    placeholder="Label — e.g. Land package (per person)"
                                    onChange={(e) =>
                                        update(i, { label: e.target.value })
                                    }
                                />
                            </div>
                            <input
                                type="text"
                                value={row.price}
                                placeholder="Price — e.g. $1,450"
                                onChange={(e) =>
                                    update(i, { price: e.target.value })
                                }
                            />
                            <div className="wide">
                                <input
                                    type="text"
                                    value={row.note ?? ""}
                                    placeholder="Note (optional) — e.g. International flights not included"
                                    onChange={(e) =>
                                        update(i, { note: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                    </div>
                ))}
                <button type="button" className="admin-add-line" onClick={add}>
                    + Add pricing option
                </button>
            </div>
        </div>
    );
}

function PackingListEditor({
    categories,
    onChange,
}: {
    categories: PackingCategory[];
    onChange: (categories: PackingCategory[]) => void;
}) {
    function update(i: number, patch: Partial<PackingCategory>) {
        onChange(
            categories.map((c, idx) => (idx === i ? { ...c, ...patch } : c))
        );
    }
    function updateItems(i: number, items: string[]) {
        update(i, { items });
    }
    function remove(i: number) {
        onChange(categories.filter((_, idx) => idx !== i));
    }
    function add() {
        onChange([...categories, { category: "", items: [""] }]);
    }

    return (
        <div className="admin-field full">
            <span>Packing list ({categories.length} categories)</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {categories.map((cat, i) => (
                    <div className="admin-block" key={i}>
                        <div className="admin-block-head">
                            <span className="admin-block-title">
                                Category {i + 1}
                            </span>
                            <button
                                type="button"
                                className="admin-icon-btn danger"
                                aria-label={`Remove packing category ${i + 1}`}
                                onClick={() => remove(i)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className="admin-field-grid">
                            <div className="wide">
                                <input
                                    type="text"
                                    value={cat.category}
                                    placeholder="Category — e.g. Footwear"
                                    onChange={(e) =>
                                        update(i, { category: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                        <StringListEditor
                            title="Items in this category"
                            items={cat.items}
                            onChange={(items) => updateItems(i, items)}
                        />
                    </div>
                ))}
                <button type="button" className="admin-add-line" onClick={add}>
                    + Add category
                </button>
            </div>
        </div>
    );
}

function AcclimatizationEditor({
    stops,
    onChange,
}: {
    stops: AcclimatizationStop[];
    onChange: (stops: AcclimatizationStop[]) => void;
}) {
    function update(i: number, patch: Partial<AcclimatizationStop>) {
        onChange(stops.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
    }
    function remove(i: number) {
        onChange(stops.filter((_, idx) => idx !== i));
    }
    function add() {
        onChange([...stops, { day: stops.length + 1, title: "", note: "" }]);
    }

    return (
        <div className="admin-field full">
            <span>Acclimatization stops ({stops.length})</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {stops.map((stop, i) => (
                    <div className="admin-block" key={i}>
                        <div className="admin-block-head">
                            <span className="admin-block-title">Stop {i + 1}</span>
                            <button
                                type="button"
                                className="admin-icon-btn danger"
                                aria-label={`Remove acclimatization stop ${i + 1}`}
                                onClick={() => remove(i)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className="admin-field-grid">
                            <input
                                type="number"
                                min={1}
                                value={stop.day}
                                onChange={(e) =>
                                    update(i, { day: Number(e.target.value) })
                                }
                            />
                            <div className="wide">
                                <input
                                    type="text"
                                    value={stop.title}
                                    placeholder="Title — e.g. Rest day with a side hike"
                                    onChange={(e) =>
                                        update(i, { title: e.target.value })
                                    }
                                />
                            </div>
                            <div className="wide">
                                <textarea
                                    rows={2}
                                    value={stop.note}
                                    placeholder="What happens on this acclimatization stop…"
                                    onChange={(e) =>
                                        update(i, { note: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                    </div>
                ))}
                <button type="button" className="admin-add-line" onClick={add}>
                    + Add stop
                </button>
            </div>
        </div>
    );
}

function ReviewsEditor({
    reviews,
    onChange,
}: {
    reviews: Testimonial[];
    onChange: (reviews: Testimonial[]) => void;
}) {
    function update(i: number, patch: Partial<Testimonial>) {
        onChange(reviews.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
    }
    function remove(i: number) {
        onChange(reviews.filter((_, idx) => idx !== i));
    }
    function add() {
        onChange([...reviews, { name: "", trek: "", quote: "" }]);
    }

    return (
        <div className="admin-field full">
            <span>Reviews ({reviews.length})</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {reviews.map((r, i) => (
                    <div className="admin-block" key={i}>
                        <div className="admin-block-head">
                            <span className="admin-block-title">Review {i + 1}</span>
                            <button
                                type="button"
                                className="admin-icon-btn danger"
                                aria-label={`Remove review ${i + 1}`}
                                onClick={() => remove(i)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className="admin-field-grid">
                            <input
                                type="text"
                                value={r.name}
                                placeholder="Reviewer name"
                                onChange={(e) =>
                                    update(i, { name: e.target.value })
                                }
                            />
                            <input
                                type="text"
                                value={r.trek}
                                placeholder="Trek / trip"
                                onChange={(e) =>
                                    update(i, { trek: e.target.value })
                                }
                            />
                            <div className="wide">
                                <textarea
                                    rows={3}
                                    value={r.quote}
                                    placeholder="Their review…"
                                    onChange={(e) =>
                                        update(i, { quote: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                    </div>
                ))}
                <button type="button" className="admin-add-line" onClick={add}>
                    + Add review
                </button>
            </div>
        </div>
    );
}

function GuidesEditor({
    guides,
    onChange,
}: {
    guides: TrekGuide[];
    onChange: (guides: TrekGuide[]) => void;
}) {
    function update(i: number, patch: Partial<TrekGuide>) {
        onChange(guides.map((g, idx) => (idx === i ? { ...g, ...patch } : g)));
    }
    function remove(i: number) {
        onChange(guides.filter((_, idx) => idx !== i));
    }
    function add() {
        onChange([
            ...guides,
            { name: "", role: "", region: "", bio: "", image: "" },
        ]);
    }

    return (
        <div className="admin-field full">
            <span>Guides ({guides.length})</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {guides.map((g, i) => (
                    <div className="admin-block" key={i}>
                        <div className="admin-block-head">
                            <span className="admin-block-title">Guide {i + 1}</span>
                            <button
                                type="button"
                                className="admin-icon-btn danger"
                                aria-label={`Remove guide ${i + 1}`}
                                onClick={() => remove(i)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className="admin-field-grid">
                            <input
                                type="text"
                                value={g.name}
                                placeholder="Name"
                                onChange={(e) =>
                                    update(i, { name: e.target.value })
                                }
                            />
                            <input
                                type="text"
                                value={g.role}
                                placeholder="Role — e.g. Trekking guide"
                                onChange={(e) =>
                                    update(i, { role: e.target.value })
                                }
                            />
                            <input
                                type="text"
                                value={g.region ?? ""}
                                placeholder="Region (optional)"
                                onChange={(e) =>
                                    update(i, { region: e.target.value })
                                }
                            />
                            <input
                                type="text"
                                list="admin-image-options"
                                value={g.image ?? ""}
                                placeholder="Photo path (optional)"
                                onChange={(e) =>
                                    update(i, { image: e.target.value })
                                }
                            />
                            <div className="wide">
                                <textarea
                                    rows={2}
                                    value={g.bio ?? ""}
                                    placeholder="Short bio (optional)"
                                    onChange={(e) =>
                                        update(i, { bio: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                    </div>
                ))}
                <button type="button" className="admin-add-line" onClick={add}>
                    + Add guide
                </button>
            </div>
        </div>
    );
}

/* ============================================================
   MAIN EDITOR
   ============================================================ */

export default function TrekEditorScreen() {
    const params = useParams<{ slug: string }>();
    const router = useRouter();
    const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

    const isNew = slug === "new";
    const [form, setForm] = useState<Trek | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    useEffect(() => {
        if (isNew) {
            setForm(blankTrek());
        } else {
            const existing = getTrek(slug);
            if (existing) setForm(existing);
            else setNotFound(true);
        }
    }, [slug, isNew]);

    const isEditingExisting = useMemo(
        () => !isNew && !notFound,
        [isNew, notFound]
    );

    function update<K extends keyof Trek>(key: K, value: Trek[K]) {
        setForm((f) => (f ? { ...f, [key]: value } : f));
        setError(null);
    }

    async function handleImageUpload(file: File | undefined | null) {
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            setUploadError("Please choose an image file (JPG, PNG, WebP…).");
            return;
        }
        setUploading(true);
        setUploadError(null);
        try {
            const dataUrl = await fileToDataUrl(file);
            update("image", dataUrl);
        } catch (err) {
            setUploadError(
                err instanceof Error ? err.message : "Image upload failed."
            );
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    }

    async function handleSave() {
        if (!form) return;
        if (!form.name.trim()) {
            setError("Please give the trek a name.");
            return;
        }
        let slugToSave = form.slug.trim();
        if (isNew) {
            slugToSave = slugToSave || slugify(form.name);
        }
        if (!slugToSave) {
            setError("Please enter a URL slug (or we’ll build one from the name).");
            return;
        }
        if (!form.image.trim()) {
            setError("Please pick a cover image for the trek.");
            return;
        }
        if (form.itinerary.length === 0) {
            setError("Please add at least one itinerary day.");
            return;
        }

        const trekToSave = {
            ...form,
            slug: slugToSave,
            name: form.name.trim(),
        };

        // Always keep the admin panel working via localStorage.
        saveTrek(trekToSave);
        setSaved(true);
        window.setTimeout(() => setSaved(false), 3000);

        // Persist to the database too, so the trek shows up on the public
        // /treks page and can be booked. If the DB sync fails we stay on this
        // page and show the error instead of silently losing the trek.
        try {
            const res = await fetch("/api/admin/treks", {
                method: "POST",
                headers: {
                    ...adminHeaders(),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ trek: trekToSave }),
            });
            if (!res.ok) {
                const data = (await res.json().catch(() => null)) as {
                    error?: string;
                } | null;
                setError(
                    data?.error ??
                    "Saved in the admin panel, but could not sync this trek to the live site. Please try again."
                );
                return;
            }
        } catch {
            setError(
                "Saved in the admin panel, but could not reach the server. Please try again."
            );
            return;
        }

        router.push("/admin/treks");
    }

    if (notFound) {
        return (
            <div className="admin-card">
                <div className="admin-empty">
                    <div className="admin-empty-icon">⛰</div>
                    <h3>Trek not found</h3>
                    <p>
                        We couldn’t find a trek with the slug “{slug}”.
                    </p>
                    <p style={{ marginTop: 16 }}>
                        <Link
                            href="/admin/treks"
                            className="admin-btn admin-btn-primary"
                        >
                            Back to treks
                        </Link>
                    </p>
                </div>
            </div>
        );
    }

    if (!form) {
        return <p className="admin-empty">Loading trek…</p>;
    }

    return (
        <>
            <div className="admin-topbar">
                <div>
                    <h1>{isNew ? "Add a new trek" : `Edit — ${form.name || "Untitled trek"}`}</h1>
                    <p>
                        {isNew
                            ? "Fill in the details below. New treks appear on the public site immediately."
                            : `Editing /treks/${form.slug}. Changes are saved to your browser.`}
                    </p>
                </div>
                <div className="admin-topbar-actions">
                    <Link
                        href="/admin/treks"
                        className="admin-btn admin-btn-ghost"
                    >
                        ← Back to list
                    </Link>
                </div>
            </div>

            {error && (
                <div className="admin-login-error" role="alert">
                    {error}
                </div>
            )}
            {saved && (
                <div className="admin-flash" role="status">
                    ✓ Saved successfully
                </div>
            )}

            <div className="admin-card">
                <div className="admin-card-head">
                    <div>
                        <h2>Core details</h2>
                        <span className="admin-card-sub">
                            Everything that identifies the trek on the site
                        </span>
                    </div>
                </div>
                <div className="admin-card-body">
                    <div className="admin-form-grid">
                        <Field label="Trek name" full>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => update("name", e.target.value)}
                                placeholder="e.g. Everest Base Camp Trek"
                            />
                        </Field>

                        <Field
                            label="URL slug"
                            full
                            hint={
                                isNew
                                    ? "Leave blank to build one from the name. Cannot be changed after creation."
                                    : "The URL is fixed once a trek exists."
                            }
                        >
                            <input
                                type="text"
                                value={form.slug}
                                disabled={!isNew}
                                onChange={(e) =>
                                    update("slug", slugify(e.target.value))
                                }
                                placeholder="everest-base-camp"
                            />
                        </Field>

                        <Field
                            label="Cover image"
                            full
                            hint="Pick an existing image, or upload your own (JPG/PNG). Uploaded images are resized and stored with the trek."
                        >
                            <div className="admin-image-picker">
                                <div className="admin-image-preview">
                                    {/* eslint-disable @next/next/no-img-element -- preview may be a base64 data URL that next/image cannot optimize */}
                                    {form.image ? (
                                        <img
                                            src={form.image}
                                            alt="Cover preview"
                                        />
                                    ) : (
                                        <span className="admin-image-empty">
                                            No image
                                        </span>
                                    )}
                                    {/* eslint-enable @next/next/no-img-element */}
                                </div>
                                <div className="admin-image-controls">
                                    <input
                                        type="text"
                                        list="admin-image-options"
                                        value={form.image}
                                        onChange={(e) =>
                                            update("image", e.target.value)
                                        }
                                        placeholder="/images/everest.jpg"
                                    />
                                    <datalist id="admin-image-options">
                                        {IMAGE_OPTIONS.map((img) => (
                                            <option key={img} value={img} />
                                        ))}
                                    </datalist>
                                    <div className="admin-image-actions">
                                        <button
                                            type="button"
                                            className="admin-btn admin-btn-ghost admin-btn-sm"
                                            onClick={() =>
                                                fileInputRef.current?.click()
                                            }
                                            disabled={uploading}
                                        >
                                            {uploading
                                                ? "Uploading…"
                                                : "⬆ Upload image"}
                                        </button>
                                        {uploadError && (
                                            <span
                                                className="admin-image-error"
                                                role="alert"
                                            >
                                                {uploadError}
                                            </span>
                                        )}
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={(e) =>
                                            handleImageUpload(
                                                e.target.files?.[0]
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        </Field>

                        <Field label="Region">
                            <select
                                value={form.region}
                                onChange={(e) =>
                                    update("region", e.target.value as Region)
                                }
                            >
                                {REGION_OPTIONS.map((r) => (
                                    <option key={r.value} value={r.value}>
                                        {r.label}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Region label" hint="Full descriptive text, e.g. “Khumbu, Solukhumbu District”.">
                            <input
                                type="text"
                                value={form.regionLabel}
                                onChange={(e) => update("regionLabel", e.target.value)}
                                placeholder="Khumbu, Solukhumbu District"
                            />
                        </Field>

                        <Field label="Duration (days)">
                            <input
                                type="number"
                                min={1}
                                value={form.days}
                                onChange={(e) =>
                                    update("days", Number(e.target.value))
                                }
                            />
                        </Field>

                        <Field label="Grade">
                            <input
                                type="text"
                                list="admin-grades"
                                value={form.grade}
                                onChange={(e) => update("grade", e.target.value)}
                                placeholder="Moderate"
                            />
                            <datalist id="admin-grades">
                                {[
                                    "Easy",
                                    "Easy To Moderate",
                                    "Moderate",
                                    "Moderate-Difficult",
                                    "Difficult",
                                    "Challenging",
                                ].map((g) => (
                                    <option key={g} value={g} />
                                ))}
                            </datalist>
                        </Field>

                        <Field label="Max altitude">
                            <input
                                type="text"
                                value={form.altitude}
                                onChange={(e) => update("altitude", e.target.value)}
                                placeholder="17,600 ft / 5,364 m"
                            />
                        </Field>

                        <Field label="Starting point">
                            <input
                                type="text"
                                value={form.startPoint}
                                onChange={(e) => update("startPoint", e.target.value)}
                                placeholder="Kathmandu → Lukla (flight)"
                            />
                        </Field>

                        <Field label="Best months">
                            <input
                                type="text"
                                value={form.bestMonths}
                                onChange={(e) => update("bestMonths", e.target.value)}
                                placeholder="Mar–May, Sep–Nov"
                            />
                        </Field>

                        <Field label="Group size">
                            <input
                                type="text"
                                value={form.groupSize}
                                onChange={(e) => update("groupSize", e.target.value)}
                                placeholder="4–14"
                            />
                        </Field>

                        <Field label="Price per person">
                            <input
                                type="text"
                                value={form.price}
                                onChange={(e) => update("price", e.target.value)}
                                placeholder="$1,450"
                            />
                        </Field>

                        <Field label="Overview" full>
                            <textarea
                                rows={4}
                                value={form.overview}
                                onChange={(e) => update("overview", e.target.value)}
                                placeholder="A few sentences introducing the trek…"
                            />
                        </Field>
                    </div>
                </div>
            </div>

            <div className="admin-card">
                <div className="admin-card-head">
                    <div>
                        <h2>Highlights, included & excluded</h2>
                        <span className="admin-card-sub">
                            Bullet lists shown on the trek detail page
                        </span>
                    </div>
                </div>
                <div className="admin-card-body">
                    <div className="admin-form-grid">
                        <StringListEditor
                            title="Highlights"
                            items={form.highlights}
                            onChange={(items) => update("highlights", items)}
                        />
                        <StringListEditor
                            title="What’s included"
                            items={form.included}
                            onChange={(items) => update("included", items)}
                        />
                        <StringListEditor
                            title="What’s excluded"
                            items={form.excluded}
                            onChange={(items) => update("excluded", items)}
                        />
                    </div>
                </div>
            </div>

            <div className="admin-card">
                <div className="admin-card-head">
                    <div>
                        <h2>Itinerary</h2>
                        <span className="admin-card-sub">
                            Day-by-day breakdown for the elevation profile and page
                        </span>
                    </div>
                </div>
                <div className="admin-card-body">
                    <ItineraryEditor
                        days={form.itinerary}
                        onChange={(days) => update("itinerary", days)}
                    />
                </div>
            </div>

            <div className="admin-card">
                <div className="admin-card-head">
                    <div>
                        <h2>FAQs</h2>
                        <span className="admin-card-sub">
                            Common questions shown on the trek page
                        </span>
                    </div>
                </div>
                <div className="admin-card-body">
                    <FaqEditor
                        faqs={form.faqs}
                        onChange={(faqs) => update("faqs", faqs)}
                    />
                </div>
            </div>

            <div className="admin-card">
                <div className="admin-card-head">
                    <div>
                        <h2>Route & access</h2>
                        <span className="admin-card-sub">
                            Best season, finishing point, getting there and permits
                        </span>
                    </div>
                </div>
                <div className="admin-card-body">
                    <div className="admin-form-grid">
                        <Field
                            label="Best season"
                            hint="Human-readable summary, e.g. “Spring (Mar–May) & Autumn (Sep–Nov)”."
                        >
                            <input
                                type="text"
                                value={form.bestSeason ?? ""}
                                onChange={(e) =>
                                    update("bestSeason", e.target.value)
                                }
                                placeholder="Spring (Mar–May) & Autumn (Sep–Nov)"
                            />
                        </Field>
                        <Field
                            label="Ending point"
                            hint="Where the trek finishes."
                        >
                            <input
                                type="text"
                                value={form.endingPoint ?? ""}
                                onChange={(e) =>
                                    update("endingPoint", e.target.value)
                                }
                                placeholder="Kathmandu"
                            />
                        </Field>
                        <StringListEditor
                            title="How to reach the trailhead"
                            items={form.howToReach ?? []}
                            onChange={(items) => update("howToReach", items)}
                        />
                        <StringListEditor
                            title="Permits required"
                            items={form.permits ?? []}
                            onChange={(items) => update("permits", items)}
                        />
                    </div>
                </div>
            </div>

            <div className="admin-card">
                <div className="admin-card-head">
                    <div>
                        <h2>Staying on the trail</h2>
                        <span className="admin-card-sub">
                            Accommodation and meals during the trek
                        </span>
                    </div>
                </div>
                <div className="admin-card-body">
                    <div className="admin-form-grid">
                        <StringListEditor
                            title="Accommodation"
                            items={form.accommodation ?? []}
                            onChange={(items) => update("accommodation", items)}
                        />
                        <StringListEditor
                            title="Food & meals"
                            items={form.food ?? []}
                            onChange={(items) => update("food", items)}
                        />
                    </div>
                </div>
            </div>

            <div className="admin-card">
                <div className="admin-card-head">
                    <div>
                        <h2>Cost & pricing</h2>
                        <span className="admin-card-sub">
                            Pricing options shown in the Cost & Pricing section
                        </span>
                    </div>
                </div>
                <div className="admin-card-body">
                    <PricingEditor
                        rows={form.pricing ?? []}
                        onChange={(rows) => update("pricing", rows)}
                    />
                </div>
            </div>

            <div className="admin-card">
                <div className="admin-card-head">
                    <div>
                        <h2>Trek essentials — packing list</h2>
                        <span className="admin-card-sub">
                            Categorized packing list shown in the Trek Essentials section
                        </span>
                    </div>
                </div>
                <div className="admin-card-body">
                    <PackingListEditor
                        categories={form.packingList ?? []}
                        onChange={(categories) => update("packingList", categories)}
                    />
                </div>
            </div>

            <div className="admin-card">
                <div className="admin-card-head">
                    <div>
                        <h2>Fitness, safety & policy</h2>
                        <span className="admin-card-sub">
                            Fitness guidance, health & safety notes and cancellation terms
                        </span>
                    </div>
                </div>
                <div className="admin-card-body">
                    <div className="admin-form-grid">
                        <StringListEditor
                            title="Fitness guidance"
                            items={form.fitness ?? []}
                            onChange={(items) => update("fitness", items)}
                        />
                        <StringListEditor
                            title="Health & safety"
                            items={form.healthSafety ?? []}
                            onChange={(items) => update("healthSafety", items)}
                        />
                        <StringListEditor
                            title="Cancellation / refund policy"
                            items={form.cancellationPolicy ?? []}
                            onChange={(items) => update("cancellationPolicy", items)}
                        />
                    </div>
                </div>
            </div>

            <div className="admin-card">
                <div className="admin-card-head">
                    <div>
                        <h2>Acclimatization</h2>
                        <span className="admin-card-sub">
                            Dedicated rest & acclimatization stops (leave empty to derive from the itinerary)
                        </span>
                    </div>
                </div>
                <div className="admin-card-body">
                    <AcclimatizationEditor
                        stops={form.acclimatization ?? []}
                        onChange={(stops) => update("acclimatization", stops)}
                    />
                </div>
            </div>

            <div className="admin-card">
                <div className="admin-card-head">
                    <div>
                        <h2>Media & gallery</h2>
                        <span className="admin-card-sub">
                            YouTube video and extra route photos for the page
                        </span>
                    </div>
                </div>
                <div className="admin-card-body">
                    <div className="admin-form-grid">
                        <Field
                            label="Video (YouTube ID)"
                            hint="Leave blank to use the automatic region video."
                        >
                            <input
                                type="text"
                                value={form.video ?? ""}
                                onChange={(e) => update("video", e.target.value)}
                                placeholder="e.g. dY3D1Bf5XzM"
                            />
                        </Field>
                    </div>
                    <StringListEditor
                        title="Gallery photos"
                        items={form.gallery ?? []}
                        onChange={(items) => update("gallery", items)}
                    />
                </div>
            </div>

            <div className="admin-card">
                <div className="admin-card-head">
                    <div>
                        <h2>Reviews & guides</h2>
                        <span className="admin-card-sub">
                            Testimonials and featured local guides. Leave empty to use the site-wide ones.
                        </span>
                    </div>
                </div>
                <div className="admin-card-body">
                    <ReviewsEditor
                        reviews={form.reviews ?? []}
                        onChange={(reviews) => update("reviews", reviews)}
                    />
                    <GuidesEditor
                        guides={form.guides ?? []}
                        onChange={(guides) => update("guides", guides)}
                    />
                </div>
            </div>

            <div className="admin-editor-sticky">
                <span className="admin-save-hint">
                    {isEditingExisting
                        ? `Updating /treks/${form.slug}`
                        : "This will create a new trek page."}
                </span>
                <Link
                    href="/admin/treks"
                    className="admin-btn admin-btn-ghost"
                >
                    Cancel
                </Link>
                <button
                    type="button"
                    className="admin-btn admin-btn-primary"
                    onClick={handleSave}
                >
                    {isNew ? "Create trek" : "Save changes"}
                </button>
            </div>
        </>
    );
}
