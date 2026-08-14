import type { Trek } from "@/lib/types";
import { treks as baseTreks } from "@/data/treks";
import { blogPosts as baseBlogPosts, type BlogPost } from "@/data/blog";

/* ============================================================
   ADMIN STORE — a small localStorage-backed persistence layer
   used by the /admin panel.

   This is a fully static Next.js site (no server, no database),
   so every edit made in the admin panel is persisted to the
   visitor's browser localStorage and merged on top of the static
   seed data shipped in /src/data. Swap this module for real API
   calls when a backend is introduced.
   ============================================================ */

const KEYS = {
    session: "tn-admin:session",
    treks: "tn-admin:treks",
    deletedTreks: "tn-admin:deleted-treks",
    blog: "tn-admin:blog",
    deletedBlog: "tn-admin:deleted-blog",
    bookings: "tn-admin:bookings",
    messages: "tn-admin:messages",
} as const;

/**
 * Admin credentials — configured via `.env` (NEXT_PUBLIC_ADMIN_EMAIL /
 * NEXT_PUBLIC_ADMIN_PASSWORD). See `.env.example` for the variable list.
 * These are exposed to the browser bundle, so they are demo-level auth only,
 * not real security. If the variables are missing the login simply fails.
 */
export const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "";
export const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "";

/**
 * Headers used to authenticate the admin API routes (/api/admin/*) that
 * persist data to the database. Mirrors the demo header scheme used by
 * /api/admin/bookings.
 */
export function adminHeaders(): Record<string, string> {
    return {
        "x-admin-email": ADMIN_EMAIL,
        "x-admin-password": ADMIN_PASSWORD,
    };
}

function read<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") return fallback;
    try {
        const raw = window.localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
        return fallback;
    }
}

function write(key: string, value: unknown): void {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
        /* ignore quota / private-mode errors */
    }
}

