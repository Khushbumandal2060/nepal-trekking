import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_TAGLINE, SITE_DESCRIPTION } from "@/lib/seo";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: `${SITE_NAME} — ${SITE_TAGLINE}`,
        short_name: "Trekking Nepal",
        description: SITE_DESCRIPTION,
        start_url: "/",
        display: "standalone",
        background_color: "#10161f",
        theme_color: "#10161f",
        icons: [
            {
                src: "/icon.svg",
                sizes: "any",
                type: "image/svg+xml",
            },
        ],
    };
}
