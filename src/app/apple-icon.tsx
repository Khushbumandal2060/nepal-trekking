import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#10161f",
                    borderRadius: "18%",
                }}
            >
                <svg
                    width="120"
                    height="120"
                    viewBox="0 0 64 64"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M10 46 L24 22 L32 34 L38 24 L54 46 Z" fill="#D9662C" />
                    <path d="M20 52 L44 52 L44 47 L20 47 Z" fill="#E8ECF1" />
                    <circle cx="45" cy="18" r="4" fill="#fff" opacity="0.9" />
                </svg>
            </div>
        ),
        size
    );
}
