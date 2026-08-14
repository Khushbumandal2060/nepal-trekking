/**
 * PackingList — the "Trek Essentials" section of the trek detail page.
 *
 * Shows the trek's own categorized packing list when the admin has set one;
 * otherwise falls back to a site-wide standard list (clearly generic, never
 * trek-specific claims). Each category is an accordion so the long list stays
 * compact on mobile. Renders the "send me the full list" CTA that opens a
 * prefilled contact enquiry.
 */
"use client";

import { useState } from "react";
import type { PackingCategory } from "@/lib/types";

/**
 * Generic, always-safe default packing guidance. This is deliberately broad
 * (climate, altitude, teahouse trekking) and is never presented as specific
 * to one trek — treks that want bespoke lists get them via `Trek.packingList`.
 */
const DEFAULT_PACKING_LIST: PackingCategory[] = [
    {
        category: "Clothing",
        items: [
            "Base layers (2–3 sets) — merino or synthetic, worn next to skin",
            "Insulating mid layer — fleece or light down jacket",
            "Waterproof & windproof shell jacket and trousers",
            "Warm hat, sun hat, buff and lightweight gloves",
            "Trekking trousers (2) and t-shirts (3–4)",
        ],
    },
    {
        category: "Footwear",
        items: [
            "Sturdy, broken-in trekking boots with ankle support",
            "Camp shoes / sandals for the evenings in the lodge",
            "Trekking socks (3–4 pairs) and liner socks",
            "Gaiters (recommended on snowy or muddy trails)",
        ],
    },
    {
        category: "Gear",
        items: [
            "Daypack (30–40 L) with rain cover",
            "Sleeping bag rated to the trek's coldest night",
            "Trekking poles (can also be rented in Kathmandu)",
            "Headlamp or torch with spare batteries",
        ],
    },
    {
        category: "Essentials",
        items: [
            "Water bottles or bladder (2 L total) and water purification",
            "High-SPF sunscreen, lip balm and UV sunglasses",
            "Personal first-aid kit and any prescription medication",
            "Passport, permits, insurance details and emergency contacts",
        ],
    },
    {
        category: "Optional",
        items: [
            "Camera or phone with offline maps",
            "Power bank — charging on the trail is limited",
            "Small padlock for your pack",
            "Snacks you don't want to be without",
        ],
    },
];

function CategoryBlock({
    category,
    items,
    defaultOpen,
}: {
    category: string;
    items: string[];
    defaultOpen?: boolean;
}) {
    const [open, setOpen] = useState(Boolean(defaultOpen));

    return (
        <div className={open ? "pack-cat is-open" : "pack-cat"}>
            <button
                type="button"
                className="pack-cat-head"
                aria-expanded={open}
                onClick={() => setOpen(!open)}
            >
                <span>{category}</span>
                <svg
                    className={open ? "pack-chevron pack-chevron--open" : "pack-chevron"}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </button>
            {open && (
                <ul className="pack-cat-list">
                    {items.map((item, i) => (
                        <li key={`${item.slice(0, 20)}-${i}`}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M20 6 9 17l-5-5" />
                            </svg>
                            {item}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

interface PackingListProps {
    categories?: PackingCategory[];
    trekName: string;
}

export default function PackingList({ categories, trekName }: PackingListProps) {
    const list = categories && categories.length > 0 ? categories : DEFAULT_PACKING_LIST;

    return (
        <div className="packing-wrap">
            <div className="packing-grid">
                {list.map((cat, i) => (
                    <CategoryBlock
                        key={cat.category}
                        category={cat.category}
                        items={cat.items}
                        defaultOpen={i === 0}
                    />
                ))}
            </div>
            <div className="packing-cta">
                <p>
                    Not sure what to bring? Tell us when you enquire and we will send the
                    full, trek-specific gear list for {trekName} with your confirmation.
                </p>
                <a
                    className="btn btn-ghost"
                    href={`/contact?subject=Gear list for ${encodeURIComponent(trekName)}`}
                >
                    Request the full gear list
                </a>
            </div>
        </div>
    );
}
