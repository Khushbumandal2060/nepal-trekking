"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import type { Trek } from "@/lib/types";

interface BookingFlowProps {
    treks: Trek[];
    initialSlug?: string;
}

type Step = 1 | 2 | 3;

const CONTACT_EMAIL = "hello@trekkingnepal.example";

/** "$1,450" -> 1450 (used only for an indicative per-person estimate). */
function parsePrice(price: string): number {
    const n = Number(price.replace(/[^0-9]/g, ""));
    return Number.isFinite(n) ? n : 0;
}

function formatMoney(n: number): string {
    return "$" + n.toLocaleString("en-US");
}

function makeReference(): string {
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
    let s = "";
    for (let i = 0; i < 6; i++) {
        s += chars[Math.floor(Math.random() * chars.length)];
    }
    return `TN-${s}`;
}

/** The next `count` calendar months as "YYYY-MM" strings, starting this month. */
function upcomingMonths(count: number): string[] {
    const out: string[] = [];
    const now = new Date();
    for (let i = 0; i < count; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
        out.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    }
    return out;
}

function monthLabel(ym: string): string {
    const [y, m] = ym.split("-").map(Number);
    return new Date(y, m - 1, 1).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });
}

function BookingErrors({ errors }: { errors: string[] }) {
    if (!errors.length) return null;
    return (
        <div className="booking-errors" role="alert">
            <ul>
                {errors.map((e) => (
                    <li key={e}>{e}</li>
                ))}
            </ul>
        </div>
    );
}

