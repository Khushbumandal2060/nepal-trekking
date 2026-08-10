"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { treks } from "@/data/treks";
import type { Region } from "@/lib/types";

interface ChatMessage {
    from: "bot" | "user";
    text: string;
}

const REGION_ALIASES: Record<string, Region> = {
    khumbu: "khumbu",
    everest: "khumbu",
    namche: "khumbu",
    lukla: "khumbu",
    annapurna: "annapurna",
    poon: "annapurna",
    tilicho: "annapurna",
    manaslu: "manaslu",
    tsum: "manaslu",
    nar: "manaslu",
    langtang: "langtang",
    helambu: "langtang",
    mustang: "mustang",
    muktinath: "mustang",
    jomsom: "mustang",
    kanchenjunga: "kanchenjunga",
    dolpo: "dolpo",
    phoksundo: "dolpo",
    makalu: "makalu",
    dhaulagiri: "dhaulagiri",
    karnali: "karnali",
    rara: "karnali",
    humla: "karnali",
    ganesh: "ganesh",
};

const REGION_LABEL: Record<Region, string> = {
    khumbu: "Khumbu (Everest)",
    annapurna: "Annapurna",
    manaslu: "Manaslu",
    langtang: "Langtang",
    mustang: "Mustang",
    kanchenjunga: "Kanchenjunga",
    dolpo: "Dolpo",
    makalu: "Makalu",
    dhaulagiri: "Dhaulagiri",
    karnali: "Karnali & Far West",
    ganesh: "Ganesh Himal",
};

const GREETING: ChatMessage = {
    from: "bot",
    text: "Namaste 🙏 I'm TrekBot, the AI assistant for Trekking Nepal. I can recommend a trek by region, difficulty or duration, and answer questions about prices and the best seasons. Try one of the quick questions below, or just type away!",
};

function regionInText(text: string): Region | undefined {
    for (const [alias, region] of Object.entries(REGION_ALIASES)) {
        if (text.includes(alias)) return region;
    }
    return undefined;
}

function listTreks(region: Region): string {
    const matches = treks.filter((t) => t.region === region);
    if (matches.length === 0) {
        return `I don't have any routes listed for that region yet, but we can absolutely plan a custom trek there. Message us on the contact page.`;
    }
    const lines = matches
        .map((t) => `• ${t.name} — ${t.days} days, ${t.price}`)
        .join("\n");
    return `Here are our treks in ${REGION_LABEL[region]}:\n${lines}\n\nWant details on any of them? Just say the name.`;
}

function getBotReply(raw: string): string {
    const text = " " + raw.toLowerCase().replace(/[^a-z0-9\s]/g, " ") + " ";

    // Greetings
    if (/(^|\s)(hi|hello|hey|namaste|yo)(\s|$)/.test(text)) {
        return GREETING.text;
    }

    // Thanks
    if (text.includes("thank")) {
        return "You're welcome! Anything else I can help you plan? 😊";
    }

    // Contact / book / human
    if (
        text.includes("contact") ||
        text.includes("book") ||
        text.includes("human") ||
        text.includes("agent") ||
        text.includes("call")
    ) {
        return `You can reach our Kathmandu team via the contact page — a real trek expert replies within 24 hours. Meanwhile I'm happy to answer quick questions here!`;
    }

    // Price / cost / budget
    if (text.includes("price") || text.includes("cost") || text.includes("budget") || text.includes("cheap") || text.includes("expensive")) {
        const byPrice = [...treks].sort(
            (a, b) =>
                parseInt(a.price.replace(/[^0-9]/g, ""), 10) -
                parseInt(b.price.replace(/[^0-9]/g, ""), 10)
        );
        const cheapest = byPrice[0];
        const priciest = byPrice[byPrice.length - 1];
        return `Our ${treks.length} treks range from ${cheapest.price} (${cheapest.name}, ${cheapest.days} days) up to ${priciest.price} (${priciest.name}, ${priciest.days} days). Most include permits, teahouse lodging, meals, guide and porter. Want me to narrow it down by budget?`;
    }

    // Duration / days / long / short
    if (text.includes("day") || text.includes("duration") || text.includes("long") || text.includes("short") || text.includes("week")) {
        const byDays = [...treks].sort((a, b) => a.days - b.days);
        const shortest = byDays[0];
        const longest = byDays[byDays.length - 1];
        return `Treks range from ${shortest.days} days (${shortest.name}) to ${longest.days} days (${longest.name}). If you tell me how many days you have, I can suggest a perfect fit.`;
    }

    // Beginner / easy / first time
    if (
        text.includes("beginner") ||
        text.includes("easy") ||
        text.includes("first time") ||
        text.includes("first-time") ||
        text.includes("new to") ||
        text.includes("no experience")
    ) {
        const easy = treks.filter((t) => /easy|moderate/i.test(t.grade));
        const names = easy
            .slice(0, 4)
            .map((t) => `• ${t.name} — ${t.days} days, ${t.grade}`)
            .join("\n");
        return `Great news — Nepal has some wonderfully gentle routes for your first trek. My top picks for beginners:\n${names}\n\nThe 5-day Ghorepani Poon Hill trek is usually our most recommended starting point. Want more detail on any?`;
    }

    // Difficult / challenging / hard
    if (text.includes("difficult") || text.includes("challenging") || text.includes("hard") || text.includes("experienced") || text.includes("adventure")) {
        const hard = treks.filter((t) => /difficult|challenging/i.test(t.grade));
        const names = hard
            .slice(0, 4)
            .map((t) => `• ${t.name} — ${t.days} days, ${t.grade}`)
            .join("\n");
        return `If you're after a real challenge, these are our most demanding routes:\n${names}\n\nFor the ultimate experience, the Everest Three Passes or Upper Dolpo are unforgettable.`;
    }

    // Season / best time / weather
    if (text.includes("season") || text.includes("best time") || text.includes("when") || text.includes("month") || text.includes("weather") || text.includes("snow")) {
        return `The two main trekking seasons are autumn (September–November) and spring (March–May) — clear skies and comfortable temperatures. Winter (December–February) is possible on lower routes, while summer (June–August) suits the rain-shadow regions of Mustang and the far west. Each trek's page lists its best months.`;
    }

    // Region-specific query
    const region = regionInText(text);
    if (region) {
        return listTreks(region);
    }

    // Recommend
    if (text.includes("recommend") || text.includes("suggest") || text.includes("best trek") || text.includes("which trek") || text.includes("where should i")) {
        return `Here are three crowd-favourites across different regions:\n• Everest Base Camp — 13 days, the classic\n• Ghorepani Poon Hill — 5 days, perfect first trek\n• Upper Dolpo — 20 days, for real adventurers\n\nTell me your days available or a region you love and I'll narrow it down.`;
    }

    // Default fallback
    return `I can help with trek recommendations, regions, difficulty, duration, seasons and prices. Try asking things like:\n• "Recommend a trek"\n• "Best for beginners"\n• "Everest treks"\n• "How much does it cost?"`;
}

