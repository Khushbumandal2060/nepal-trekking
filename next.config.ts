import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    images: {
        // Register the quality values used by <Image> components (e.g.
        // quality={95} in TrekHero). Required config starting in Next.js 16.
        qualities: [75, 95],
    },
};

export default nextConfig;
