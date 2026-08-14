import type { JsonLdObject } from "@/lib/seo";

interface JsonLdProps {
    data: JsonLdObject | JsonLdObject[];
}

/**
 * Renders one or more schema.org JSON-LD blocks as <script type="application/ld+json">.
 * Server component — run in the same render pass as the page markup.
 */
export default function JsonLd({ data }: JsonLdProps) {
    const blocks = Array.isArray(data) ? data : [data];
    return (
        <>
            {blocks.map((block, index) => (
                <script
                    key={index}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
                />
            ))}
        </>
    );
}