export default function BookingFlow({ treks, initialSlug }: BookingFlowProps) {
    const [step, setStep] = useState<Step>(1);
    const [done, setDone] = useState(false);
    const [ref, setRef] = useState<string | null>(null);
    const topRef = useRef<HTMLDivElement>(null);

    // Step 1 — trek & departure
    const [trekSlug, setTrekSlug] = useState(initialSlug ?? "");
    const [month, setMonth] = useState("");
    const [departType, setDepartType] = useState<"fixed" | "private">("fixed");
    const [groupSize, setGroupSize] = useState(2);

    // Step 2 — traveller
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [country, setCountry] = useState("");
    const [notes, setNotes] = useState("");

    const [errors, setErrors] = useState<string[]>([]);

    const months = useMemo(() => upcomingMonths(18), []);
    const trek = treks.find((t) => t.slug === trekSlug);
    const perPerson = trek ? parsePrice(trek.price) : 0;
    const total = perPerson * groupSize;

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [step, done]);

    function validateStep1(): string[] {
        const e: string[] = [];
        if (!trekSlug) e.push("Choose a trek to continue.");
        if (!month) e.push("Choose a departure month.");
        if (!Number.isInteger(groupSize) || groupSize < 1 || groupSize > 16) {
            e.push("Group size must be between 1 and 16.");
        }
        return e;
    }

    function validateStep2(): string[] {
        const e: string[] = [];
        if (name.trim().length < 2) e.push("Enter your full name.");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            e.push("Enter a valid email address.");
        }
        if (phone.trim().length < 6) e.push("Enter a phone number we can reach you on.");
        if (country.trim().length < 2) e.push("Enter your country.");
        return e;
    }

    function handleNext(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const errs = step === 1 ? validateStep1() : validateStep2();
        setErrors(errs);
        if (!errs.length) setStep((s) => (s + 1) as Step);
    }

    function handleConfirm(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const errs = validateStep2();
        setErrors(errs);
        if (errs.length) {
            setStep(2);
            return;
        }
        setRef(makeReference());
        setDone(true);
    }

    function reset() {
        setStep(1);
        setDone(false);
        setRef(null);
        setTrekSlug(initialSlug ?? "");
        setMonth("");
        setDepartType("fixed");
        setGroupSize(2);
        setName("");
        setEmail("");
        setPhone("");
        setCountry("");
        setNotes("");
        setErrors([]);
    }

    const mailtoHref = useMemo(() => {
        if (!ref || !trek) return "#";
        const subject = `Booking enquiry ${ref} — ${trek.name}`;
        const body = [
            `Booking reference: ${ref}`,
            `Trek: ${trek.name} (${trek.days} days, ${trek.regionLabel})`,
            `Departure: ${monthLabel(month)}`,
            `Departure type: ${departType === "fixed" ? "Fixed departure" : "Private departure"}`,
            `Group size: ${groupSize} traveller${groupSize === 1 ? "" : "s"}`,
            `Estimated total: ${formatMoney(total)} (${trek.price} pp)`,
            "",
            `Lead traveller: ${name}`,
            `Email: ${email}`,
            `Phone: ${phone}`,
            `Country: ${country}`,
            notes ? `Notes: ${notes}` : "",
        ]
            .filter(Boolean)
            .join("\n");
        return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }, [ref, trek, month, departType, groupSize, total, name, email, phone, country, notes]);

    const steps: { n: Step; label: string }[] = [
        { n: 1, label: "Trek & dates" },
        { n: 2, label: "Your details" },
        { n: 3, label: "Review" },
    ];

    return (
        <div className="booking" ref={topRef}>
            {!done ? (
                <>
                    <ol className="booking-steps" aria-label="Booking progress">
                        {steps.map((s) => (
                            <li
                                key={s.n}
                                className={
                                    step === s.n ? "active" : step > s.n ? "done" : ""
                                }
                                aria-current={step === s.n ? "step" : undefined}
                            >
                                <span className="booking-step-num">
                                    {step > s.n ? "✓" : s.n}
                                </span>
                                <span className="booking-step-label">{s.label}</span>
                            </li>
                        ))}
                    </ol>

                    <div className="booking-card">
                        {step === 1 && (
                            <form noValidate onSubmit={handleNext} className="booking-form">
                                <h2>Trek & departure</h2>

                                <div className="form-grid">
                                    <div className="field full">
                                        <label htmlFor="bk-trek">
                                            Which trek would you like to book?
                                        </label>
                                        <select
                                            id="bk-trek"
                                            name="bk-trek"
                                            value={trekSlug}
                                            onChange={(e) => setTrekSlug(e.target.value)}
                                        >
                                            <option value="" disabled>
                                                Choose a trek
                                            </option>
                                            {treks.map((t) => (
                                                <option key={t.slug} value={t.slug}>
                                                    {t.name} — {t.days} days · {t.price} pp
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="field">
                                        <label htmlFor="bk-month">Departure month</label>
                                        <select
                                            id="bk-month"
                                            name="bk-month"
                                            value={month}
                                            onChange={(e) => setMonth(e.target.value)}
                                        >
                                            <option value="" disabled>
                                                Select a month
                                            </option>
                                            {months.map((m) => (
                                                <option key={m} value={m}>
                                                    {monthLabel(m)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="field">
                                        <label htmlFor="bk-size">Group size</label>
                                        <input
                                            id="bk-size"
                                            name="bk-size"
                                            type="number"
                                            min={1}
                                            max={16}
                                            value={groupSize}
                                            onChange={(e) =>
                                                setGroupSize(Number(e.target.value))
                                            }
                                        />
                                    </div>
                                </div>

                                <fieldset className="booking-radio">
                                    <legend>Departure type</legend>
                                    <div className="radio-row">
                                        <label className="radio-card">
                                            <input
                                                type="radio"
                                                name="depart"
                                                value="fixed"
                                                checked={departType === "fixed"}
                                                onChange={() => setDepartType("fixed")}
                                            />
                                            <span>
                                                <b>Fixed departure</b>
                                                <small>Join a scheduled group on set dates.</small>
                                            </span>
                                        </label>
                                        <label className="radio-card">
                                            <input
                                                type="radio"
                                                name="depart"
                                                value="private"
                                                checked={departType === "private"}
                                                onChange={() => setDepartType("private")}
                                            />
                                            <span>
                                                <b>Private departure</b>
                                                <small>Your own group, any date that suits you.</small>
                                            </span>
                                        </label>
                                    </div>
                                </fieldset>

                                {trek && (
                                    <div className="booking-preview">
                                        <span className="booking-preview-label">
                                            Your pick
                                        </span>
                                        <p className="booking-preview-name">{trek.name}</p>
                                        <p className="booking-preview-meta">
                                            {trek.days} days · {trek.regionLabel} ·{" "}
                                            {trek.altitude} · {trek.grade}
                                        </p>
                                    </div>
                                )}

                                <BookingErrors errors={errors} />

                                <div className="booking-nav">
                                    <button type="submit" className="btn btn-primary">
                                        Continue — your details
                                    </button>
                                </div>
                            </form>
                        )}

                        {step === 2 && (
                            <form noValidate onSubmit={handleNext} className="booking-form">
                                <h2>Your details</h2>
                                <div className="form-grid">
                                    <div className="field">
                                        <label htmlFor="bk-name">Full name</label>
                                        <input
                                            id="bk-name"
                                            name="bk-name"
                                            type="text"
                                            autoComplete="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="As it appears on your passport"
                                        />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="bk-email">Email</label>
                                        <input
                                            id="bk-email"
                                            name="bk-email"
                                            type="email"
                                            autoComplete="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="bk-phone">Phone / WhatsApp</label>
                                        <input
                                            id="bk-phone"
                                            name="bk-phone"
                                            type="tel"
                                            autoComplete="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="bk-country">Country</label>
                                        <input
                                            id="bk-country"
                                            name="bk-country"
                                            type="text"
                                            autoComplete="country-name"
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value)}
                                        />
                                    </div>
                                    <div className="field full">
                                        <label htmlFor="bk-notes">Anything else?</label>
                                        <textarea
                                            id="bk-notes"
                                            name="bk-notes"
                                            rows={4}
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            placeholder="Fitness level, dietary needs, questions about the route..."
                                        />
                                    </div>
                                </div>

                                <BookingErrors errors={errors} />

                                <div className="booking-nav">
                                    <button
                                        type="button"
                                        className="btn btn-ghost"
                                        onClick={() => {
                                            setErrors([]);
                                            setStep(1);
                                        }}
                                    >
                                        Back
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Review booking
                                    </button>
                                </div>
                            </form>
                        )}

                        {step === 3 && trek && (
                            <form
                                noValidate
                                onSubmit={handleConfirm}
                                className="booking-form"
                            >
                                <h2>Review your booking</h2>

                                <dl className="booking-summary">
                                    <div className="booking-summary-row">
                                        <dt>Trek</dt>
                                        <dd>{trek.name}</dd>
                                    </div>
                                    <div className="booking-summary-row">
                                        <dt>Region</dt>
                                        <dd>{trek.regionLabel}</dd>
                                    </div>
                                    <div className="booking-summary-row">
                                        <dt>Duration</dt>
                                        <dd>{trek.days} days</dd>
                                    </div>
                                    <div className="booking-summary-row">
                                        <dt>Departure</dt>
                                        <dd>
                                            {monthLabel(month)} ·{" "}
                                            {departType === "fixed" ? "Fixed" : "Private"}
                                        </dd>
                                    </div>
                                    <div className="booking-summary-row">
                                        <dt>Travellers</dt>
                                        <dd>{groupSize}</dd>
                                    </div>
                                    <div className="booking-summary-row">
                                        <dt>Lead traveller</dt>
                                        <dd>
                                            {name} · {email} · {phone}
                                        </dd>
                                    </div>
                                    <div className="booking-summary-row">
                                        <dt>From</dt>
                                        <dd>{trek.price} per person</dd>
                                    </div>
                                </dl>

                                <div className="booking-total">
                                    <span>Estimated total</span>
                                    <b>{formatMoney(total)}</b>
                                </div>

                                <p className="booking-note">
                                    No payment is taken now. Our team checks availability and
                                    sends a secure booking link within 24 hours.
                                </p>

                                <BookingErrors errors={errors} />

                                <div className="booking-nav">
                                    <button
                                        type="button"
                                        className="btn btn-ghost"
                                        onClick={() => {
                                            setErrors([]);
                                            setStep(2);
                                        }}
                                    >
                                        Back
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Confirm booking
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </>
            ) : (
                ref &&
                trek && (
                    <div className="booking-confirm">
                        <div className="booking-confirm-icon" aria-hidden="true">
                            ✓
                        </div>
                        <div className="sec-eyebrow">Booking received</div>
                        <h2>Thanks{name ? `, ${name.split(" ")[0]}` : ""} — you&rsquo;re in.</h2>
                        <p className="booking-ref-label">Your booking reference</p>
                        <p className="booking-ref">{ref}</p>

                        <dl className="booking-summary">
                            <div className="booking-summary-row">
                                <dt>Trek</dt>
                                <dd>{trek.name}</dd>
                            </div>
                            <div className="booking-summary-row">
                                <dt>Departure</dt>
                                <dd>
                                    {monthLabel(month)} ·{" "}
                                    {departType === "fixed" ? "Fixed" : "Private"} ·{" "}
                                    {groupSize} traveller{groupSize === 1 ? "" : "s"}
                                </dd>
                            </div>
                            <div className="booking-summary-row">
                                <dt>Lead traveller</dt>
                                <dd>{name}</dd>
                            </div>
                            <div className="booking-summary-row">
                                <dt>Estimated total</dt>
                                <dd>{formatMoney(total)}</dd>
                            </div>
                        </dl>

                        <div className="booking-next">
                            <h3>What happens next</h3>
                            <ol>
                                <li>
                                    Our Kathmandu team reviews availability for{" "}
                                    {monthLabel(month)}.
                                </li>
                                <li>
                                    You get a confirmation at {email} within 24 hours.
                                </li>
                                <li>
                                    We send a secure payment link to lock in your place.
                                </li>
                            </ol>
                        </div>

                        <div className="booking-nav">
                            <a className="btn btn-primary" href={mailtoHref}>
                                Email your booking to us
                            </a>
                            <button
                                type="button"
                                className="btn btn-ghost"
                                onClick={reset}
                            >
                                Book another trek
                            </button>
                        </div>
                    </div>
                )
            )}
        </div>
    );
}
