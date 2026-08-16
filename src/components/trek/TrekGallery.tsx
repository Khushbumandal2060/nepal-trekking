/**
 * TrekGallery — a mosaic photo gallery for trek detail pages.
 *
 * Shows the trek's route photos in an editorial grid. Clicking a tile opens a
 * full-screen lightbox with prev/next navigation, a photo counter, captions
 * and full keyboard support (Escape closes, arrow keys move between photos).
 * Reuses the site-wide `.lightbox` styles so it matches the hero's lightbox.
 */
"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export interface GalleryImage {
    src: string;
    alt: string;
    caption?: string;
}

interface TrekGalleryProps {
    images: GalleryImage[];
    trekName: string;
}

/** Cap the on-page mosaic so the section stays tidy; lightbox shows only these. */
const MAX_VISIBLE = 8;

/** The first tile becomes a large featured tile once there are enough photos. */
const FEATURED_THRESHOLD = 6;

export default function TrekGallery({ images, trekName }: TrekGalleryProps) {
    const [index, setIndex] = useState<number | null>(null);
    const open = index !== null;

    const close = useCallback(() => setIndex(null), []);

    const prev = useCallback(() => {
        setIndex((i) =>
            i === null ? i : (i - 1 + images.length) % images.length
        );
    }, [images.length]);

    const next = useCallback(() => {
        setIndex((i) => (i === null ? i : (i + 1) % images.length));
    }, [images.length]);

    // Escape closes, arrow keys navigate; lock body scroll while open.
    useEffect(() => {
        if (!open) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") close();
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
        };
        window.addEventListener("keydown", onKeyDown);
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = "";
        };
    }, [open, close, prev, next]);

    const visible = images.slice(0, MAX_VISIBLE);
    const featured = visible.length >= FEATURED_THRESHOLD;
    const current = index !== null ? images[index] : null;

    return (
        <>
            <div className="gallery-grid">
                {visible.map((img, i) => (
                    <button
                        key={`${img.src}-${i}`}
                        type="button"
                        className={`gallery-item${
                            i === 0 && featured ? " gallery-item--featured" : ""
                        }`}
                        onClick={() => setIndex(i)}
                        aria-label={`Open photo ${i + 1} of ${visible.length}: ${img.alt}`}
                    >
                        <Image
                            src={img.src}
                            alt={img.alt}
                            fill
                            sizes="(min-width: 900px) 33vw, (min-width: 600px) 50vw, 100vw"
                            loading={i < 3 ? "eager" : "lazy"}
                        />
                        {img.caption && (
                            <span className="gallery-caption">
                                <span>{img.caption}</span>
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {open && current && (
                <div
                    className="lightbox gallery-lightbox"
                    role="dialog"
                    aria-modal="true"
                    aria-label={`${trekName} photo gallery`}
                    onClick={close}
                >
                    <figure
                        className="lightbox-figure"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={current.src}
                            alt={current.alt}
                            fill
                            sizes="100vw"
                        />
                        {current.caption && (
                            <figcaption>{current.caption}</figcaption>
                        )}
                    </figure>

                    <button
                        type="button"
                        className="lightbox-close"
                        onClick={close}
                        aria-label="Close gallery"
                    >
                        ×
                    </button>

                    <button
                        type="button"
                        className="gallery-nav gallery-nav--prev"
                        onClick={(e) => {
                            e.stopPropagation();
                            prev();
                        }}
                        aria-label="Previous photo"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        className="gallery-nav gallery-nav--next"
                        onClick={(e) => {
                            e.stopPropagation();
                            next();
                        }}
                        aria-label="Next photo"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M9 6l6 6-6 6" />
                        </svg>
                    </button>

                    <span className="gallery-count" aria-live="polite">
                        {index + 1} / {images.length}
                    </span>
                </div>
            )}
        </>
    );
}
