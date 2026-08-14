import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/seo";

export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    background: "linear-gradient(160deg, #10161f 0%, #1c2a3a 55%, #25324a 100%)",
                    padding: 72,
                    color: "#f4f6f8",
                    fontFamily: "sans-serif",
                }}
            >
                {/* Mountains */}
                <div
                    style={{
                        position: "absolute",
                        right: 56,
                        top: 60,
                        width: 0,
                        height: 0,
                        borderLeft: "140px solid transparent",
                        borderRight: "140px solid transparent",
                        borderBottom: "230px solid rgba(217,102,44,0.35)",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        right: 160,
                        top: 90,
                        width: 0,
                        height: 0,
                        borderLeft: "170px solid transparent",
                        borderRight: "170px solid transparent",
                        borderBottom: "280px solid rgba(232,236,241,0.14)",
                    }}
                />

                <div
                    style={{
                        position: "absolute",
                        left: 72,
                        bottom: 60,
                        fontSize: 20,
                        letterSpacing: 6,
                        textTransform: "uppercase",
                        color: "#D9662C",
                        fontWeight: 600,
                    }}
                >
                    Nepal treks only · Since 2013
                </div>

                <div style={{ display: "flex", flexDirection: "column", marginTop: "auto" }}>
                    <div
                        style={{
                            fontSize: 22,
                            letterSpacing: 3,
                            textTransform: "uppercase",
                            color: "#D9662C",
                            marginBottom: 16,
                            fontWeight: 600,
                        }}
                    >
                        {SITE_TAGLINE}
                    </div>
                    <div
                        style={{
                            fontSize: 76,
                            fontWeight: 800,
                            lineHeight: 1.05,
                            maxWidth: 720,
                        }}
                    >
                        {SITE_NAME}
                    </div>
                    <div
                        style={{
                            fontSize: 30,
                            color: "#c7d0da",
                            maxWidth: 780,
                            marginTop: 20,
                            lineHeight: 1.3,
                        }}
                    >
                        Everest · Annapurna · Manaslu · Langtang · Mustang · Kanchenjunga
                    </div>
                </div>
            </div>
        ),
        size
    );
}
