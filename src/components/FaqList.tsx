"use client";

import { useRef, useState } from "react";
import type { TrekFaq } from "@/lib/types";

interface FaqListProps {
    faqs: TrekFaq[];
}

export default function FaqList({ faqs }: FaqListProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div>
            {faqs.map((faq, i) => {
                const isOpen = openIndex === i;
                return (
                    <div key={faq.q} className={`faq-item ${isOpen ? "open" : ""}`}>
                        <button
                            type="button"
                            className="faq-q"
                            onClick={() => setOpenIndex((prev) => (prev === i ? null : i))}
                            aria-expanded={isOpen}
                        >
                            <span>{faq.q}</span>
                            <span className="plus">+</span>
                        </button>
                        <FaqAnswer isOpen={isOpen} answer={faq.a} />
                    </div>
                );
            })}
        </div>
    );
}

function FaqAnswer({ isOpen, answer }: { isOpen: boolean; answer: string }) {
    const ref = useRef<HTMLDivElement>(null);
    return (
        <div
            ref={ref}
            className="faq-a"
            style={{ maxHeight: isOpen ? ref.current?.scrollHeight : 0 }}
        >
            <p>{answer}</p>
        </div>
    );
}
