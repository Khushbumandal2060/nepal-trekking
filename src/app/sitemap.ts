import type { MetadataRoute } from "next";
import { blogPosts } from "@/data/blog";
import { treks } from "@/data/treks";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
    const today = new Date();

    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: `${SITE_URL}/`,
            lastModified: today,
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${SITE_URL}/treks`,
            lastModified: today,
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${SITE_URL}/blog`,
            lastModified: today,
            changeFrequency: "weekly",
            priority: 0.7,
        },
        {
            url: `${SITE_URL}/about`,
            lastModified: today,
            changeFrequency: "monthly",
            priority: 0.6,
        },
        {
            url: `${SITE_URL}/contact`,
            lastModified: today,
            changeFrequency: "monthly",
            priority: 0.6,
        },
        {
            url: `${SITE_URL}/book`,
            lastModified: today,
            changeFrequency: "monthly",
            priority: 0.5,
        },
    ];

    const trekRoutes: MetadataRoute.Sitemap = treks.map((trek) => ({
        url: `${SITE_URL}/treks/${trek.slug}`,
        lastModified: today,
        changeFrequency: "weekly",
        priority: 0.8,
    }));

    // Blog entries that link to their own article page (some link to treks).
    const blogRoutes: MetadataRoute.Sitemap = blogPosts
        .filter((post) => post.href.startsWith("/blog"))
        .map((post) => ({
            url: `${SITE_URL}${post.href}`,
            lastModified: today,
            changeFrequency: "monthly",
            priority: 0.6,
        }));

    return [...staticRoutes, ...trekRoutes, ...blogRoutes];
}
