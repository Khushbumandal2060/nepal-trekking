import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { blogPosts } from "@/data/blog";
import { blogJsonLd, breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "Journal",
    description:
        "Guides' notes from the trail — season updates, packing lists and honest answers to the questions trekkers ask us most.",
    path: "/blog",
});

export default function BlogPage() {
    return (
        <>
            <JsonLd
                data={[
                    blogJsonLd(blogPosts),
                    breadcrumbJsonLd([
                        { name: "Home", path: "/" },
                        { name: "Journal", path: "/blog" },
                    ]),
                ]}
            />
            <section className="page-hero">
                <div className="wrap">
                    <p className="eyebrow">The Journal</p>
                    <h1>Guides’ notes from the trail.</h1>
                    <p className="lede">
                        Season updates, packing lists and honest answers to the
                        questions trekkers ask us most — written by the guides who
                        walk these valleys year-round.
                    </p>
                </div>
            </section>

            <section>
                <div className="wrap reveal">
                    <div className="blog-grid">
                        {blogPosts.map((p) => (
                            <Link
                                key={p.slug}
                                href={p.href}
                                className="blog-card"
                            >
                                <div className="blog-cat">{p.category}</div>
                                <h3>{p.title}</h3>
                                <p className="blog-excerpt">{p.excerpt}</p>
                                <div className="blog-meta">
                                    <span>{p.date}</span>
                                    <span>{p.read}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
