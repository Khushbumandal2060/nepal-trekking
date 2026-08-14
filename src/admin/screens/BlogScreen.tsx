"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    deleteBlogPost,
    loadBlogPosts,
    saveBlogPost,
    type BlogEditorPost,
} from "@/admin/admin-store";

function blankPost(): BlogEditorPost {
    return {
        slug: "",
        title: "",
        category: "Planning",
        excerpt: "",
        date: "",
        read: "5 min read",
        href: "/blog",
        content: "",
    };
}

function slugify(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export default function BlogScreen() {
    const [posts, setPosts] = useState<BlogEditorPost[] | null>(null);
    const [editing, setEditing] = useState<BlogEditorPost | null>(null);
    const [flash, setFlash] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setPosts(loadBlogPosts());
    }, []);

    function notify(message: string) {
        setFlash(message);
        window.setTimeout(() => setFlash(null), 4000);
    }

    function handleEdit(post: BlogEditorPost) {
        setEditing({ ...post });
        setError(null);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function handleNew() {
        setEditing(blankPost());
        setError(null);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function handleCancel() {
        setEditing(null);
        setError(null);
    }

    function update<K extends keyof BlogEditorPost>(
        key: K,
        value: BlogEditorPost[K]
    ) {
        setEditing((e) => (e ? { ...e, [key]: value } : e));
        setError(null);
    }

    function handleSave() {
        if (!editing) return;
        if (!editing.title.trim()) {
            setError("Please give the post a title.");
            return;
        }
        let slug = editing.slug.trim();
        const isNew = posts?.some((p) => p.slug === editing.slug) === false && !editing.slug;
        if (!slug) slug = slugify(editing.title);
        if (!slug) {
            setError("Please enter a URL slug (or we’ll build one from the title).");
            return;
        }
        if (!editing.excerpt.trim()) {
            setError("Please add a short excerpt.");
            return;
        }

        saveBlogPost({ ...editing, slug, title: editing.title.trim() });
        setPosts(loadBlogPosts());
        setEditing(null);
        notify(isNew ? "Blog post published." : "Blog post updated.");
    }

    function handleDelete(post: BlogEditorPost) {
        const confirmed = window.confirm(
            `Delete the blog post “${post.title}”? This removes it from the site.`
        );
        if (!confirmed) return;
        deleteBlogPost(post.slug);
        setPosts(loadBlogPosts());
        if (editing?.slug === post.slug) setEditing(null);
        notify(`“${post.title}” deleted.`);
    }

    if (!posts) {
        return <p className="admin-empty">Loading blog…</p>;
    }

    if (editing) {
        const isNew =
            posts.some((p) => p.slug === editing.slug) === false &&
            editing.slug === "";

        return (
            <>
                <div className="admin-topbar">
                    <div>
                        <h1>{isNew ? "New blog post" : "Edit blog post"}</h1>
                        <p>
                            {isNew
                                ? "Write a new guide or story for the blog."
                                : `Editing “${editing.title || "Untitled"}”.`}
                        </p>
                    </div>
                    <div className="admin-topbar-actions">
                        <button
                            type="button"
                            className="admin-btn admin-btn-ghost"
                            onClick={handleCancel}
                        >
                            ← Back to list
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="admin-login-error" role="alert">
                        {error}
                    </div>
                )}

                <div className="admin-card">
                    <div className="admin-card-head">
                        <div>
                            <h2>Post details</h2>
                            <span className="admin-card-sub">
                                Shown on the blog listing and search
                            </span>
                        </div>
                    </div>
                    <div className="admin-card-body">
                        <div className="admin-form-grid">
                            <div className="admin-field full">
                                <span>Title</span>
                                <input
                                    type="text"
                                    value={editing.title}
                                    onChange={(e) => update("title", e.target.value)}
                                    placeholder="e.g. The Best Time to Trek in Nepal, Month by Month"
                                />
                            </div>

                            <div className="admin-field full">
                                <span>URL slug</span>
                                <input
                                    type="text"
                                    value={editing.slug}
                                    onChange={(e) =>
                                        update("slug", slugify(e.target.value))
                                    }
                                    placeholder="best-time-to-trek-nepal"
                                />
                                <span className="admin-help">
                                    Leave blank to build from the title.
                                </span>
                            </div>

                            <div className="admin-field">
                                <span>Category</span>
                                <input
                                    type="text"
                                    list="admin-blog-cats"
                                    value={editing.category}
                                    onChange={(e) => update("category", e.target.value)}
                                    placeholder="Planning"
                                />
                                <datalist id="admin-blog-cats">
                                    {[
                                        "Planning",
                                        "Everest",
                                        "Compare",
                                        "Culture",
                                        "Gear",
                                        "Safety",
                                    ].map((c) => (
                                        <option key={c} value={c} />
                                    ))}
                                </datalist>
                            </div>

                            <div className="admin-field">
                                <span>Published date</span>
                                <input
                                    type="text"
                                    value={editing.date}
                                    onChange={(e) => update("date", e.target.value)}
                                    placeholder="May 28, 2026"
                                />
                            </div>

                            <div className="admin-field">
                                <span>Reading time</span>
                                <input
                                    type="text"
                                    value={editing.read}
                                    onChange={(e) => update("read", e.target.value)}
                                    placeholder="6 min read"
                                />
                            </div>

                            <div className="admin-field">
                                <span>Link target (href)</span>
                                <input
                                    type="text"
                                    value={editing.href}
                                    onChange={(e) => update("href", e.target.value)}
                                    placeholder="/blog"
                                />
                            </div>

                            <div className="admin-field full">
                                <span>Excerpt</span>
                                <textarea
                                    rows={3}
                                    value={editing.excerpt}
                                    onChange={(e) => update("excerpt", e.target.value)}
                                    placeholder="A 1–2 sentence summary shown in the blog grid…"
                                />
                            </div>

                            <div className="admin-field full">
                                <span>Body (optional)</span>
                                <textarea
                                    rows={10}
                                    value={editing.content ?? ""}
                                    onChange={(e) => update("content", e.target.value)}
                                    placeholder="Write the full article here…"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="admin-editor-sticky">
                    <span className="admin-save-hint">
                        {isNew ? "This will publish a new post." : "Saves changes to this post."}
                    </span>
                    <button
                        type="button"
                        className="admin-btn admin-btn-ghost"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="admin-btn admin-btn-primary"
                        onClick={handleSave}
                    >
                        {isNew ? "Publish post" : "Save changes"}
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="admin-topbar">
                <div>
                    <h1>Blog</h1>
                    <p>
                        {posts.length} published posts. Create and edit guides,
                        trip reports and planning advice.
                    </p>
                </div>
                <div className="admin-topbar-actions">
                    <button
                        type="button"
                        className="admin-btn admin-btn-primary"
                        onClick={handleNew}
                    >
                        + New post
                    </button>
                </div>
            </div>

            {flash && (
                <div className="admin-flash" role="status">
                    ✓ {flash}
                </div>
            )}

            <div className="admin-card">
                <div className="admin-card-head">
                    <div>
                        <h2>All posts</h2>
                        <span className="admin-card-sub">
                            Newest first
                        </span>
                    </div>
                </div>
                <div className="admin-card-body admin-card-body-flush">
                    {posts.length === 0 ? (
                        <div className="admin-empty">
                            <div className="admin-empty-icon">✎</div>
                            <h3>No posts yet</h3>
                            <p>Write your first blog post to get started.</p>
                        </div>
                    ) : (
                        <div className="admin-table-wrap">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Category</th>
                                        <th>Date</th>
                                        <th>Read</th>
                                        <th aria-label="Actions" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {posts.map((post) => (
                                        <tr key={post.slug}>
                                            <td>
                                                <div className="admin-trek-name">
                                                    {post.title}
                                                </div>
                                                <div
                                                    className="admin-mono"
                                                    style={{ color: "var(--sub)" }}
                                                >
                                                    /blog/{post.slug}
                                                </div>
                                            </td>
                                            <td>
                                                <span className="admin-pill admin-pill-neutral">
                                                    {post.category}
                                                </span>
                                            </td>
                                            <td className="admin-mono">
                                                {post.date}
                                            </td>
                                            <td className="admin-mono">
                                                {post.read}
                                            </td>
                                            <td>
                                                <div className="admin-row-actions">
                                                    <button
                                                        type="button"
                                                        className="admin-btn admin-btn-ghost admin-btn-sm"
                                                        onClick={() => handleEdit(post)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="admin-btn admin-btn-danger admin-btn-sm"
                                                        onClick={() => handleDelete(post)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