/** Small, URL-safe unique id helper for records created in the browser. */
export function makeId(prefix: string): string {
    return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

/* ============================================================
   SESSION
   ============================================================ */

export interface AdminSession {
    email: string;
    name: string;
    loginAt: string;
}

export function getSession(): AdminSession | null {
    return read<AdminSession | null>(KEYS.session, null);
}

export function setSession(session: AdminSession | null): void {
    if (session) {
        write(KEYS.session, session);
    } else if (typeof window !== "undefined") {
        window.localStorage.removeItem(KEYS.session);
    }
}

export function isAuthenticated(): boolean {
    return getSession() !== null;
}

export function login(
    email: string,
    password: string
): { ok: boolean; error?: string } {
    const normalized = email.trim().toLowerCase();
    if (normalized === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        setSession({
            email: ADMIN_EMAIL,
            name: "Site Admin",
            loginAt: new Date().toISOString(),
        });
        return { ok: true };
    }
    return { ok: false, error: "Invalid email or password." };
}

/* ============================================================
   TREKS — seed data from /src/data/treks.ts + local overrides
   ============================================================ */

type TrekOverrides = Record<string, Trek>;

export function loadTreks(): Trek[] {
    const overrides = read<TrekOverrides>(KEYS.treks, {});
    const deleted = new Set(read<string[]>(KEYS.deletedTreks, []));

    const merged = baseTreks
        .filter((t) => !deleted.has(t.slug))
        .map((t) => overrides[t.slug] ?? t);

    // Include any treks created in the admin panel that don't exist in seed data.
    for (const slug of Object.keys(overrides)) {
        if (!baseTreks.some((t) => t.slug === slug) && !deleted.has(slug)) {
            merged.push(overrides[slug]);
        }
    }
    return merged;
}

/**
 * Returns only the treks that actually need syncing to the database:
 *  - brand-new treks created in the admin panel (no seed with that slug), or
 *  - seed treks whose local override differs from the original seed.
 *
 * Slugs in the deleted list are excluded, so a deleted seed trek is never
 * re-pushed back to the live site.
 */
export function loadCustomTreks(): Trek[] {
    const overrides = read<TrekOverrides>(KEYS.treks, {});
    const deleted = new Set(read<string[]>(KEYS.deletedTreks, []));
    const seeds = new Map(baseTreks.map((t) => [t.slug, t]));

    return Object.keys(overrides)
        .filter((slug) => !deleted.has(slug))
        .filter((slug) => {
            const saved = overrides[slug];
            const seed = seeds.get(slug);
            if (!seed) return true; // brand-new trek
            return JSON.stringify(seed) !== JSON.stringify(saved); // edited trek
        })
        .map((slug) => overrides[slug]);
}

export function getTrek(slug: string): Trek | null {
    return loadTreks().find((t) => t.slug === slug) ?? null;
}

export function saveTrek(trek: Trek): void {
    const overrides = read<TrekOverrides>(KEYS.treks, {});
    overrides[trek.slug] = trek;
    write(KEYS.treks, overrides);

    // Restoring a trek that was previously "deleted".
    const deleted = read<string[]>(KEYS.deletedTreks, []).filter(
        (s) => s !== trek.slug
    );
    write(KEYS.deletedTreks, deleted);
}

export function deleteTrek(slug: string): void {
    const deleted = read<string[]>(KEYS.deletedTreks, []);
    if (!deleted.includes(slug)) deleted.push(slug);
    write(KEYS.deletedTreks, deleted);
}

/* ============================================================
   BLOG POSTS
   ============================================================ */

export interface BlogEditorPost extends BlogPost {
    /** Optional body text for posts edited/created in the admin panel. */
    content?: string;
}

type BlogOverrides = Record<string, BlogEditorPost>;

export function loadBlogPosts(): BlogEditorPost[] {
    const overrides = read<BlogOverrides>(KEYS.blog, {});
    const deleted = new Set(read<string[]>(KEYS.deletedBlog, []));

    const merged = baseBlogPosts
        .filter((b) => !deleted.has(b.slug))
        .map((b) => overrides[b.slug] ?? b);

    for (const slug of Object.keys(overrides)) {
        if (!baseBlogPosts.some((b) => b.slug === slug) && !deleted.has(slug)) {
            merged.push(overrides[slug]);
        }
    }
    return merged;
}

export function saveBlogPost(post: BlogEditorPost): void {
    const overrides = read<BlogOverrides>(KEYS.blog, {});
    overrides[post.slug] = post;
    write(KEYS.blog, overrides);

    const deleted = read<string[]>(KEYS.deletedBlog, []).filter(
        (s) => s !== post.slug
    );
    write(KEYS.deletedBlog, deleted);
}

export function deleteBlogPost(slug: string): void {
    const deleted = read<string[]>(KEYS.deletedBlog, []);
    if (!deleted.includes(slug)) deleted.push(slug);
    write(KEYS.deletedBlog, deleted);
}

/* ============================================================
   BOOKINGS
   ============================================================ */

export type BookingStatus = "new" | "confirmed" | "cancelled";

export interface BookingRecord {
    id: string;
    reference: string;
    trekSlug: string;
    trekName: string;
    days: number;
    departure: string; // "YYYY-MM"
    departureType: "fixed" | "private";
    groupSize: number;
    name: string;
    email: string;
    phone: string;
    country: string;
    notes: string;
    total: number;
    status: BookingStatus;
    createdAt: string;
}

function seedBookings(): BookingRecord[] {
    return [
        {
            id: "bk-seed-1",
            reference: "TN-K7P2QX",
            trekSlug: "everest-base-camp",
            trekName: "Everest Base Camp Trek",
            days: 13,
            departure: "2026-10-03",
            departureType: "fixed",
            groupSize: 6,
            name: "Olivia Bennett",
            email: "olivia.bennett@example.com",
            phone: "+44 7911 123456",
            country: "United Kingdom",
            notes: "Vegetarian meals please — first trek above 4,000 m.",
            total: 8700,
            status: "confirmed",
            createdAt: "2026-07-28T09:14:00.000Z",
        },
        {
            id: "bk-seed-2",
            reference: "TN-MX9D4A",
            trekSlug: "annapurna-circuit",
            trekName: "Annapurna Circuit Trek",
            days: 14,
            departure: "2026-09-19",
            departureType: "private",
            groupSize: 2,
            name: "Daniel Carter",
            email: "dan.carter@example.com",
            phone: "+1 202 555 0143",
            country: "United States",
            notes: "Honeymoon trip — would love a quiet teahouse preference.",
            total: 3600,
            status: "new",
            createdAt: "2026-08-05T15:47:00.000Z",
        },
        {
            id: "bk-seed-3",
            reference: "TN-B3R8ZF",
            trekSlug: "langtang-valley",
            trekName: "Langtang Valley Trek",
            days: 11,
            departure: "2026-11-07",
            departureType: "fixed",
            groupSize: 4,
            name: "Priya Sharma",
            email: "priya.sharma@example.com",
            phone: "+91 98112 44321",
            country: "India",
            notes: "Moderate fitness, keen photographer.",
            total: 3200,
            status: "new",
            createdAt: "2026-08-06T04:22:00.000Z",
        },
        {
            id: "bk-seed-4",
            reference: "TN-QT5H1W",
            trekSlug: "annapurna-base-camp",
            trekName: "Annapurna Base Camp Trek",
            days: 9,
            departure: "2026-12-04",
            departureType: "private",
            groupSize: 3,
            name: "Yuki Tanaka",
            email: "yuki.tanaka@example.com",
            phone: "+81 90 1234 5678",
            country: "Japan",
            notes: "",
            total: 4050,
            status: "cancelled",
            createdAt: "2026-07-15T11:02:00.000Z",
        },
        {
            id: "bk-seed-5",
            reference: "TN-8CW6YJ",
            trekSlug: "manaslu-circuit",
            trekName: "Manaslu Circuit Trek",
            days: 15,
            departure: "2027-03-20",
            departureType: "fixed",
            groupSize: 8,
            name: "Lucas Meyer",
            email: "lucas.meyer@example.com",
            phone: "+49 151 23456789",
            country: "Germany",
            notes: "Two vegetarians in the group; arriving two days early.",
            total: 10400,
            status: "new",
            createdAt: "2026-08-02T18:36:00.000Z",
        },
    ];
}

export function loadBookings(): BookingRecord[] {
    const stored = read<BookingRecord[] | null>(KEYS.bookings, null);
    if (stored) return stored;
    const seeded = seedBookings();
    write(KEYS.bookings, seeded);
    return seeded;
}

export function addBooking(booking: BookingRecord): BookingRecord[] {
    const all = loadBookings();
    all.unshift(booking);
    write(KEYS.bookings, all);
    return all;
}

export function updateBookingStatus(
    id: string,
    status: BookingStatus
): BookingRecord[] {
    const all = loadBookings().map((b) => (b.id === id ? { ...b, status } : b));
    write(KEYS.bookings, all);
    return all;
}

export function deleteBooking(id: string): BookingRecord[] {
    const all = loadBookings().filter((b) => b.id !== id);
    write(KEYS.bookings, all);
    return all;
}

/* ============================================================
   ENQUIRY MESSAGES (contact form)
   ============================================================ */

export interface EnquiryMessage {
    id: string;
    reference: string;
    name: string;
    email: string;
    trek: string;
    dates: string;
    message: string;
    status: "new" | "read";
    createdAt: string;
}

function seedMessages(): EnquiryMessage[] {
    return [
        {
            id: "enq-seed-1",
            reference: "ENQ-9T4Z2",
            name: "Sophie Laurent",
            email: "sophie.laurent@example.com",
            trek: "Gokyo Lakes Trek",
            dates: "October 2026",
            message:
                "Hi! Do you run a Gokyo + Everest Base Camp combined itinerary? We are two fit travellers hoping to add a few days on the Ngozumpa Glacier.",
            status: "new",
            createdAt: "2026-08-07T10:05:00.000Z",
        },
        {
            id: "enq-seed-2",
            reference: "ENQ-2M8H7",
            name: "Marco Rossi",
            email: "marco.rossi@example.com",
            trek: "Not sure yet — suggest one",
            dates: "May 2027",
            message:
                "Looking for a 10–12 day spring trek with less crowds than Everest. Is Langtang or Mardi Himal a better fit for a first-time trekker?",
            status: "read",
            createdAt: "2026-08-03T16:44:00.000Z",
        },
        {
            id: "enq-seed-3",
            reference: "ENQ-6Q1F9",
            name: "Amelia Chen",
            email: "amelia.chen@example.com",
            trek: "Upper Mustang Trek",
            dates: "September 2026",
            message:
                "We are a family of four (kids aged 12 and 15). Is Upper Mustang suitable for kids? What permits are needed and how far in advance should we book?",
            status: "new",
            createdAt: "2026-08-08T07:31:00.000Z",
        },
        {
            id: "enq-seed-4",
            reference: "ENQ-4P7D3",
            name: "James O'Connor",
            email: "james.oconnor@example.com",
            trek: "Everest Base Camp Trek",
            dates: "April 2027",
            message:
                "Do you offer sleeping-bag and down-jacket rental in Kathmandu? And what's the maximum group size on the April departures?",
            status: "read",
            createdAt: "2026-07-29T13:12:00.000Z",
        },
    ];
}

export function loadEnquiries(): EnquiryMessage[] {
    const stored = read<EnquiryMessage[] | null>(KEYS.messages, null);
    if (stored) return stored;
    const seeded = seedMessages();
    write(KEYS.messages, seeded);
    return seeded;
}

export function addEnquiry(message: EnquiryMessage): EnquiryMessage[] {
    const all = loadEnquiries();
    all.unshift(message);
    write(KEYS.messages, all);
    return all;
}

export function markEnquiryRead(id: string): EnquiryMessage[] {
    const all = loadEnquiries().map((m) =>
        m.id === id ? { ...m, status: "read" as const } : m
    );
    write(KEYS.messages, all);
    return all;
}

export function deleteEnquiry(id: string): EnquiryMessage[] {
    const all = loadEnquiries().filter((m) => m.id !== id);
    write(KEYS.messages, all);
    return all;
}
