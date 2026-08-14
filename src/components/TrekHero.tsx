"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { Trek } from "@/lib/types";

interface TrekHeroProps {
    trek: Trek;
}

/** "17,600 ft / 5,364 m" → "17,600 ft" */
function elevationText(altitude: string): string {
    return altitude.split("/")[0].trim();
}

/**
 * Hero for trek detail pages.
 *
 * Shows the trek photo at full quality (no cinematic colour-grading or
 * overlays). Clicking the photo opens it in a full-screen lightbox.
 */
export default function TrekHero({ trek }: TrekHeroProps) {
    const [lightboxOpen, setLightboxOpen] = useState(false);

    const closeLightbox = useCallback(() => setLightboxOpen(false), []);

    // Close on Escape and lock body scroll while the lightbox is open.
    useEffect(() => {
        if (!lightboxOpen) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                closeLightbox();
            }
        };
        window.addEventListener("keydown", onKeyDown);
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = "";
        };
    }, [lightboxOpen, closeLightbox]);

    return (
        <>
            <section className="trek-hero">
                {/* The photo itself — click to open in full screen */}
                <button
                    type="button"
                    className="trek-hero-bg"
                    onClick={() => setLightboxOpen(true)}
                    aria-label={`View the ${trek.name} photo full screen`}
                >
                    <Image
                        src={trek.image}
                        alt={`${trek.name} in the Nepal Himalaya`}
                        fill
                        priority
                        quality={95}
                        sizes="100vw"
                    />
                    <span className="trek-hero-hint">
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M15 3h6v6" />
                            <path d="M9 21H3v-6" />
                            <path d="M21 3l-7 7" />
                            <path d="M3 21l7-7" />
                        </svg>
                        View photo
                    </span>
                </button>

                {/* White text overlay sitting on the lower third */}
                <div className="wrap trek-hero-content">
                    <div className="eyebrow">{trek.regionLabel}</div>
                    <h1>{trek.name}</h1>
                    <p className="lede">{trek.overview}</p>
                    <div className="trek-hero-meta">
                        <div>
                            <span className="lbl">Duration</span>
                            <span className="val">{trek.days} Days</span>
                        </div>
                        <div>
                            <span className="lbl">Grade</span>
                            <span className="val">{trek.grade}</span>
                        </div>
                        <div>
                            <span className="lbl">Max Altitude</span>
                            <span className="val">{elevationText(trek.altitude)}</span>
                        </div>
                        <div>
                            <span className="lbl">From</span>
                            <span className="val">{trek.price}</span>
                        </div>
                    </div>
                </div>
            </section>

            {lightboxOpen && (
                <div
                    className="lightbox"
                    role="dialog"
                    aria-modal="true"
                    aria-label={`${trek.name} photo`}
                    onClick={closeLightbox}
                >
                    <figure
                        className="lightbox-figure"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={trek.image}
                            alt={`${trek.name} in the Nepal Himalaya`}
                            fill
                            quality={95}
                            sizes="100vw"
                        />
                    </figure>
                    <button
                        type="button"
                        className="lightbox-close"
                        onClick={closeLightbox}
                        aria-label="Close photo"
                    >
                        ×
                    </button>
                </div>
            )}
        </>
    );
}
