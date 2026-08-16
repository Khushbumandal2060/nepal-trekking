/**
 * fetch-gallery.ts
 *
 * Downloads real, freely-licensed photos for every trek from the Wikimedia
 * Commons API and saves them under public/images/gallery/. Generates
 * src/data/trek-galleries.ts mapping each trek slug to its downloaded images
 * so the trek detail gallery shows genuine photos of the actual places.
 *
 * Usage:
 *   npm run gallery:fetch
 *
 * Notes:
 *   - Idempotent: skips slugs that already have all `want` images downloaded.
 *   - Politeness: sequential requests with delays, and automatic retry with
 *     backoff (honouring Retry-After) on HTTP 429 / 5xx.
 */
import { mkdir, readdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "images", "gallery");
const OUT_MAP = path.join(ROOT, "src", "data", "trek-galleries.ts");

/** Slug -> search query on Wikimedia Commons. */
const TREKS: Array<{ slug: string; query: string }> = [
    { slug: "everest-base-camp", query: "Everest Base Camp Nepal" },
    { slug: "everest-three-passes", query: "Cho La pass Nepal" },
    { slug: "gokyo-lakes", query: "Gokyo Lakes Nepal" },
    { slug: "everest-panorama", query: "Everest panorama Nepal" },
    { slug: "pikey-peak", query: "Pikey Peak Nepal" },
    { slug: "annapurna-base-camp", query: "Annapurna Base Camp Nepal" },
    { slug: "annapurna-circuit", query: "Annapurna Circuit Nepal" },
    { slug: "poon-hill", query: "Poon Hill sunrise Nepal" },
    { slug: "tilicho-lake", query: "Tilicho Lake Nepal" },
    { slug: "machapuchare-base-camp", query: "Machapuchare Nepal" },
    { slug: "royal-trek", query: "Begnas Lake Pokhara Nepal" },
    { slug: "mardi-himal", query: "Mardi Himal Nepal" },
    { slug: "manaslu-circuit", query: "Manaslu Circuit Nepal" },
    { slug: "tsum-valley", query: "Tsum Valley Nepal" },
    { slug: "nar-phu-valley", query: "Nar Phu Valley Nepal" },
    { slug: "langtang-valley", query: "Langtang Valley Nepal" },
    { slug: "langtang-gosaikunda", query: "Gosaikunda Lake Nepal" },
    { slug: "helambu", query: "Helambu Nepal" },
    { slug: "tamang-heritage", query: "Gatlang Nepal" },
    { slug: "upper-mustang", query: "Upper Mustang Nepal" },
    { slug: "lower-mustang", query: "Muktinath Jomsom Nepal" },
    { slug: "upper-dolpo", query: "Upper Dolpo Nepal" },
    { slug: "lower-dolpo", query: "Shey Phoksundo Lake Nepal" },
    { slug: "makalu-base-camp", query: "Makalu Base Camp Nepal" },
    { slug: "dhaulagiri-circuit", query: "Dhaulagiri Nepal" },
    { slug: "rara-lake", query: "Rara Lake Nepal" },
    { slug: "humla-limi-valley", query: "Limi Valley Humla Nepal" },
    { slug: "ganesh-himal", query: "Ganesh Himal Nepal" },
    { slug: "kanchenjunga-base-camp", query: "Kanchenjunga Base Camp Nepal" },
];

const WANT = 5; // keep up to this many photos per trek
const THUMB_WIDTH = 2048; // HD — 2K-wide thumbnails (originals when smaller)
const API_URL =
    "https://commons.wikimedia.org/w/api.php?action=query&format=json" +
    "&generator=search&gsrnamespace=6&prop=imageinfo" +
    "&iiprop=url%7Csize%7Cmime&iiurlwidth=" +
    THUMB_WIDTH +
    "&gsrlimit=10&gsrsearch=";

const SKIP_TITLE = /map|logo|poster|diagram|icon|chart|route|schema|coat|flag|plan|drawing|sketch|template/i;
const SKIP_MIME = /svg|xml|tiff|tif/;

const sleep = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms));

interface ImageInfo {
    mime: string;
    width?: number;
    thumburl?: string;
}

interface CommonsPage {
    index?: number;
    title: string;
    imageinfo?: ImageInfo[];
}

interface CommonsSearchResponse {
    query?: {
        pages?: Record<string, CommonsPage>;
    };
}

interface SearchResult {
    title: string;
    info: ImageInfo | null;
}

type UsableResult = SearchResult & { info: ImageInfo & { thumburl: string } };

interface RetryOptions {
    tries?: number;
    baseDelay?: number;
}

/** Fetch with retry + backoff; honours Retry-After on 429 (capped at 30s so a
 *  single request can't stall the whole run for minutes) and pauses on 5xx. */