const QUICK_REPLIES = [
    "Recommend a trek",
    "Best for beginners",
    "Everest treks",
    "Annapurna treks",
    "Price range",
];

export default function ChatBot() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, typing, open]);

    async function send(text: string) {
        const trimmed = text.trim();
        if (!trimmed) return;
        setMessages((prev) => [...prev, { from: "user", text: trimmed }]);
        setInput("");
        setTyping(true);

        let reply: string;
        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: trimmed }),
            });
            const data: { reply?: string } = await res.json();
            // Use the AI reply when available; otherwise fall back to the
            // built-in rule-based answers (e.g. no API key configured).
            reply = data?.reply && data.reply.trim() ? data.reply : getBotReply(trimmed);
        } catch {
            reply = getBotReply(trimmed);
        }

        setTyping(false);
        setMessages((prev) => [...prev, { from: "bot", text: reply }]);
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        send(input);
    }

    return (
        <>
            {open && (
                <div className="chatbot-panel" role="dialog" aria-label="TrekBot AI assistant">
                    <div className="chatbot-header">
                        <div className="chatbot-avatar" aria-hidden="true">
                            <span className="chatbot-avatar-dot" />
                        </div>
                        <div>
                            <strong>TrekBot</strong>
                            <span className="chatbot-status">
                                Online · AI assistant
                            </span>
                        </div>
                        <button
                            type="button"
                            className="chatbot-close"
                            onClick={() => setOpen(false)}
                            aria-label="Close chat"
                        >
                            ×
                        </button>
                    </div>

                    <div className="chatbot-body" ref={scrollRef}>
                        {messages.map((m, i) => (
                            <div key={i} className={`chat-msg ${m.from}`}>
                                <span className="chat-bubble">{m.text}</span>
                            </div>
                        ))}
                        {typing && (
                            <div className="chat-msg bot">
                                <span className="chat-bubble typing">
                                    <i />
                                    <i />
                                    <i />
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="chatbot-quick">
                        {QUICK_REPLIES.map((q) => (
                            <button key={q} type="button" onClick={() => send(q)}>
                                {q}
                            </button>
                        ))}
                    </div>

                    <form className="chatbot-input" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about a trek, region or price..."
                            aria-label="Chat message"
                        />
                        <button type="submit" aria-label="Send message">
                            ➤
                        </button>
                    </form>

                    <div className="chatbot-footer">
                        <Link href="/contact" onClick={() => setOpen(false)}>
                            Talk to a human instead →
                        </Link>
                    </div>
                </div>
            )}

            <button
                type="button"
                className={`chatbot-fab ${open ? "open" : ""}`}
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? "Close AI chat" : "Open AI chat"}
            >
                {open ? (
                    <span aria-hidden="true">✕</span>
                ) : (
                    <span className="chatbot-fab-inner" aria-hidden="true">
                        <span className="chatbot-fab-avatar" />
                    </span>
                )}
                {!open && <span className="chatbot-fab-label">Ask TrekBot</span>}
                {!open && <span className="chatbot-fab-badge" aria-hidden="true">1</span>}
            </button>
        </>
    );
}
