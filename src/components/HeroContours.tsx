/** Decorative contour-line background used in the home hero. */
export default function HeroContours() {
    return (
        <svg
            className="hero-contours"
            viewBox="0 0 1200 800"
            preserveAspectRatio="xMidYMax slice"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#101B26" stopOpacity="0" />
                    <stop offset="100%" stopColor="#101B26" stopOpacity="1" />
                </linearGradient>
            </defs>
            <g fill="none" stroke="#8FBAC9" strokeWidth="1">
                <path
                    opacity="0.15"
                    d="M-50,650 C150,560 300,700 500,600 C700,500 850,640 1050,560 C1150,520 1200,560 1250,540"
                />
                <path
                    opacity="0.2"
                    d="M-50,700 C150,610 300,730 500,650 C700,560 850,690 1050,610 C1150,580 1200,600 1250,590"
                />
                <path
                    opacity="0.25"
                    d="M-50,750 C150,660 300,760 500,700 C700,620 850,730 1050,660 C1150,630 1200,650 1250,640"
                />
                <path
                    opacity="0.3"
                    d="M-50,800 C150,710 300,800 500,750 C700,680 850,780 1050,710 C1150,680 1200,700 1250,690"
                />
            </g>
            <rect x="0" y="0" width="1200" height="800" fill="url(#fade)" />
        </svg>
    );
}