async function retryFetch(
    url: string,
    { tries = 4, baseDelay = 2000 }: RetryOptions = {}
): Promise<Response> {
    for (let attempt = 1; attempt <= tries; attempt++) {
        const res = await fetch(url, {
            headers: { "User-Agent": "ContourNepalGallery/1.0 (site dev script)" },
        });
        if (res.ok) return res;
        if (res.status === 404) return res;
        const retryAfter = Number(res.headers.get("retry-after"));
        const wait = Math.min(
            Number.isFinite(retryAfter) && retryAfter > 0
                ? retryAfter * 1000
                : baseDelay * attempt,
            30000
        );
        console.warn(`  ⏳ HTTP ${res.status} — retrying in ${Math.round(wait / 1000)}s`);
        await sleep(wait);
    }
    throw new Error(`HTTP failed after ${tries} tries`);
}

function isUsableResult(result: SearchResult): result is UsableResult {
    if (SKIP_TITLE.test(result.title)) return false;
    if (!result.info) return false;
    if (SKIP_MIME.test(result.info.mime)) return false;
    if ((result.info.width ?? 0) < 1600) return false; // HD source only
    return Boolean(result.info.thumburl);
}

async function searchCommons(query: string): Promise<UsableResult[]> {
    const url = API_URL + encodeURIComponent(query);
    const res = await retryFetch(url);
    if (res.status === 404) return [];
    const data = (await res.json()) as CommonsSearchResponse;
    const pages = data?.query?.pages;
    if (!pages) return [];
    return Object.values(pages)
        .filter((p) => p.index != null)
        .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
        .map((p) => ({ title: p.title, info: p.imageinfo?.[0] ?? null }))
        .filter(isUsableResult);
}

function extFor(url: string): string {
    const pathname = new URL(url).pathname;
    const m = pathname.match(/\.([a-z0-9]+)$/i);
    return m ? m[1].toLowerCase() : "jpg";
}

async function download(url: string, dest: string): Promise<void> {
    const res = await retryFetch(url, { tries: 3 });
    if (res.status === 404) throw new Error(`404 ${url}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(dest, buf);
}

async function slugFiles(slug: string): Promise<string[]> {
    if (!existsSync(OUT_DIR)) return [];
    const names = await readdir(OUT_DIR);
    return names.filter((n) => n.startsWith(`${slug}-`));
}

async function fetchTrek({
    slug,
    query,
}: {
    slug: string;
    query: string;
}): Promise<{ slug: string; files: string[] }> {
    const existing = (await slugFiles(slug)).sort();
    const existingCount = existing.length;
    if (existingCount >= WANT) return { slug, files: existing };

    const results = await searchCommons(query);
    const chosen: string[] = [];
    let i = 0;
    // Number new files after the existing ones so a resumed run never
    // overwrites an already-downloaded file (avoids duplicate entries).
    while (chosen.length + existingCount < WANT && i < results.length) {
        const { info } = results[i];
        const ext = extFor(info.thumburl);
        const dest = path.join(
            OUT_DIR,
            `${slug}-${existingCount + chosen.length + 1}.${ext}`
        );
        try {
            await download(info.thumburl, dest);
            chosen.push(path.basename(dest));
            console.log(
                `  ✓ ${slug} #${existingCount + chosen.length} ${info.thumburl.split("/").pop()?.slice(0, 60)}`
            );
        } catch (err) {
            console.warn(
                `  ✗ ${slug} failed: ${err instanceof Error ? err.message.slice(0, 80) : String(err)}`
            );
        }
        i++;
        await sleep(2000); // gentle between downloads (HD files are heavy)
    }

    if (chosen.length === 0 && existingCount === 0) {
        console.warn(`  ! ${slug} — no images found for "${query}"`);
    }
    return { slug, files: [...existing, ...chosen].slice(0, WANT).sort() };
}

async function main(): Promise<void> {
    await mkdir(OUT_DIR, { recursive: true });
    console.log(`Downloading trek photos into ${path.relative(ROOT, OUT_DIR)} …`);

    const result: Record<string, string[]> = {};
    for (const trek of TREKS) {
        try {
            const { slug, files } = await fetchTrek(trek);
            result[slug] = files.map((f) => `/images/gallery/${f}`);
        } catch (err) {
            console.warn(
                `  ! ${trek.slug} skipped: ${err instanceof Error ? err.message : String(err)}`
            );
            result[trek.slug] = [];
        }
        await sleep(2000);
    }

    const lines = Object.entries(result).map(
        ([slug, files]) =>
            `    ${JSON.stringify(slug)}: [${files.map((f) => JSON.stringify(f)).join(", ")}],`
    );

    const output = `/**
 * Auto-generated by scripts/fetch-gallery.ts — do not edit by hand.
 * Real, freely-licensed photos downloaded from Wikimedia Commons for each
 * trek's detail-page gallery. Each array maps to files in public/images/gallery/.
 */
export const trekGalleries: Record<string, string[]> = {
${lines.join("\n")}
};
`;

    await writeFile(OUT_MAP, output);
    console.log(`\nWrote ${path.relative(ROOT, OUT_MAP)}`);
    const total = Object.values(result).reduce((n, f) => n + f.length, 0);
    console.log(`Total images: ${total}`);
}

main().catch((err: unknown) => {
    console.error(err);
    process.exit(1);
});
