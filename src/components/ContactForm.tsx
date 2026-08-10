"use client";

import { useMemo, useState, type FormEvent } from "react";
import { treks } from "@/data/treks";
import { addEnquiry, makeId } from "@/admin/admin-store";

const CONTACT_EMAIL = "hello@trekkingnepal.example";

function makeReference(): string {
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
    let s = "";
    for (let i = 0; i < 6; i++) {
        s += chars[Math.floor(Math.random() * chars.length)];
    }
    return `ENQ-${s}`;
}

export default function ContactForm() {
    const [sent, setSent] = useState(false);
    const [ref, setRef] = useState<string | null>(null);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [trek, setTrek] = useState("");
    const [dates, setDates] = useState("");
    const [msg, setMsg] = useState("");

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const reference = makeReference();
        setRef(reference);
        setSent(true);

        // Persist the enquiry so it appears in the /admin panel.
        addEnquiry({
            id: makeId("enq"),
            reference,
            name,
            email,
            trek,
            dates,
            message: msg,
            status: "new",
            createdAt: new Date().toISOString(),
        });
    }

    function reset() {
        setSent(false);
        setRef(null);
        setName("");
        setEmail("");
        setTrek("");
        setDates("");
        setMsg("");
    }

    const mailtoHref = useMemo(() => {
        if (!ref) return "#";
        const subject = `Trek enquiry ${ref}${trek ? ` — ${trek}` : ""}`;
        const body = [
            `Enquiry reference: ${ref}`,
            name ? `Name: ${name}` : "",
            email ? `Email: ${email}` : "",
            trek ? `Trek: ${trek}` : "",
            dates ? `Preferred dates: ${dates}` : "",
            msg ? `Message:\n${msg}` : "",
        ]
            .filter(Boolean)
            .join("\n");
        return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
            subject
        )}&body=${encodeURIComponent(body)}`;
    }, [ref, name, email, trek, dates, msg]);

    if (sent) {
        return (
            <div className="contact-success">
                <div className="contact-success-icon" aria-hidden="true">
                    ✓
                </div>
                <h3>Enquiry received</h3>
                <p>
                    Thanks{name ? `, ${name.split(" ")[0]}` : ""} — your enquiry is with
                    our Kathmandu team. We reply to every message within one business day.
                </p>
                {ref && <p className="contact-ref">Reference: {ref}</p>}
                <div className="btn-row">
                    <a className="btn btn-primary" href={mailtoHref}>
                        Email your enquiry to us
                    </a>
                    <button type="button" className="btn btn-ghost" onClick={reset}>
                        Send another enquiry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <form id="enquiryForm" onSubmit={handleSubmit}>
            <div className="form-grid">
                <div className="field">
                    <label htmlFor="fname">Full Name</label>
                    <input
                        type="text"
                        id="fname"
                        name="fname"
                        autoComplete="name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="field">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="field">
                    <label htmlFor="trek">Trek Interested In</label>
                    <select
                        id="trek"
                        name="trek"
                        value={trek}
                        onChange={(e) => setTrek(e.target.value)}
                    >
                        <option value="" disabled>
                            Choose a trek
                        </option>
                        {treks.map((t) => (
                            <option key={t.slug} value={t.name}>
                                {t.name}
                            </option>
                        ))}
                        <option value="not-sure">Not sure yet — suggest one</option>
                    </select>
                </div>
                <div className="field">
                    <label htmlFor="dates">Preferred Dates</label>
                    <input
                        type="text"
                        id="dates"
                        name="dates"
                        placeholder="e.g. March 2027"
                        value={dates}
                        onChange={(e) => setDates(e.target.value)}
                    />
                </div>
                <div className="field full">
                    <label htmlFor="msg">Anything else we should know?</label>
                    <textarea
                        id="msg"
                        name="msg"
                        placeholder="Group size, fitness level, prior trekking experience..."
                        value={msg}
                        onChange={(e) => setMsg(e.target.value)}
                    />
                </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: 24 }}>
                Send Enquiry
            </button>
            <p className="form-note" id="formNote">
                We usually reply within one business day. No payment is taken here.
            </p>
        </form>
    );
}
