interface RidgeSVGProps {
    seed?: number;
}

/** Decorative mountain-ridge artwork generated from the legacy `ridgeSVG()` helper. */
export default function RidgeSVG({ seed = 0 }: RidgeSVGProps) {
    const s = seed;
    return (
        <svg viewBox="0 0 400 120" preserveAspectRatio="none">
            <polygon
                points={`0,120 0,70 60,${40 - (s % 3) * 6} 130,80 200,${20 + (s % 4) * 5} 270,75 330,35 400,65 400,120`}
                fill="#233b52"
            />
            <polygon
                points="0,120 0,90 90,60 180,95 260,50 340,90 400,70 400,120"
                fill="#1B2C3D"
            />
        </svg>
    );
}
