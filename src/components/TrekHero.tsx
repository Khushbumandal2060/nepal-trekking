import Image from "next/image";
import type { Trek } from "@/lib/types";

interface TrekHeroProps {
    trek: Trek;
}

/** "17,600 ft / 5,364 m" → "17,600 ft" */
function elevationText(altitude: string): string {
    return altitude.split("/")[0].trim();
}

/**
 * Cinematic ultrawide hero for trek detail pages.
 *
 * Reproduces a deep-blue-hour / nautical-twilight grade over the trek photo:
 * desaturated cool palette (midnight blue, slate, charcoal), subtle alpenglow
 * only at the summits, layered ridge haze, anamorphic-style vignette, film
 * grain, and a crushed-black lower third intentionally kept dark for the
 * white text overlay — no bright sky, no flare, no overexposure.
 */
export default function TrekHero({ trek }: TrekHeroProps) {
    return (
        <section className="trek-hero">
            {/* Base photography, desaturated toward a cool blue-hour grade */}
            <div className="trek-hero-bg">
                <Image
                    src={trek.image}
                    alt={`${trek.name} under a deep blue-hour sky in the Nepal Himalaya`}
                    fill
                    priority
                    quality={95}
                    sizes="100vw"
                />
            </div>

            {/* Colour-grade washes (indigo → charcoal) */}
            <div className="trek-hero-grade" aria-hidden="true" />
            <div className="trek-hero-tint" aria-hidden="true" />

            {/* Alpenglow touching only the highest summits */}
            <div className="trek-hero-alpenglow" aria-hidden="true" />

            {/* Layers of ridges fading into atmospheric haze over a faint
                moraine/rock foreground in the crushed-black zone */}
            <div className="trek-hero-haze" aria-hidden="true">
                <svg
                    viewBox="0 0 1440 400"
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M0,180 C120,150 240,200 380,160 C520,120 640,210 800,150 C960,90 1120,200 1300,140 L1440,120 L1440,400 L0,400 Z"
                        fill="#8CA0BE"
                        opacity="0.06"
                    />
                    <path
                        d="M0,240 C140,200 300,270 460,220 C620,170 760,260 940,210 C1100,160 1260,250 1440,200 L1440,400 L0,400 Z"
                        fill="#5A6E96"
                        opacity="0.1"
                    />
                    <path
                        d="M0,300 C160,260 320,330 500,290 C680,250 820,340 1020,300 C1180,270 1320,330 1440,300 L1440,400 L0,400 Z"
                        fill="#2E4060"
                        opacity="0.16"
                    />
                    <path
                        d="M0,360 C180,330 360,380 560,355 C760,330 920,385 1120,360 C1280,345 1380,375 1440,360 L1440,400 L0,400 Z"
                        fill="#141C2E"
                        opacity="0.5"
                    />
                </svg>
            </div>

            {/* Vignette + crushed-black text zone + film grain */}
            <div className="trek-hero-vignette" aria-hidden="true" />
            <div className="trek-hero-scrim" aria-hidden="true" />
            <div className="trek-hero-grain" aria-hidden="true" />

            {/* White text overlay sitting on the dark lower third */}
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
    );
}
